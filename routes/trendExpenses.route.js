
const trendExpensesController = require('../controllers/trendExpenses.controller.js');

const router = require('express').Router();

router.get("/:type", trendExpensesController.getTrendExpenses);

module.exports = router;