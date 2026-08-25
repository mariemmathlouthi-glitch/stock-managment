const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    prenom: {
      type: String,
      required: true,
      trim: true
    },

    nom: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    telephone: {
      type: String,
      required: true,
      trim: true
    },

    motDePasse: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    estActif: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);