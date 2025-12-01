const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
    type: {
      type: String,
      enum: ["hot", "cold"],
      required: true,
    },
  },
  { timestamps: true }
);

// 1 user = 1 vote par deal
voteSchema.index({ userId: 1, dealId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);