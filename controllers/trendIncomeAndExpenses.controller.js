const trendIncomeAndExpenses = require('../services/trendIncomeAndExpenses.service')

exports.getCompareByType = async (req, res) => {
  try {
    const { type } = req.params;

    let result;

    switch (type) {

      case "hourly":
        result = await trendIncomeAndExpenses.getHourlySummary();
        break;
      case "last7days":
        result = await trendIncomeAndExpenses.getLast7DaysSummary();
        break;
      case "last30days":
        result = await trendIncomeAndExpenses.getLast30DaysSummary();
        break;

      // 📅 รวมยอดรายเดือน
      case "monthly":
        result = await trendIncomeAndExpenses.getMonthlySummary();
        break;

      // 🧾 รายละเอียดรายเดือน (ต้องมี query ?year=2025&month=10)
      case "monthly-details": {
        const { year, month } = req.query;
        if (!year || !month)
          return res.status(400).json({ error: "Missing year or month query params" });

        result = await trendIncomeAndExpenses.getMonthlyDetails(Number(year), Number(month));
        break;
      }

      // 📆 รวมยอดรายปี
      case "yearly":
        result = await trendIncomeAndExpenses.getYearlySummary();
        break;

      // ❌ หาก type ไม่ตรง
      default:
        return res.status(400).json({
          error: "Invalid type. Use one of: net, monthly, monthly-details, yearly",
        });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Controller error (getBalanceByType):", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};