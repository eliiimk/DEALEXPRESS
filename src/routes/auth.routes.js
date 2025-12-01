const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { register, login, me } = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Username must be 3-30 alphanumeric characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// GET /api/auth/me (protégée)
router.get("/me", authenticate, me);

module.exports = router;

