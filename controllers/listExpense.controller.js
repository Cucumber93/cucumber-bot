const service = require('../services/listExpense.service.js')

//Create
exports.createList = async(req,res)=>{
    try{
        const {name,amount,categoryId,userId} = req.body
        if(!name || !categoryId || !userId) return res.status(400).json({error: "Missing name , amount, categoryId or userId"})
        console.log('in controller')
        const data = await service.createList(name,amount,userId,categoryId)
        res.status(200).json({message: 'List expense created'},data)
    }catch(error){
        console.error('Create List expense error: ',error)
        res.status(500).json({error: error.message})
    }
}

//Read
exports.getAllListByCatIdAndUserId = async(req,res)=>{
    try{
        const {categoryId,userId} = req.body
        if(!categoryId || !userId) return res.status(400).json({error: 'Missing userId or categoryId'})

        const data = await service.getAllListByCatIdAndUserId(categoryId,userId)
        res.status(200).json({message: 'Get all list expense success',data})
    }catch(error){
        console.error('Get list expense error: ',error)
        res.status(500).json({error: error.message})
    }
}

//Update 
exports.updateList = async (req, res) => {
  try {
    // ✅ 1. รับค่าจาก body
    const { id, name, amount, userId, categoryId } = req.body;

    // ✅ 2. ตรวจสอบข้อมูลที่จำเป็น
    if (!id || !userId || !categoryId) {
      return res.status(400).json({
        error: 'Missing required fields: id, userId, or categoryId',
      });
    }

    // ✅ 3. เรียกใช้ service
    const result = await listService.updateList(id, name, amount, userId, categoryId);

    // ✅ 4. ตรวจสอบผลลัพธ์
    if (result?.error === 'No fields to update') {
      return res.status(400).json({ error: 'No fields to update' });
    }

    if (!result) {
      return res.status(500).json({ error: 'Failed to update list' });
    }

    // ✅ 5. ตอบกลับเมื่ออัปเดตสำเร็จ
    res.status(200).json({
      message: 'List updated successfully',
      updated: result[0],
    });
  } catch (error) {
    // ✅ 6. handle error กรณีระบบล่ม
    console.error('❌ Update list expense error:', error);
    res.status(500).json({ error: error.message });
  }
};

//Delete
exports.deleteList = async(req, res)=>{
    try{
        const {id, categoryId,userId} = req.body
        if(!id || !categoryId || !userId) return res.status(400).json({error: 'Missing id, categoryId or userId'})

        const data = await service.deleteList(id,categoryId,userId)
        res.status(200).json({message:'Deleted list expense',data})
    }catch(error){
        console.error('Delete list expense error: ',error)
        res.status(500).json({error:error.message})
    }
}