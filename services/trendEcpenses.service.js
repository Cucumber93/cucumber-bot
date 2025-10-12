const supabase = require("../config/superbaseClient").supabase;

// ----------------------------------------------------
// 🕛 ฟังก์ชันที่มีอยู่: รายชั่วโมงของวันปัจจุบัน
// ----------------------------------------------------
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

// ----------------------------------------------------
// 📅 ฟังก์ชันใหม่: รายวันย้อนหลัง 7 วัน (รวมวันนี้)
// ----------------------------------------------------
exports.getTrendExpensesLast7Days = async () => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6); // รวมวันนี้ (7 วัน)

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
    const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
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

  // เรียงจากวันที่เก่า -> ใหม่
  trendExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  return trendExpenses;
};

// ----------------------------------------------------
// 🗓 ฟังก์ชันใหม่: รายวันย้อนหลัง 30 วัน (รวมวันนี้)
// ----------------------------------------------------
exports.getTrendExpensesLast30Days = async () => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 29); // รวมวันนี้ (30 วัน)

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
