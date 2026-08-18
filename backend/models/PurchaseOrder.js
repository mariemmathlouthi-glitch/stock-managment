const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  isNewProduct: { type: Boolean, default: false },
  name: { type: String, required: true },
  category: String,
  reference: String,
  quantity: { type: Number, min: 1, required: true },
  unitPrice: { type: Number, min: 0, required: true },
  currency: { type: String, enum: ["EUR", "TND", "USD"], default: "TND" },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [itemSchema],
    orderDate: { type: Date, required: true },
    expectedDeliveryDate: Date,
    movementType: {
      type: String,
      enum: ["in", "out"],
      default: "in",
    },
    status: { type: String, enum: ["draft", "pending", "confirmed", "delivered", "cancelled"], default: "draft" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, collection: "produit_commandes" }
);

module.exports = mongoose.model("ProduitCommande", purchaseOrderSchema);
