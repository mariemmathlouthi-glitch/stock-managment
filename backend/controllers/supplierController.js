const Supplier = require("../models/Supplier");

const filterFor = (req) => (req.user.role === "admin" ? {} : { owner: req.user.id });

exports.getSuppliers = async (req, res) => {
  try { res.json({ suppliers: await Supplier.find(filterFor(req)).sort({ name: 1 }) }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ supplier });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate({ _id: req.params.id, ...filterFor(req) }, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ message: "Fournisseur introuvable." });
    res.json({ supplier });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, ...filterFor(req) });
    if (!supplier) return res.status(404).json({ message: "Fournisseur introuvable." });
    res.json({ message: "Fournisseur supprimé." });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
