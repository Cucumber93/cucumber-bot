// routes/webhookRoute.js
const express = require('express');
const line = require('@line/bot-sdk');
// correct path and filename (one level up)
const lineController = require('../controllers/line.confroller');

const router = express.Router();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// health-check (GET)
router.get('/', (req, res) => res.send('OK - webhook'));

// IMPORTANT: line.middleware before express.json()
router.post('/', line.middleware(config), express.json(), async (req, res) => {
  try {
    console.log('>>> webhook body:', JSON.stringify(req.body || {}));
    const events = (req.body && req.body.events) || [];
    await Promise.all(events.map(ev =>
      lineController.handleEvent(ev, config).catch(e => {
        console.error('event handler error:', e);
        return null;
      })
    ));
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Unhandled webhook error:', err);
    return res.status(200).send('OK');
  }
});

module.exports = router;
