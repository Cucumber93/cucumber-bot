import line from "@line/bot-sdk";
import { saveUserMessage } from "../services/line.service.js";

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

export const handleLineMessage = async (req, res) => {
  try {
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

    res.status(200).send("OK");
  } catch (err) {
    console.error("Line webhook error:", err);
    res.status(500).json({ error: err.message });
  }
};
