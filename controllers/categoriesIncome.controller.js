const service = require("../services/categoriesIncome.service.js")

// Create
exports.createCategory = async (req, res) => {
  try {
    const { name, userId,amount } = req.body
    if (!name || !userId || !amount)
      return res.status(400).json({ error: "Missing name or userId or amount" })

    const data = await service.createCategory(name, userId,amount)
    res.status(201).json({ message: "Category income created", data })
  } catch (err) {
    console.error("Create category income error:", err)
    res.status(500).json({ error: err.message })
  }
}

// Read
exports.getAllCategoriesByUser = async(req,res)=>{
  try{
    const {userId} = req.body
    if(!userId) return res.status(400).json({error: 'Missing userId'})

    const data = await service.getAllCategoriesByUser(userId)
    res.status(200).json({message: 'Get category income success!',data})
  }catch(error){
    console.error('Get Category Income error: ',error)
    res.status(500).json({error: error.message})
  }
}

// Update
exports.updateCategory = async(req,res)=>{
  try{
    const {id,name, userId} = req.body
    if(!id || !name || !userId) return res.status(400).json({error: 'Missing id or name or userId'})

    const data = await service.updateCategory(id,name,userId)
    res.status(200).json({message: 'Updated Category Income'})

  }catch(error){
    console.error('Update category income error: ',error)
  }
}

exports.deleteCategory = async(req,res)=>{
  try{
    const {id,userId} = req.bogy
    if(!id || !userId) return res.status(400).json({error: 'Missing id or userId'})

    const data = await service.deleteCategory(id,userId)
    res.status(200).json({message: 'Deleted category income'})
  }catch(error){
    console.error('Delete category income error:' ,error)
    res.status(500).json({error: error.message})
  }
}