const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ========================================================
 🧮 1. คำนวณ Net Balance ของผู้ใช้ (ตาม userId)
     เฉพาะรอบเดือนปัจจุบัน (27 → 26)
======================================================== */
exports.calculateNetBalance = async (userId) => {
  try {
    if (!userId) throw new Error("Missing userId");

    const today = new Date();

    // ✅ หาวันเริ่มต้น / สิ้นสุดของรอบเดือน (เริ่มวันที่ 27)
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

    // ✅ ดึง Income ภายในช่วงรอบเดือนนี้ของ user
    const { data: incomeData, error: incomeError } = await supabase
      .from("category_income")
      .select("amount, created_at")
      .eq("userId", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (incomeError) throw new Error(incomeError.message);

    // ✅ ดึง Expense ภายในช่วงรอบเดือนนี้ของ user
    const { data: expenseData, error: expenseError } = await supabase
      .from("list_expense")
      .select("amount, created_at")
      .eq("userId", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (expenseError) throw new Error(expenseError.message);

    // ✅ รวมยอดรายรับ-รายจ่าย
    const totalIncome = incomeData.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalExpense = expenseData.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const netBalance = totalIncome - totalExpense;

    return {
      userId, // ✅ เพิ่มบอกว่าเป็นของ user ไหน
      periodStart: startDate.toISOString().split("T")[0],
      periodEnd: endDate.toISOString().split("T")[0],
      totalIncome,
      totalExpense,
      netBalance,
    };
  } catch (err) {
    console.error("❌ calculateNetBalance error:", err.message);
    throw new Error(err.message);
  }
};
