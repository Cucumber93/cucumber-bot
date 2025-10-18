const expenseService = require("../services/expense.service.js");

async function getAll(req, res) {
  try {
    const {userId} = req.body
    if(!userId) return res.status(400).json({error: 'Missing userId'})
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const {userId} = req.body
    if(!userId) return res.status(400).json({error:'Missing userId'})

    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAll, getById };
