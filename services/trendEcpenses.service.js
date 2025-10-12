const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ============================================
// 🔹 1) TODAY (Hourly)
// ============================================
exports.getTrendExpensesHourly = async () => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());
  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");
  if (categoryError) throw new Error(categoryError.message);

  const totalByPeriodAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const period = `${dateObj.toISOString().split("T")[0]} ${dateObj
      .getHours()
      .toString()
      .padStart(2, "0")}:00`; // ✅ period format: YYYY-MM-DD HH:00

    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${period}_${categoryName}`;
    if (!totalByPeriodAndCategory[key]) totalByPeriodAndCategory[key] = 0;
    totalByPeriodAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByPeriodAndCategory).map(([key, totalExpense]) => {
    const [period, category] = key.split("_");
    return { period, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.period) - new Date(b.period));
  return trendExpenses;
};

// ============================================
// 🔹 2) LAST 7 DAYS
// ============================================
exports.getTrendExpensesLast7Days = async () => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6); // รวมวันนี้

  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", today.toISOString());
  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");
  if (categoryError) throw new Error(categoryError.message);

  const totalByPeriodAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const period = dateObj.toISOString().split("T")[0]; // ✅ period format: YYYY-MM-DD

    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${period}_${categoryName}`;
    if (!totalByPeriodAndCategory[key]) totalByPeriodAndCategory[key] = 0;
    totalByPeriodAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByPeriodAndCategory).map(([key, totalExpense]) => {
    const [period, category] = key.split("_");
    return { period, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.period) - new Date(b.period));
  return trendExpenses;
};

// ============================================
// 🔹 3) LAST 30 DAYS
// ============================================
exports.getTrendExpensesLast30Days = async () => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 29);

  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", today.toISOString());
  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");
  if (categoryError) throw new Error(categoryError.message);

  const totalByPeriodAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const period = dateObj.toISOString().split("T")[0]; // ✅ period format: YYYY-MM-DD

    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${period}_${categoryName}`;
    if (!totalByPeriodAndCategory[key]) totalByPeriodAndCategory[key] = 0;
    totalByPeriodAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByPeriodAndCategory).map(([key, totalExpense]) => {
    const [period, category] = key.split("_");
    return { period, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.period) - new Date(b.period));
  return trendExpenses;
};

// ============================================
// 🔹 4) MONTHLY (ของปีปัจจุบัน)
// ============================================
exports.getTrendExpensesMonthly = async () => {
  const thisYear = new Date().getFullYear();
  const startOfYear = new Date(`${thisYear}-01-01T00:00:00Z`);
  const endOfYear = new Date(`${thisYear}-12-31T23:59:59Z`);

  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", startOfYear.toISOString())
    .lte("created_at", endOfYear.toISOString());
  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");
  if (categoryError) throw new Error(categoryError.message);

  const totalByPeriodAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const period = dateObj.toISOString().slice(0, 7); // ✅ period format: YYYY-MM

    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${period}_${categoryName}`;
    if (!totalByPeriodAndCategory[key]) totalByPeriodAndCategory[key] = 0;
    totalByPeriodAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByPeriodAndCategory).map(([key, totalExpense]) => {
    const [period, category] = key.split("_");
    return { period, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.period) - new Date(b.period));
  return trendExpenses;
};

// ============================================
// 🔹 5) YEARLY (ย้อนหลัง 5 ปี)
// ============================================
exports.getTrendExpensesYearly = async () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 4; // ย้อนหลัง 5 ปี

  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value");
  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");
  if (categoryError) throw new Error(categoryError.message);

  const totalByPeriodAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const year = dateObj.getFullYear();
    if (year < startYear) return;

    const period = `${year}`; // ✅ period format: YYYY
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${period}_${categoryName}`;
    if (!totalByPeriodAndCategory[key]) totalByPeriodAndCategory[key] = 0;
    totalByPeriodAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByPeriodAndCategory).map(([key, totalExpense]) => {
    const [period, category] = key.split("_");
    return { period, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.period) - new Date(b.period));
  return trendExpenses;
};
