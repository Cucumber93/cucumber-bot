const express = require("express")
const router = express.Router()
const controller = require("../controllers/categoriesIncome.controller.js")

// POST: เพิ่ม Category ผ่าน API
router.post("/", controller.createCategory)

module.exports = router
