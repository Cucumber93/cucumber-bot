const express = require("express");
const router = express.Router();

// ✅ ดึงเฉพาะ function ที่ต้องใช้
const { lineLoginCallback, verifyToken } = require("../controllers/auth.controller");

// ✅ ต้องเป็น function เสมอ
router.get("/callback", lineLoginCallback);
router.get("/verify", verifyToken);

module.exports = router; // ✅ อย่าลืม export router
