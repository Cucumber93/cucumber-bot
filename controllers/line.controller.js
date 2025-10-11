const { Client } = require("@line/bot-sdk");
const expenseService = require("../services/expense.service.js");

async function handleEvent(event, config) {
  try {
    // ✅ ตรวจว่าข้อความเป็น text หรือไม่
    if (event.type !== "message" || event.message.type !== "text") {
      console.log("⚠️ Non-text event, skipping.");
      return null;
    }

    console.log("💬 User message:", event.message.text);

    // ✅ ส่งข้อความไปยัง service เพื่อบันทึกใน Supabase
    const result = await expenseService.addExpenseFromMessage(event.message.text);
    console.log("🧾 Service result:", result);

    // ✅ สร้าง LINE client ใหม่ทุกครั้งเพื่อความปลอดภัย
    const client = new Client(config);

    // ✅ ถ้า service ไม่มี replyMessages ให้ตอบกลับค่า default
    const messages =
      (result && result.replyMessages) || [
        { type: "text", text: "❌ No reply message returned from service." },
      ];

    // ✅ ส่งข้อความตอบกลับผู้ใช้ใน LINE
    await client.replyMessage(event.replyToken, messages);
    console.log("✅ Reply sent to LINE:", messages);
  } catch (err) {
    console.error("❌ handleEvent error:", err);
  }
}

// ✅ Export แบบ CommonJS
module.exports = { handleEvent };
