import express from 'express';
import * as expenseController from '../controllers/expense.controller.js';

const router = express.Router()

router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);

export default router;