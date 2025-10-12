const supabase = require("../config/superbaseClient").supabase;

exports.getTrendExpensesHourly = async () => {
  // 🕛 วันปัจจุบัน (เริ่มต้นที่ 00:00 ถึง 23:59)
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // 🧭 ดึงข้อมูลจาก Supabase เฉพาะวันนี้
  const { data: ExpensesAmount, error } = await supabase
    .from("ExpensesList")
    .select("created_at, categoryId, value")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  if (error) throw new Error(error.message);

  // 🗂 ดึงข้อมูล Category
  const { data: categoryData, error: categoryError } = await supabase
    .from("Categories")
    .select("id, name");

  if (categoryError) throw new Error(categoryError.message);

  // 🕒 รวมยอดรายชั่วโมงแยกตามหมวด
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

  // 🔁 แปลง object → array
  const trendExpenses = Object.entries(totalByHourAndCategory).map(
    ([key, totalExpense]) => {
      const [hour, category] = key.split("_");
      return { hour, category, totalExpense };
    }
  );

  // ✅ เรียงตามชั่วโมงจาก 00 → 23
  trendExpenses.sort((a, b) => {
    const hourA = parseInt(a.hour.split(":")[0]);
    const hourB = parseInt(b.hour.split(":")[0]);
    return hourA - hourB;
  });

  return trendExpenses;
};
