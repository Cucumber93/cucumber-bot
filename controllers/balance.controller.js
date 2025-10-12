const balanceService = require("../services/balance.service.js");

exports.getBalanceByType = async (req, res) => {
  try {
    const { type } = req.params;

    let result;

    switch (type) {
      // 🧮 Net Balance (รอบเดือนปัจจุบัน)
      case "net":
        result = await balanceService.calculateNetBalance();
        break;

      // 📅 รวมยอดรายเดือน
      case "monthly":
        result = await balanceService.getMonthlySummary();
        break;

      // 🧾 รายละเอียดรายเดือน (ต้องมี query ?year=2025&month=10)
      case "monthly-details": {
        const { year, month } = req.query;
        if (!year || !month)
          return res.status(400).json({ error: "Missing year or month query params" });

        result = await balanceService.getMonthlyDetails(Number(year), Number(month));
        break;
      }

      // 📆 รวมยอดรายปี
      case "yearly":
        result = await balanceService.getYearlySummary();
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
