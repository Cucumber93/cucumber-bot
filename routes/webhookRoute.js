const express = require('express');
const line = require('@line/bot-sdk');
const lineController = require('../controllers/line.confroller');

const router = express.Router();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// Line middleware ตรวจ signature ให้
router.post('/', line.middleware(config), (req, res) => {
  // req.body.events เป็น array ของ event
  Promise
    .all(req.body.events.map(ev => lineController.handleEvent(ev, config)))
    .then(() => res.status(200).send('OK'))
    .catch(err => {
      console.error('Webhook handling error:', err);
      res.status(500).end();
    });
});

module.exports = router;
