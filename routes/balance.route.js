const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller.js");

router.get("/", balanceController.getNetBalance);
module.exports = router;