
const trendExpensesController = require('../controllers/trendExpenses.controller.js');

const router = require('express').Router();

router.get("/:type", getTrendExpenses);

module.exports = router;