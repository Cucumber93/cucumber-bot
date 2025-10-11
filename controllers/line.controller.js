// controllers/lineController.js
const expenseService = require('../services/expense.service');

async function handleEvent(event, config) {
  try {
    // แค่ตัวอย่าง: สนใจเฉพาะข้อความ text
    if (event.type !== 'message' || event.message.type !== 'text') return null;
    const text = event.message.text;
    const result = await expenseService.addExpenseFromMessage(text);
    // result.replyMessages เป็น array ของ message objects ที่จะส่งกลับ
    if (result && result.replyMessages) {
      const lineClient = new (require('@line/bot-sdk').Client)(config);
      try {
        await lineClient.replyMessage(event.replyToken, result.replyMessages);
      } catch (err) {
        console.error('replyMessage failed:', err);
      }
    }
    return null;
  } catch (err) {
    console.error('handleEvent error:', err);
    return null;
  }
}

module.exports = { handleEvent };
