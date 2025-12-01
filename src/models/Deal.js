const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },          // prix remisé
    originalPrice: { type: Number, required: true },  // prix de base
    url: { type: String, required: true },

    category: {
      type: String,
      enum: ["High-Tech", "Maison", "Mode", "Loisirs", "Autre"],
      default: "Autre",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",        
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);