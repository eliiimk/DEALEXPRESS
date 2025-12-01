const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const {
  createComment,
  getCommentsForDeal,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

// POST /api/deals/:dealId/comments
router.post(
  "/deals/:dealId/comments",
  authenticate,
  [body("content").notEmpty().withMessage("Content is required")],
  createComment
);

// GET /api/deals/:dealId/comments
router.get("/deals/:dealId/comments", getCommentsForDeal);

// PUT /api/comments/:id
router.put(
  "/comments/:id",
  authenticate,
  [body("content").notEmpty().withMessage("Content is required")],
  updateComment
);

// DELETE /api/comments/:id
router.delete("/comments/:id", authenticate, deleteComment);

module.exports = router;