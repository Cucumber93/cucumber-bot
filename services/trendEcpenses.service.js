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

  const totalByHourAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const hour = dateObj.getHours().toString().padStart(2, "0") + ":00";
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${hour}_${categoryName}`;
    if (!totalByHourAndCategory[key]) totalByHourAndCategory[key] = 0;
    totalByHourAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByHourAndCategory).map(([key, totalExpense]) => {
    const [hour, category] = key.split("_");
    return { hour, category, totalExpense };
  });

  trendExpenses.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
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

  const totalByDateAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const date = dateObj.toISOString().split("T")[0];
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";
    const key = `${date}_${categoryName}`;
    if (!totalByDateAndCategory[key]) totalByDateAndCategory[key] = 0;
    totalByDateAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByDateAndCategory).map(([key, totalExpense]) => {
    const [date, category] = key.split("_");
    return { date, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
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

  const totalByDateAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const date = dateObj.toISOString().split("T")[0];
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";
    const key = `${date}_${categoryName}`;
    if (!totalByDateAndCategory[key]) totalByDateAndCategory[key] = 0;
    totalByDateAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByDateAndCategory).map(([key, totalExpense]) => {
    const [date, category] = key.split("_");
    return { date, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
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

  const totalByMonthAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const month = dateObj.toISOString().slice(0, 7); // YYYY-MM
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";
    const key = `${month}_${categoryName}`;
    if (!totalByMonthAndCategory[key]) totalByMonthAndCategory[key] = 0;
    totalByMonthAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByMonthAndCategory).map(([key, totalExpense]) => {
    const [month, category] = key.split("_");
    return { month, category, totalExpense };
  });

  trendExpenses.sort((a, b) => new Date(a.month) - new Date(b.month));
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

  const totalByYearAndCategory = {};

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const year = dateObj.getFullYear();
    if (year < startYear) return; // นับเฉพาะช่วง 5 ปีหลัง

    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${year}_${categoryName}`;
    if (!totalByYearAndCategory[key]) totalByYearAndCategory[key] = 0;
    totalByYearAndCategory[key] += Number(expense.value);
  });

  const trendExpenses = Object.entries(totalByYearAndCategory).map(([key, totalExpense]) => {
    const [year, category] = key.split("_");
    return { year, category, totalExpense };
  });

  trendExpenses.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  return trendExpenses;
};
