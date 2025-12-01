const Deal = require("../models/Deal");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// GET /api/admin/deals/pending
const getPendingDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("authorId", "username email");
    res.json(deals);
  } catch (err) {
    console.error("getPendingDeals error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/deals/:id/moderate
const moderateDeal = async (req, res) => {
  const { status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    deal.status = status;
    await deal.save();

    res.json({
      message: `Deal ${status}`,
      deal,
    });
  } catch (err) {
    console.error("moderateDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/users?page=1&limit=10
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("getUsers error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("updateUserRole error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPendingDeals,
  moderateDeal,
  getUsers,
  updateUserRole,
};