const express = require("express");
const line = require("@line/bot-sdk");
const { handleLineMessage } = require("../controllers/line.controller");

const router = express.Router();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// health check
router.get("/", (req, res) => res.send("OK - webhook"));

// ✅ สำคัญ: ต้องให้ line.middleware(config) เป็น middleware แรกใน route นี้
router.post("/", line.middleware(config), async (req, res) => {
  try {
    console.log(">>>> Webhook events:", JSON.stringify(req.body.events));

    // ส่ง req,res ไปให้ controller จัดการ
    await handleLineMessage(req, res);

    // ปิด response ให้ LINE ทันที
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Unhandled webhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
