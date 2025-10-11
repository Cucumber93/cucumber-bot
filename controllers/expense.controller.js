import * as expenseService from '../services/expense.service.js';

export async function getAll(req,res){
    try{
        const expenses = await expenseService.getAllExpenses()
        res.json(expenses)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

export async function getById(req,res){
    try{
        const expense = await expenseService.getExpenseById(req.params.id)
        if(!expense) return res.status(404).json({error: 'Expense not found'})
        res.json(expense)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}