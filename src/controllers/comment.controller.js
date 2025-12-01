const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Deal = require("../models/Deal");

// POST /api/deals/:dealId/comments
const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;
  const { dealId } = req.params;
  const userId = req.user._id;

  try {
    // Vérifier que le deal existe et est approuvé
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.status !== "approved") {
      return res
        .status(400)
        .json({ message: "You can only comment on approved deals" });
    }

    const comment = await Comment.create({
      dealId,
      userId,
      content,
    });

    const populated = await comment.populate("userId", "username");

    res.status(201).json({
      message: "Comment created",
      comment: populated,
    });
  } catch (err) {
    console.error("createComment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/deals/:dealId/comments
const getCommentsForDeal = async (req, res) => {
  const { dealId } = req.params;

  try {
    const comments = await Comment.find({ dealId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.json(comments);
  } catch (err) {
    console.error("getCommentsForDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/comments/:id
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Seul l'auteur ou un admin/modo peut modifier
    if (
      comment.userId.toString() !== userId.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(403).json({ message: "Not allowed to edit this comment" });
    }

    comment.content = content;
    await comment.save();

    const populated = await comment.populate("userId", "username");

    res.json({
      message: "Comment updated",
      comment: populated,
    });
  } catch (err) {
    console.error("updateComment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Seul l'auteur ou admin/modo peut supprimer
    if (
      comment.userId.toString() !== userId.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    await Comment.deleteOne({ _id: id });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("deleteComment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createComment,
  getCommentsForDeal,
  updateComment,
  deleteComment,
};