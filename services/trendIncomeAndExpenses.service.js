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
      const period =
        new Date(item.created_at).getHours().toString().padStart(2, "0") + ":00";
      if (!hourly[period]) hourly[period] = { income: 0, expense: 0 };
      hourly[period].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const period =
        new Date(item.created_at).getHours().toString().padStart(2, "0") + ":00";
      if (!hourly[period]) hourly[period] = { income: 0, expense: 0 };
      hourly[period].expense += Number(item.value || 0);
    });

    const result = Object.entries(hourly).map(([period, value]) => ({
      period,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => parseInt(a.period) - parseInt(b.period));
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
    startDate.setDate(today.getDate() - 6);

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
      const period = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[period]) daily[period] = { income: 0, expense: 0 };
      daily[period].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const period = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[period]) daily[period] = { income: 0, expense: 0 };
      daily[period].expense += Number(item.value || 0);
    });

    const result = Object.entries(daily).map(([period, value]) => ({
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
      const period = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[period]) daily[period] = { income: 0, expense: 0 };
      daily[period].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const period = new Date(item.created_at).toISOString().split("T")[0];
      if (!daily[period]) daily[period] = { income: 0, expense: 0 };
      daily[period].expense += Number(item.value || 0);
    });

    const result = Object.entries(daily).map(([period, value]) => ({
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
      const period = new Date(item.created_at).toISOString().slice(0, 7); // YYYY-MM
      if (!monthly[period]) monthly[period] = { income: 0, expense: 0 };
      monthly[period].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const period = new Date(item.created_at).toISOString().slice(0, 7);
      if (!monthly[period]) monthly[period] = { income: 0, expense: 0 };
      monthly[period].expense += Number(item.value || 0);
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
 📆 5. รวมยอดรายปี
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
      const period = new Date(item.created_at).getFullYear().toString(); // YYYY
      if (!yearly[period]) yearly[period] = { income: 0, expense: 0 };
      yearly[period].income += Number(item.amount || 0);
    });

    expenseData.forEach((item) => {
      const period = new Date(item.created_at).getFullYear().toString();
      if (!yearly[period]) yearly[period] = { income: 0, expense: 0 };
      yearly[period].expense += Number(item.value || 0);
    });

    const result = Object.entries(yearly).map(([period, value]) => ({
      period,
      totalIncome: value.income,
      totalExpense: value.expense,
    }));

    result.sort((a, b) => Number(a.period) - Number(b.period));
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
