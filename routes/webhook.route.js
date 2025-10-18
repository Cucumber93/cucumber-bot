const express = require('express');
const line = require('@line/bot-sdk');
const lineController = require('../controllers/line.controller');

const router = express.Router();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// ✅ health check
router.get('/', (req, res) => res.send('OK - webhook'));

// ✅ IMPORTANT: DO NOT use express.json() here
router.post('/', line.middleware(config), async (req, res) => {
  try {
    console.log('>>>> Webhook events:', JSON.stringify(req.body.events));

    const events = (req.body && req.body.events) || [];

    await Promise.all(
      events.map((ev) =>
        lineController.handleLineMessage(ev, config).catch((e) => {
          console.error('event handler error:', e);
          return null;
        })
      )
    );

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Unhandled webhook error:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
