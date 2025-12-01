const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} = require("../controllers/deal.controller");
const {
  voteDeal,
  getVotesForDeal,
  removeVote,
} = require("../controllers/vote.controller");

// GET /api/deals → liste publique (approved)
router.get("/", getDeals);

// GET /api/deals/:id → détail d’un deal
router.get("/:id", getDealById);

// POST /api/deals → créer un deal (auth)
router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be > 0"),
    body("originalPrice")
      .isFloat({ gt: 0 })
      .withMessage("Original price must be > 0"),
    body("url").isURL().withMessage("Valid URL required"),
    body("category")
      .optional()
      .isIn(["High-Tech", "Maison", "Mode", "Loisirs", "Autre"])
      .withMessage("Invalid category"),
  ],
  createDeal
);

// PUT /api/deals/:id → modifier son deal (pending + owner)
router.put("/:id", authenticate, updateDeal);

// DELETE /api/deals/:id → supprimer son deal (owner)
router.delete("/:id", authenticate, deleteDeal);

// POST /api/deals/:id/vote → voter HOT/COLD (auth)
router.post(
  "/:id/vote",
  authenticate,
  [
    body("type")
      .isIn(["hot", "cold"])
      .withMessage("type must be 'hot' or 'cold'"),
  ],
  voteDeal
);

// GET /api/deals/:id/votes → stats des votes (public)
router.get("/:id/votes", getVotesForDeal);

// DELETE /api/deals/:id/vote → retirer son vote
router.delete("/:id/vote", authenticate, removeVote);

module.exports = router;