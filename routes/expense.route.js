const express = require("express");
const expenseController = require("../controllers/expense.controller.js");

const router = express.Router();

router.post("/", expenseController.getAll);
router.post("/:id", expenseController.getById);

module.exports = router;
