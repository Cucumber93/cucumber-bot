const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/* ========================================================
 🕒 1. รวมยอดรายชั่วโมงของวันนี้
======================================================== */
exports.getHourlySummary = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());
    if (expenseError) throw new Error(expenseError.message);

    const hourly = {};

    incomeData.forEach((item) => {
      const h = new Date(item.created_at).getHours().toString().padStart(2, "0") + ":00";
      if (!hourly[h]) hourly[h] = { income: 0, expense: 0 };
      hourly[h].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const h = new Date(item.created_at).getHours().toString().padStart(2, "0") + ":00";
      if (!hourly[h]) hourly[h] = { income: 0, expense: 0 };
      hourly[h].expense += Number(item.value || 0);
    });

    const result = Object.entries(hourly).map(([hour, value]) => ({
      hour,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* ========================================================
 📆 2. รวมยอดย้อนหลัง 7 วัน
======================================================== */
exports.getLast7DaysSummary = async () => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 6); // รวมวันนี้ด้วย

    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", today.toISOString());
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", today.toISOString());
    if (expenseError) throw new Error(expenseError.message);

    const daily = {};

    incomeData.forEach((item) => {
      const d = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[d]) daily[d] = { income: 0, expense: 0 };
      daily[d].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const d = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[d]) daily[d] = { income: 0, expense: 0 };
      daily[d].expense += Number(item.value || 0);
    });

    const result = Object.entries(daily).map(([date, value]) => ({
      date,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* ========================================================
 📆 3. รวมยอดย้อนหลัง 30 วัน
======================================================== */
exports.getLast30DaysSummary = async () => {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);

    const { data: incomeData, error: incomeError } = await supabase
      .from("Income")
      .select("amount, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", today.toISOString());
    if (incomeError) throw new Error(incomeError.message);

    const { data: expenseData, error: expenseError } = await supabase
      .from("ExpensesList")
      .select("value, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", today.toISOString());
    if (expenseError) throw new Error(expenseError.message);

    const daily = {};

    incomeData.forEach((item) => {
      const d = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[d]) daily[d] = { income: 0, expense: 0 };
      daily[d].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const d = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[d]) daily[d] = { income: 0, expense: 0 };
      daily[d].expense += Number(item.value || 0);
    });

    const result = Object.entries(daily).map(([date, value]) => ({
      date,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* ========================================================
 📅 4. รวมยอดรายเดือน (1 → สิ้นเดือน)
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

    const monthly = {};

    incomeData.forEach((item) => {
      const key = new Date(item.created_at).toISOString().slice(0, 7); // YYYY-MM
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const key = new Date(item.created_at).toISOString().slice(0, 7);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key].expense += Number(item.value || 0);
    });

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
 🧾 5. ดึงรายละเอียดรายเดือน
======================================================== */
exports.getMonthlyDetails = async (year, month) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // วันสุดท้ายของเดือน
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
 📆 6. รวมยอดรายปี
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

    const yearly = {};

    incomeData.forEach((item) => {
      const year = new Date(item.created_at).getFullYear();
      if (!yearly[year]) yearly[year] = { income: 0, expense: 0 };
      yearly[year].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const year = new Date(item.created_at).getFullYear();
      if (!yearly[year]) yearly[year] = { income: 0, expense: 0 };
      yearly[year].expense += Number(item.value || 0);
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
