const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "La catégorie est requise"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "La quantité est requise"],
      min: [0, "La quantité ne peut pas être négative"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    currency: {
      type: String,
      required: [true, "La devise est requise"],
      default: "TND",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    minStockThreshold: {
      type: Number,
      min: [0, "Le seuil de stock ne peut pas être négatif"],
      default: 5,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
