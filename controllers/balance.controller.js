const balanceService = require("../services/balance.service.js");

exports.getBalance = async (req, res) => {
  try {
    const result = await balanceService.calculateNetBalance();
    res.json(result);
  } catch (err) {
    console.error("❌ Controller error (getBalanceByType):", err.message);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};