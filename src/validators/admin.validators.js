const { body } = require("express-validator");

const moderateDealValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be 'approved' or 'rejected'"),
];

const updateUserRoleValidator = [
  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "moderator", "admin"])
    .withMessage("Role must be user, moderator or admin"),
];

module.exports = {
  moderateDealValidator,
  updateUserRoleValidator,
};