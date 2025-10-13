const {createClient} = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Create
exports.createCategory = async (name,userId)=>{
    const { data,error} = await supabase
    .from('category_expenses')
    .insert([{name,userId}])
    .select()

    if(error) throw error
    return data[0]
}

// Read
exports.getCategoriesByUser = async (userId)=>{
    const {data,error} = await supabase
    .from('category_expenses')
    .select('*')
    .eq('userId',userId)
    .order('id',{ascending:true})

    if(error) throw error
    return data
}

// Update
exports.updateCategory = async (id,name,userId)=>{
    const {data,error} = await supabase
    .from('category_expenses')
    .update({name})
    .eq('id',id)
    .eq('userId',userId)
    .select()

    if(error) throw error
    return data[0]
}

// Delete
exports.deleteCategory = async (id,userId)=>{
    const {error} = await supabase
    .from("category_expenses")
    .delete()
    .eq('id',id)
    .eq('userId',userId)

    if(error) throw error
    return {message : 'Category deleted successfully'}
}