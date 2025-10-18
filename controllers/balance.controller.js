const balanceService = require("../services/balance.service.js");

exports.getBalance = async (req, res) => {
  try {
    const {userId} = req.body
    if(!userId) return res.status(400).json({error: 'Missing userId'})

    const result = await balanceService.calculateNetBalance(userId);
    res.json(result);
  } catch (err) {
    console.error("❌ Controller error (getBalanceByType):", err.message);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};