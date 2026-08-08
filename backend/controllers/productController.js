const Product = require("../models/Product");
const mongoose = require("mongoose");

const isAdmin = (req) => req.user?.role === "admin";

const isOwner = (product, userId) => product.owner.toString() === userId.toString();

const findProductWithAccess = async (req, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { error: { status: 400, message: "Identifiant de produit invalide." } };
  }

  const product = await Product.findById(productId);
  if (!product) {
    return { error: { status: 404, message: "Produit introuvable." } };
  }

  if (!isAdmin(req) && !isOwner(product, req.user.id)) {
    return { error: { status: 403, message: "Accès refusé." } };
  }

  return { product };
};

const createProduct = async (req, res) => {
  try {
    const { name, description, category, quantity, price, currency, imageUrl } = req.body;

    if (!name || !category || quantity === undefined || price === undefined || !currency) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs obligatoires (nom, catégorie, quantité, prix, devise).",
      });
    }

    const product = await Product.create({
      name,
      description: description || "",
      category,
      quantity,
      price,
      currency,
      imageUrl: imageUrl || "",
      owner: req.user.id,
    });

    res.status(201).json({ message: "Produit créé avec succès.", product });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const filter = isAdmin(req) ? {} : { owner: req.user.id };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { product, error } = await findProductWithAccess(req, req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product, error } = await findProductWithAccess(req, req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { name, description, category, quantity, price, currency, imageUrl } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;
    if (price !== undefined) product.price = price;
    if (currency !== undefined) product.currency = currency;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();
    res.json({ message: "Produit mis à jour avec succès.", product });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product, error } = await findProductWithAccess(req, req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    await product.deleteOne();
    res.json({ message: "Produit supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
