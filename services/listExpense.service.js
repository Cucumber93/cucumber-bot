const {createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

exports.createList = async(name,amount,userId,categoryId)=>{
    const {data,error} = await supabase
    .from('list_expense')
    .insert([{name,amount,userId,categoryId}])
    .select()

    console.log('huhhhh')
    if(error) throw error
    console.log('huhhhh2')
    return data[0]
}

exports.getAllListByCatIdAndUserId = async(categoryId,userId)=>{
    const {data,error} = await supabase
    .from('list_expense')
    .select('*')
    .eq('categoryId',categoryId)
    .eq('userId',userId)
    .order('id', {ascending:true})

    if(error) throw error
    return data
}

exports.updateList = async (id, name, amount, userId, categoryId) => {
  // สร้าง object สำหรับเก็บค่าที่ต้องการอัปเดตเท่านั้น
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (amount !== undefined) updateData.amount = amount;

  // ถ้าไม่มีฟิลด์ให้ update ก็ไม่ต้องยิง query
  if (Object.keys(updateData).length === 0) {
    return { error: 'No fields to update' };
  }

  const { data, error } = await supabase
    .from('list_expense')
    .update(updateData)                   // อัปเดตเฉพาะค่าที่มีใน updateData
    .eq('id', id)                         // เจาะจง record ที่ต้องการอัปเดต
    .eq('userId', userId)                 // ป้องกันอัปเดตของคนอื่น
    .eq('categoryId', categoryId)         // ป้องกันข้ามหมวด

  if (error) {
    console.error('❌ Update error:', error.message);
    return null;
  }

  return data;
};

exports.deleteList = async (id,categoryId,userId)=>{
    const {error} = await supabase
    .from('list_expense')
    .delete()
    .eq('id',id)
    .eq('categoryId',categoryId)
    .eq('userId',userId)

    if(error) throw error
    return {message : 'List Expense deleted'}
}


