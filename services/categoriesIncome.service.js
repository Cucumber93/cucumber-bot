const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

exports.createCategory = async (name, userId) => {
  const { data, error } = await supabase
    .from("category_income")
    .insert([{ name, userId }])
    .select()

  if (error) throw error
  return data[0]
}
