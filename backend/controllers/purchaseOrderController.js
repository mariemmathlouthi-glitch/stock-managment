const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");

const filterFor = (req) => (req.user.role === "admin" ? {} : { owner: req.user.id });

const createStockError = (message) => {
  const error = new Error(message);
  error.status = 409;
  return error;
};

const groupItemsByProduct = (items) => {
  const quantities = new Map();

  items.forEach((item) => {
    if (!item.product) throw createStockError(`Le produit « ${item.name} » est introuvable.`);
    const productId = item.product.toString();
    quantities.set(productId, (quantities.get(productId) || 0) + Number(item.quantity));
  });

  return [...quantities].map(([productId, quantity]) => ({ productId, quantity }));
};

const removeFromStock = async (items, owner) => {
  const requestedItems = groupItemsByProduct(items);
  const productIds = requestedItems.map(({ productId }) => productId);
  const products = await Product.find({ _id: { $in: productIds }, owner }).select("name quantity").lean();
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));

  requestedItems.forEach(({ productId, quantity }) => {
    const product = productsById.get(productId);
    if (!product) throw createStockError("Un produit de la commande est introuvable.");
    if (product.quantity < quantity) {
      throw createStockError(
        `Stock insuffisant pour « ${product.name} » : ${product.quantity} disponible(s), ${quantity} demandé(s).`
      );
    }
  });

  const updatedProducts = [];
  try {
    for (const { productId, quantity } of requestedItems) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, owner, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      if (!product) throw createStockError("Le stock a été modifié. Veuillez réessayer la validation.");
      updatedProducts.push({ productId, quantity, product });
    }
  } catch (error) {
    await Promise.all(
      updatedProducts.map(({ productId, quantity }) =>
        Product.findByIdAndUpdate(productId, { $inc: { quantity } })
      )
    );
    throw error;
  }

  return updatedProducts.map(({ product }) => product);
};

exports.getOrders = async (req, res) => {
  try { res.json({ orders: await PurchaseOrder.find(filterFor(req)).populate("supplier", "name contact email phone").sort({ createdAt: -1 }) }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createOrder = async (req, res) => {
  try {
    const { supplier, items, orderDate, expectedDeliveryDate, status, movementType = "in" } = req.body;
    if (!supplier || !Array.isArray(items) || !items.length || !orderDate) return res.status(400).json({ message: "Fournisseur, articles et date sont requis." });
    const invalidItem = items.some(
      (item) =>
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0 ||
        (!item.product && (!item.isNewProduct || !item.name || !item.category))
    );
    if (invalidItem) return res.status(400).json({ message: "Chaque article doit avoir une quantité, un prix et un produit ou les informations d’un nouveau produit." });
    
    const sanitizedItems = items.map((item) => {
      const cleanItem = { ...item };
      if (cleanItem.isNewProduct || !cleanItem.product) {
        delete cleanItem.product;
        cleanItem.isNewProduct = true;
      }
      return cleanItem;
    });

    const number = `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const order = await PurchaseOrder.create({ number, supplier, items: sanitizedItems, orderDate, expectedDeliveryDate: expectedDeliveryDate || null, status, movementType, owner: req.user.id });
    res.status(201).json({ order: await order.populate("supplier", "name contact email phone") });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({ _id: req.params.id, ...filterFor(req) });
    if (!order) return res.status(404).json({ message: "Commande introuvable." });
    if (!["draft", "pending"].includes(order.status)) return res.status(400).json({ message: "Cette commande ne peut plus être modifiée." });
    const isBeingReceived = order.movementType === "in" && req.body.status === "delivered" && order.status !== "delivered";
    const isBeingValidatedAsOutput =
      order.movementType === "out" && req.body.status === "confirmed" && order.status !== "confirmed";

    let updatedProducts = [];
    if (isBeingValidatedAsOutput) {
      updatedProducts = await removeFromStock(order.items, order.owner);
    }

    Object.assign(order, req.body);
    if (isBeingReceived) {
      await Promise.all(
        order.items.map((item) => {
          if (item.product) {
            return Product.findByIdAndUpdate(item.product, { $inc: { quantity: item.quantity } });
          }
          return Product.create({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.unitPrice,
            currency: item.currency || "TND",
            owner: order.owner,
          });
        })
      );
    }
    await order.save(); res.json({ order, updatedProducts });
  } catch (error) { res.status(error.status || 400).json({ message: error.message }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findOne({ _id: req.params.id, ...filterFor(req) });
    if (!order) return res.status(404).json({ message: "Commande introuvable." });
    order.status = "cancelled"; await order.save(); res.json({ order });
  } catch (error) { res.status(400).json({ message: error.message }); }
};
