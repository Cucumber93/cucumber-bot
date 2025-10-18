const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Create
exports.createCategory = async (name, userId) => {
  const { data, error } = await supabase
    .from("category_income")
    .insert([{ name, userId }])
    .select()

  if (error) throw error
  return data[0]
}

// Read
exports.getAllCategoriesByUser = async(userId)=>{
  const {data,error} = await supabase
  .from('category_income')
  .select("*")
  .eq('userId',userId)
  .order('id',{ascending:true})

  if(error) throw error
  return data
}

// Update
exports.updateCategory = async (id,name,userId)=>{
  const {data,error} = await supabase
  .from('category_income')
  .update({name})
  .eq('id',id)
  .eq('userId',userId)
  .select()

  if(error) throw error
  return data[0]
}

// Delete
exports.deleteCategory = async(id, userId)=>{
  const {data,error} = await supabase
  .from('category_income')
  .delete()
  .eq('id',id)
  .eq('userId',userId)
  
  if(error) throw error
  return {message: 'Category Income deleted'}
}
