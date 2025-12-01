const { body } = require("express-validator");

const createCommentValidator = [
  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ max: 1000 }).withMessage("Content must be at most 1000 characters"),
];

const updateCommentValidator = [
  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ max: 1000 }).withMessage("Content must be at most 1000 characters"),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
};