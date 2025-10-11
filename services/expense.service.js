// services/expense.service.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

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
