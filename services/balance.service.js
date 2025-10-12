const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ========================================================
 🧮 1. คำนวณ Net Balance เฉพาะรอบเดือนปัจจุบัน (27 → 26)
======================================================== */
exports.calculateNetBalance = async () => {
  try {
    const today = new Date();

    // หา start / end ของรอบเดือน (เริ่มวันที่ 27)
    const startDate = new Date(today);
    const endDate = new Date(today);

    if (today.getDate() >= 27) {
      startDate.setDate(27);
      endDate.setMonth(today.getMonth() + 1);
      endDate.setDate(26);
    } else {
      startDate.setMonth(today.getMonth() - 1);
      startDate.setDate(27);
      endDate.setDate(26);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // ดึง Income ภายในช่วงรอบเดือนนี้
    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (incomeError) throw new Error(incomeError.message);

    // ดึง Expense ภายในช่วงรอบเดือนนี้
    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (expenseError) throw new Error(expenseError.message);

    // รวมยอด
    const totalIncome = incomeData.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalExpense = expenseData.reduce((sum, i) => sum + Number(i.value || 0), 0);

    const netBalance = totalIncome - totalExpense;

    return {
      periodStart: startDate.toISOString().split("T")[0],
      periodEnd: endDate.toISOString().split("T")[0],
      totalIncome,
      totalExpense,
      netBalance,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
