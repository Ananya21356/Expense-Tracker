const express = require("express");
const router = express.Router();
const { getBudgets, upsertBudget, deleteBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getBudgets);
router.post("/", protect, upsertBudget);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
