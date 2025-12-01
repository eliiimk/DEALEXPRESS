const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Pour lister rapidement les commentaires d'un deal
commentSchema.index({ dealId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);