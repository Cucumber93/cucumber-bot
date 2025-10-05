// send-test-event.js (ใช้ global fetch ของ Node 18+)
require('dotenv').config();
const crypto = require('crypto');

const webhookUrl = process.argv[2] || process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';
const secret = process.env.LINE_CHANNEL_SECRET;
if (!secret) {
  console.error('Set LINE_CHANNEL_SECRET in .env or environment');
  process.exit(1);
}

const event = {
  events: [
    {
      replyToken: "00000000000000000000000000000000",
      type: "message",
      timestamp: Date.now(),
      source: { userId: "U_TEST" },
      message: { id: "1", type: "text", text: "ช่วย" }
    }
  ]
};

(async () => {
  try {
    const body = JSON.stringify(event);
    const signature = crypto.createHmac('sha256', secret).update(body).digest('base64');
    console.log('Computed signature:', signature);

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Line-Signature': signature
      },
      body
    });

    console.log('status', res.status);
    const text = await res.text();
    console.log('response text:', text);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
