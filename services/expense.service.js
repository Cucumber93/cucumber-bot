const { supabase } = require("../config/superbaseClient.js");
const { Expense } = require("../models/expense.model.js"); // ✅ เพิ่ม import class Expense

async function getAllExpenses(userId) {
  const { data, error } = await supabase
  .from("ExpensesList")
  .select("id, name, categoryId, value, created_at")
  .eq('userId',userId)

  if (error) {
    console.error("❌ Supabase error:", error);
    throw new Error(error.message);
  }

  return data.map((item) => new Expense(item));
}

async function getExpenseById(id) {
  const { data, error } = await supabase.from("ExpensesList").select("*").eq("id", id).eq('userId',userId).single();

  if (error) throw new Error(error.message);
  return new Expense(data);
}

module.exports = {getAllExpenses, getExpenseById };
