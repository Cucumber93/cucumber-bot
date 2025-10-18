const express = require('express')
const router = express.Router()
const controller = require('../controllers/listIncome.controller.js')

router.post('/create',controller.createList)
router.post('/update',controller.updateList)
router.post('/get-all',controller.getAllListIncome)
router.post('/delete',controller.deleteList)

module.exports= router