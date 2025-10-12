const trendExpensesService = require('../services/trendEcpenses.service.js');


async function getTrendExpenses(req, res) {
  try {
    const { type } = req.params; // ✅ รับค่าจาก path เช่น /api/trend-expenses/hourly
    let trendExpenses;

    switch (type.toLowerCase()) {
      case "hourly":
        trendExpenses = await trendExpensesService.getTrendExpensesHourly();
        break;

      case "last7days":
        trendExpenses = await trendExpensesService.getTrendExpensesLast7Days();
        break;

      case "last30days":
        trendExpenses = await trendExpensesService.getTrendExpensesLastt30Days();
        break;

      default:
        return res.status(400).json({
          error: "Invalid type. Use 'hourly', 'last7days', or 'last30days'.",
        });
    }

    res.json(trendExpenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getTrendExpenses };