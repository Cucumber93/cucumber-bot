const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller.js");

router.get("/:type", balanceController.getBalance);

module.exports = router;