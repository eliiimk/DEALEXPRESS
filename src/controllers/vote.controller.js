const Vote = require("../models/Vote");
const Deal = require("../models/Deal");
const { validationResult } = require("express-validator");

// POST /api/deals/:id/vote
const voteDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type } = req.body;
  const dealId = req.params.id;
  const userId = req.user._id;

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.status !== "approved") {
      return res
        .status(400)
        .json({ message: "You can only vote on approved deals" });
    }

    let vote = await Vote.findOne({ userId, dealId });

    if (vote) {
      vote.type = type;
      await vote.save();
    } else {
      vote = await Vote.create({ userId, dealId, type });
    }

    const hotCount = await Vote.countDocuments({ dealId, type: "hot" });
    const coldCount = await Vote.countDocuments({ dealId, type: "cold" });
    const temperature = hotCount - coldCount;

    res.json({
      message: "Vote saved",
      vote: {
        userId,
        dealId,
        type,
      },
      stats: {
        hot: hotCount,
        cold: coldCount,
        temperature,
      },
    });
  } catch (err) {
    console.error("voteDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/deals/:id/votes
const getVotesForDeal = async (req, res) => {
  const dealId = req.params.id;

  try {
    const hotCount = await Vote.countDocuments({ dealId, type: "hot" });
    const coldCount = await Vote.countDocuments({ dealId, type: "cold" });
    const temperature = hotCount - coldCount;

    res.json({
      hot: hotCount,
      cold: coldCount,
      temperature,
    });
  } catch (err) {
    console.error("getVotesForDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/deals/:id/vote
const removeVote = async (req, res) => {
  const dealId = req.params.id;
  const userId = req.user._id;

  try {
    const vote = await Vote.findOne({ userId, dealId });
    if (!vote) {
      return res.status(404).json({ message: "No vote found for this deal" });
    }

    await Vote.deleteOne({ userId, dealId });

    const hotCount = await Vote.countDocuments({ dealId, type: "hot" });
    const coldCount = await Vote.countDocuments({ dealId, type: "cold" });
    const temperature = hotCount - coldCount;

    return res.json({
      message: "Vote removed",
      stats: {
        hot: hotCount,
        cold: coldCount,
        temperature,
      },
    });
  } catch (err) {
    console.error("removeVote error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  voteDeal,
  getVotesForDeal,
  removeVote,
};