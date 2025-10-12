const supabase = require("../config/superbaseClient").supabase;

exports.getTrendExpensesHourly = async () => {
  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value");

  if (error) throw new Error(error.message);

  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");

  if (categoryError) throw new Error(categoryError.message);

  // แปลงข้อมูลให้แสดงแบบ realtime
  const trendExpenses = ExpensesAmount.map((expense) => {
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    // แปลง ISO datetime เป็น readable datetime เช่น "2025-10-11 07:20:53"
    const dateObj = new Date(expense.created_at);
    const formattedDate = dateObj.toISOString().replace("T", " ").split(".")[0];

    return {
      datetime: formattedDate,
      category: categoryName,
      totalExpense: expense.value,
    };
  });

  // เรียงจากเวลาเก่า -> ใหม่
  trendExpenses.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  return trendExpenses;
};

exports.getTrendExpensesLast7Days = async () => {
  // วันที่ปัจจุบันและ 7 วันก่อนหน้า
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6); // รวมวันนี้ด้วย (7 วัน)

  // แปลงเป็น ISO string เพื่อใช้ใน Supabase filter
  const startDateISO = sevenDaysAgo.toISOString().split("T")[0];
  const endDateISO = today.toISOString().split("T")[0];

  // ดึงข้อมูลเฉพาะ 7 วันที่ผ่านมา
  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", `${startDateISO}T00:00:00`)
    .lte("created_at", `${endDateISO}T23:59:59`);

  if (error) throw new Error(error.message);

  // ดึงข้อมูล category
  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");

  if (categoryError) throw new Error(categoryError.message);

  const totalByDateAndCategory = {};
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const date = dateObj.toISOString().split("T")[0];
    const day = days[dateObj.getDay()];
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${date}_${day}_${categoryName}`;
    if (!totalByDateAndCategory[key]) totalByDateAndCategory[key] = 0;
    totalByDateAndCategory[key] += expense.value;
  });

  // แปลง object → array
  const trendExpenses = Object.entries(totalByDateAndCategory).map(([key, totalExpense]) => {
    const [date, day, category] = key.split("_");
    return { date, day, category, totalExpense };
  });

  // เรียงวันที่จากเก่า → ใหม่
  trendExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  return trendExpenses;
};

exports.getTrendExpensesLastt30Days = async () => {
  // วันที่ปัจจุบันและย้อนหลัง 30 วัน
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29); // รวมวันนี้ด้วย

  // แปลงเป็น ISO เพื่อใช้ filter
  const startDateISO = thirtyDaysAgo.toISOString().split("T")[0];
  const endDateISO = today.toISOString().split("T")[0];

  // ดึงข้อมูลจาก Supabase เฉพาะ 30 วันที่ผ่านมา
  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", `${startDateISO}T00:00:00`)
    .lte("created_at", `${endDateISO}T23:59:59`);

  if (error) throw new Error(error.message);

  // ดึงชื่อ category
  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");

  if (categoryError) throw new Error(categoryError.message);

  const totalByDateAndCategory = {};
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // รวมยอดรายวัน
  ExpensesAmount.forEach((expense) => {
    const dateObj = new Date(expense.created_at);
    const date = dateObj.toISOString().split("T")[0];
    const day = days[dateObj.getDay()];
    const category = categoryData.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Unknown";

    const key = `${date}_${day}_${categoryName}`;
    if (!totalByDateAndCategory[key]) totalByDateAndCategory[key] = 0;
    totalByDateAndCategory[key] += expense.value;
  });

  // แปลง object → array
  const trendExpenses = Object.entries(totalByDateAndCategory).map(([key, totalExpense]) => {
    const [date, day, category] = key.split("_");
    return { date, day, category, totalExpense };
  });

  // เรียงวันที่จากเก่า → ใหม่
  trendExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  return trendExpenses;
};