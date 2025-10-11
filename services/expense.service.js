// const {supabase} = require('../config/supabaseClient');
// expense.service.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


export async function addExpenseFromMessage(messageText){
  try{
    const parts = messageText.trim().split(' ')
    if(parts.length<3)return 'Invalid format. Use: add [category] [description] [value] ';

    const [categoryId,name,amountStr] = parts;
    const value = parseFloat(amountStr);

    if(isNaN(value)) return ' Amount must be a number.'

    const { data, error} = await supabase
      .from('ExpensesList')
      .insert([
        {
          categoryId: parseInt(categoryId),
          name,
          value
        }
      ])
      .select(
        `id,name,value,created_at, category:categoryId(name)`
      )

      if(error){
        console.error('Insert error: ',error)
        return 'Failed to save data'
      }

      const expense = data[0];
      return `Added ${expense.name} - ${expense.value} in category ${expense.category.name}.`
  }catch(err){
    console.error('Unexpected error:', err);
    return "Something went wrong. Please try again.";
  }
}