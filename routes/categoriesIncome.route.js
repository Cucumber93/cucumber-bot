const express = require("express")
const router = express.Router()
const controller = require("../controllers/categoriesIncome.controller.js")

// POST: เพิ่ม Category ผ่าน API
router.post("/create", controller.createCategory)
router.post("/get-all",controller.getAllCategoriesByUser)
router.post("/update",controller.updateCategory)
router.post("/delete",controller.deleteCategory)

module.exports = router
