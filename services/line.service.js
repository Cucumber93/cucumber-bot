const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function normalizeType(type) {
  const map = {
    รายจ่าย: "expense",
    รายรับ: "income",
    expense: "expense",
    income: "income",
  };
  return map[type?.trim()] || type;
}

async function saveUserMessage(userId, text) {
  try {
    // ✅ ตรวจสอบและบันทึก userId ลง table users
    await ensureUserExists(userId);

    // ✅ แยกข้อความ [type] [category] [name] [amount]
    const parts = text.trim().split(" ");
    if (parts.length < 4) {
      return {
        message:
          "❌ รูปแบบไม่ถูกต้อง (เช่น: รายจ่าย อาหาร ต้มยำกุ้ง 50 หรือ expense food tomyumgunong 60)",
      };
    }

    let [type, category, name, amount] = parts;
    type = normalizeType(type.toLowerCase());
    const value = parseFloat(amount);

    console.log('part: ',parts)
    console.log('type: ',type)
    console.log('category: ',category)
    console.log('name: ',name)
    console.log('amount: ',amount)
    if (isNaN(value)) {
      return { message: "❌ จำนวนเงินไม่ถูกต้อง" };
    }

    // ✅ เลือกตารางหมวดหมู่ให้ตรงกับประเภท
    const categoryTable =
      type === "expense" ? "category_expenses" : "category_income";

    // ✅ ตรวจว่าหมวดหมู่มีหรือยัง
    const { data: categoryData, error: catErr } = await supabase
      .from(categoryTable)
      .select("id")
      .eq("name", category)
      .maybeSingle();

    if (catErr) throw catErr;

    let categoryId;
    if (!categoryData) {
      // ถ้าไม่มี category ให้สร้างใหม่
      const { data: newCat, error: insertCatErr } = await supabase
        .from(categoryTable)
        .insert([{ name: category }])
        .select()
        .single();

      if (insertCatErr) throw insertCatErr;
      categoryId = newCat.id;
    } else {
      categoryId = categoryData.id;
    }

    // ✅ แยก insert ตามประเภท
    if (type === "expense") {
      const { error } = await supabase.from("list_expense").insert([
        {
          userId,
          categoryId,
          name,
          amount: value,
        },
      ]);
      if (error) throw error;
      return { message: `✅ บันทึกรายจ่าย "${name}" ${value} บาทแล้ว` };
    }

    if (type === "income") {
      const { error } = await supabase.from("list_income").insert([
        {
          userId,
          categoryId,
          name,
          amount: value,
        },
      ]);
      if (error) throw error;
      return { message: `✅ บันทึกรายรับ "${name}" ${value} บาทแล้ว` };
    }

    return {
      message:
        "❌ ประเภทต้องเป็น รายจ่าย/รายรับ หรือ expense/income เท่านั้น",
    };
  } catch (err) {
    console.error("Insert error:", err.message);
    return { message: `❌ เกิดข้อผิดพลาด: ${err.message}` };
  }
}

// ✅ ฟังก์ชันตรวจสอบและเพิ่มผู้ใช้ใหม่ในตาราง users
async function ensureUserExists(userId) {
  try {
    const { data: existing, error } = await supabase
      .from("users")
      .select("id")
      .eq("line_user_id", userId)
      .maybeSingle();

    if (error) throw error;

    if (!existing) {
      const { error: insertErr } = await supabase
        .from("users")
        .insert([{ line_user_id: userId }]);

      if (insertErr) throw insertErr;
      console.log(`🆕 Added new user: ${userId}`);
    } else {
      console.log(`✅ Existing user: ${userId}`);
    }
  } catch (err) {
    console.error("User insert/check error:", err.message);
  }
}

module.exports = { saveUserMessage };
