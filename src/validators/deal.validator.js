const { body } = require("express-validator");

const createDealValidator = [
  body("title")
    .notEmpty().withMessage("Title is required"),

  body("description")
    .notEmpty().withMessage("Description is required"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("originalPrice")
    .notEmpty().withMessage("Original price is required")
    .isFloat({ gt: 0 }).withMessage("Original price must be greater than 0"),

  body("url")
    .notEmpty().withMessage("URL is required")
    .isURL().withMessage("URL must be valid"),

  body("category")
    .optional()
    .isIn(["High-Tech", "Maison", "Mode", "Loisirs", "Autre"])
    .withMessage("Invalid category"),
];

const updateDealValidator = [
  body("title")
    .optional()
    .notEmpty().withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .notEmpty().withMessage("Description cannot be empty"),

  body("price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("originalPrice")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Original price must be greater than 0"),

  body("url")
    .optional()
    .isURL().withMessage("URL must be valid"),

  body("category")
    .optional()
    .isIn(["High-Tech", "Maison", "Mode", "Loisirs", "Autre"])
    .withMessage("Invalid category"),
];

module.exports = {
  createDealValidator,
  updateDealValidator,
};