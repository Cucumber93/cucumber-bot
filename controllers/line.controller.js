// controllers/line.controller.js
// const { Client } = require('@line/bot-sdk');
// const expenseService = require('../services/expense.service.js');

import { Client } from '@line/bot-sdk';
import * as expenseService from '../services/expense.service.js';

async function handleEvent(event, config) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      console.log('⚠️ Non-text event, skipping.');
      return null;
    }

    console.log('💬 User message:', event.message.text);

    const result = await expenseService.addExpenseFromMessage(event.message.text);
    console.log('🧾 Service result:', result);

    // Always create client fresh to ensure proper config
    const client = new Client(config);

    // If service didn’t return replyMessages, send default reply
    const messages = (result && result.replyMessages) || [
      { type: 'text', text: '❌ No reply message returned from service.' },
    ];

    await client.replyMessage(event.replyToken, messages);
    console.log('✅ Reply sent to LINE:', messages);
  } catch (err) {
    console.error('❌ handleEvent error:', err);
  }
}

module.exports = { handleEvent };
