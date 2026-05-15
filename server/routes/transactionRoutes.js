const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getMonthlyTrend,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");

router.get("/summary", protect, getSummary);
router.get("/trend", protect, getMonthlyTrend);
router.get("/", protect, getTransactions);
router.post("/", protect, addTransaction);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
