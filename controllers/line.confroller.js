const line = require('@line/bot-sdk');
const expenseService = require('../services/expense.service');

const clientCache = {}; // cache clients per token

function getClient(config) {
  const token = config.channelAccessToken;
  if (!clientCache[token]) clientCache[token] = new line.Client(config);
  return clientCache[token];
}

async function handleEvent(event, config) {
  const client = getClient(config);

  // สนใจเฉพาะ message text เท่านั้น
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text = event.message.text.trim();
  // (ในอนาคต: แยก user ด้วย event.source.userId)
  const result = await expenseService.handleUserText(text);

  if (result && result.replyMessages && result.replyMessages.length) {
    return client.replyMessage(event.replyToken, result.replyMessages);
  }

  // fallback
  return client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่เข้าใจคำสั่ง — พิมพ์ "ช่วย" เพื่อดูคำสั่ง' });
}

module.exports = { handleEvent };
