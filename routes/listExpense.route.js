const express = require('express')
const router = express.Router()
const controller = require('../controllers/listExpense.controller.js')

router.post('/create',controller.createList)
router.post('/update',controller.updateList)
router.post('/get-all',controller.getAllListByCatIdAndUserId)
router.post('/delete',controller.deleteList)

module.exports = router