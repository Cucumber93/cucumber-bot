const {createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

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
    const parts = text.trim().split(" ");
    if (parts.length < 4) {
      return {
        message:
          "❌ รูปแบบไม่ถูกต้อง (เช่น: รายจ่าย อาหาร ต้มยำกุ้ง 50 หรือ expense food tomyumgunong 60)",
      };
    }

    let [type, category, name, amount] = parts;
    type = normalizeType(type);
    const value = parseFloat(amount);

    if (isNaN(value)) {
      return { message: "❌ จำนวนเงินไม่ถูกต้อง" };
    }

    const { data: categoryData, error: catErr } = await supabase
      .from("category")
      .select("id")
      .eq("name", category)
      .maybeSingle();

    if (catErr) throw catErr;

    let categoryId;
    if (!categoryData) {
      const { data: newCat, error: insertCatErr } = await supabase
        .from("category")
        .insert([{ name: category }])
        .select()
        .single();
      if (insertCatErr) throw insertCatErr;
      categoryId = newCat.id;
    } else {
      categoryId = categoryData.id;
    }

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

module.exports = { saveUserMessage };
