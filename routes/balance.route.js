const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller.js");

router.post("/", balanceController.getBalance);

module.exports = router;