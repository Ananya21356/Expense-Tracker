const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// @desc    Get budgets for a month
// @route   GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month, year });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const enriched = await Promise.all(
      budgets.map(async (b) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user._id),
              type: "expense",
              category: b.category,
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return {
          ...b.toObject(),
          spent: spent[0]?.total || 0,
          percentage:
            b.limit > 0
              ? Math.round(((spent[0]?.total || 0) / b.limit) * 100)
              : 0,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
const upsertBudget = async (req, res) => {
  const { category, limit, month, year } = req.body;
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { limit },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await budget.deleteOne();
    res.json({ message: "Budget removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
