const Deal = require("../models/Deal");
const { validationResult } = require("express-validator");

// GET /api/deals - liste publique des deals APPROVED
exports.getDeals = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;

    const filter = { status: "approved" };

    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const deals = await Deal.find(filter)
      .sort({ createdAt: -1 })
      .populate("authorId", "username");

    res.json(deals);
  } catch (err) {
    console.error("getDeals error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/deals/:id - détail d’un deal
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("authorId", "username email");

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json(deal);
  } catch (err) {
    console.error("getDealById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/deals - création (user connecté)
exports.createDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, price, originalPrice, url, category } = req.body;

    const deal = await Deal.create({
      title,
      description,
      price,
      originalPrice,
      url,
      category,
      status: "pending",
      authorId: req.user._id,
    });

    res.status(201).json(deal);
  } catch (err) {
    console.error("createDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/deals/:id - modifier son deal si encore pending
exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your deal" });
    }

    if (deal.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Deal already moderated, cannot edit" });
    }

    const fields = ["title", "description", "price", "originalPrice", "url", "category"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) deal[f] = req.body[f];
    });

    await deal.save();
    res.json(deal);
  } catch (err) {
    console.error("updateDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/deals/:id - supprimer son deal
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your deal" });
    }

    await deal.deleteOne();
    res.json({ message: "Deal deleted" });
  } catch (err) {
    console.error("deleteDeal error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};