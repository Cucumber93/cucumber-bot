const express = require("express");
const router = express.Router();
const trendIncomeAndExpensesController = require('../controllers/trendIncomeAndExpenses.controller.js')

router.get("/:type", trendIncomeAndExpensesController.getCompareByType);

module.exports = router;