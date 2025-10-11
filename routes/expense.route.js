const express = require("express");
const expenseController = require("../controllers/expense.controller.js");

const router = express.Router();

router.get("/", expenseController.getAll);
router.get("/:id", expenseController.getById);

module.exports = router;
