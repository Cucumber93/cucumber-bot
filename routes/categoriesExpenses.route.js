const express = require('express')
const router = express.Router()
const controller = require('../controllers/categoriesExpenses.controller')

router.post('/create',controller.createCategory)
router.post('/update',controller.updateCategory)
router.post('/get',controller.getCategoriesByUser)
router.post('/delete',controller.deleteCategory)

module.exports = router