const {createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Create
exports.createList = async(name,amount,userId,categoryId)=>{
    const {data,error} = await supabase
    .from('list_income')
    .insert([{name,amount,userId,categoryId}])
    .select()

    if(error) throw error
    return data[0]
}

// Read
exports.getAllListIncome= async(categoryId,userId)=>{
    const {data,error} = await supabase
    .from('list_income')
    .select('*')
    .eq('categoryId',categoryId)
    .eq('userId',userId)
    .order('id', {ascending: true})

    if(error) throw error
    return data
}

// Update
exports.updateList = async(id,name,amount,categoryId,userId)=>{
    const updateData ={}

    if(name !== undefined) updateData.name = name
    if(amount !== undefined) updateData.amount = amount

    if(Object.keys(updateData).length ===0){
        return {error: "No fields to update"}
    }

    const {data,error} = await supabase
    .from('list_income')
    .update(updateData)
    .eq('id',id)
    .eq('userId',userId)
    .eq('categoryId',categoryId)

    if(error){
        console.error('Update error: ', error.message)
        return null
    }

    return data
}

// Delete
exports.deleteList = async(id,categoryId,userId)=>{
    const {error} = await supabase
    .from('list_income')
    .delete()
    .eq('id',id)
    .eq('categoryId',categoryId)
    .eq('userId',userId)

    if(error) throw error
    return {message: 'List Income deleted'}
}