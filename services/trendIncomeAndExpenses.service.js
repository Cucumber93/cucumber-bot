
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ========================================================
 📅 2. รวมยอดรายเดือนทั้งหมด (27 → 26)
======================================================== */
exports.getMonthlySummary = async () => {
  try {
    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at");
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at");
    if (expenseError) throw new Error(expenseError.message);

    // แปลงวันที่ให้เข้ารอบเดือน
    function getCycleKey(dateString) {
      const d = new Date(dateString);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      if (d.getDate() < 27) month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
      return `${year}-${String(month).padStart(2, "0")}`; // เช่น 2025-10
    }

    const monthly = {};

    // รวมยอดรายเดือนของ income
    incomeData.forEach((item) => {
      const key = getCycleKey(item.created_at);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].income += Number(item.amount || 0);
    });

    // รวมยอดรายเดือนของ expense
    expenseData.forEach((item) => {
      const key = getCycleKey(item.created_at);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].expense += Number(item.value || 0);
    });

    // แปลงเป็น array
    const result = Object.entries(monthly).map(([period, value]) => ({
      period,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => new Date(a.period) - new Date(b.period));

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* ========================================================
 🧾 3. ดึงรายละเอียดรายเดือน (Income + Expense ของเดือนนั้น)
======================================================== */
exports.getMonthlyDetails = async (year, month) => {
  try {
    const startDate = new Date(year, month - 1, 27);
    const endDate = new Date(year, month, 26);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (expenseError) throw new Error(expenseError.message);

    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      periodStart: startDate.toISOString().split("T")[0],
      periodEnd: endDate.toISOString().split("T")[0],
      income: incomeData,
      expenses: expenseData,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

/* ========================================================
 📆 4. รวมยอดรายปี (27 → 26)
======================================================== */
exports.getYearlySummary = async () => {
  try {
    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at");
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at");
    if (expenseError) throw new Error(expenseError.message);

    // หารอบเดือน (ใช้ logic เดียวกับ monthly)
    function getCycleKey(dateString) {
      const d = new Date(dateString);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      if (d.getDate() < 27) month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
      return `${year}-${String(month).padStart(2, "0")}`;
    }

    const monthly = {};

    // รวมยอดรายเดือน
    incomeData.forEach((item) => {
      const key = getCycleKey(item.created_at);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const key = getCycleKey(item.created_at);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].expense += Number(item.value || 0);
    });

    // รวมยอดรายปี
    const yearly = {};
    Object.entries(monthly).forEach(([monthKey, value]) => {
      const [year] = monthKey.split("-");
      if (!yearly[year]) yearly[year] = { income: 0, expense: 0 };
      yearly[year].income += value.income;
      yearly[year].expense += value.expense;
    });

    const result = Object.entries(yearly).map(([year, value]) => ({
      year,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => Number(a.year) - Number(b.year));

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
