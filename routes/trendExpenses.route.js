
const trendExpensesController = require('../controllers/trendExpenses.controller.js');

const router = require('express').Router();

router.get('/hourly', trendExpensesController.getTrendExpensesHourly);
router.get('/last-7-days', trendExpensesController.getTrendExpensesLast7Days);
router.get('/last-30-days', trendExpensesController.getTrendExpensesLastt30Days);

module.exports = router;