const trendExpensesService = require('../services/trendEcpenses.service.js');

async function getTrendExpensesHourly(req, res) {
    try{
        const trendExpenses = await trendExpensesService.getTrendExpensesHourly();
        res.json(trendExpenses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function getTrendExpensesLast7Days(req, res) {
    try{
        const trendExpenses = await trendExpensesService.getTrendExpensesLast7Days();
        res.json(trendExpenses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function getTrendExpensesLastt30Days(req, res) {
    try{
        const trendExpenses = await trendExpensesService.getTrendExpensesLastt30Days();
        res.json(trendExpenses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getTrendExpensesHourly,getTrendExpensesLast7Days,getTrendExpensesLastt30Days };