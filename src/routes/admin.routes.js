const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const {
  getPendingDeals,
  moderateDeal,
  getUsers,
  updateUserRole,
} = require("../controllers/admin.controller");


router.use(authenticate);


router.get("/deals/pending", requireRoles("moderator", "admin"), getPendingDeals);


router.patch(
  "/deals/:id/moderate",
  requireRoles("moderator", "admin"),
  [
    body("status")
      .isIn(["approved", "rejected"])
      .withMessage("Status must be 'approved' or 'rejected'"),
  ],
  moderateDeal
);


router.get("/users", requireRoles("admin"), getUsers);


router.patch(
  "/users/:id/role",
  requireRoles("admin"),
  [
    body("role")
      .isIn(["user", "moderator", "admin"])
      .withMessage("Role must be user, moderator or admin"),
  ],
  updateUserRole
);

module.exports = router;