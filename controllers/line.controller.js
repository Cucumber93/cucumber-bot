const line = require("@line/bot-sdk");
const { saveUserMessage } = require("../services/line.service");

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

async function handleLineMessage(req, res) {
  try {
    if (!req.body || !req.body.events) {
      console.error("❌ Invalid webhook payload:", req.body);
      return res.status(400).send("Bad Request");
    }

    const events = req.body.events;

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userId = event.source.userId;
        const text = event.message.text;

        const result = await saveUserMessage(userId, text);

        await client.replyMessage(event.replyToken, {
          type: "text",
          text: result.message,
        });
      }
    }
  } catch (err) {
    console.error("Line webhook error:", err);
    if (res && res.status) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = { handleLineMessage };
