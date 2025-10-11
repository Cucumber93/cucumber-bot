
import { supabase } from '../config/superbaseClient.js';


export async function addExpenseFromMessage(messageText) {
  try {
    const parts = messageText.trim().split(' ');
    if (parts.length < 3) {
      return {
        replyMessages: [
          { type: 'text', text: '⚠️ Invalid format. Use: [categoryId] [description] [value]' },
        ],
      };
    }

    const [categoryId, name, amountStr] = parts;
    const value = parseFloat(amountStr);

    if (isNaN(value)) {
      return {
        replyMessages: [
          { type: 'text', text: '⚠️ Amount must be a number.' },
        ],
      };
    }

    const { data, error } = await supabase
      .from('ExpensesList')
      .insert([
        {
          categoryId: parseInt(categoryId),
          name,
          value,
        },
      ])
      .select(`
        id, name, value, created_at, category:categoryId(name)
      `);

    if (error) {
      console.error('❌ Insert error:', error);
      return {
        replyMessages: [
          { type: 'text', text: '❌ Failed to save data to database.' },
        ],
      };
    }

    console.log('✅ Supabase insert success:', data);
    const expense = data[0];

    return {
      replyMessages: [
        {
          type: 'text',
          text: `✅ Added "${expense.name}" (${expense.value}฿) to category ${expense.category.name}.`,
        },
      ],
    };
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return {
      replyMessages: [
        { type: 'text', text: '❌ Something went wrong. Please try again.' },
      ],
    };
  }
}

export async function getAllExpenses(){
  const {data, error} = await supabase.from('ExpensesList').select('*');

  if(error){
    console.error('❌ Superbase error:', error);
    throw new Error(error.message)
  }

  return data.map(item => new Expense(item))
}

export async function getExpenseById(id){
  const {data,error} = await supabase
  .from('ExpensesList')
  .select('*')
  .eq('id',id)
  .single();

  if(error)throw new Error(error.message)
    return new Expense(data)
}
