const service = require('../services/listIncome.service.js')

// Create
exports.createList = async(req,res)=>{
    try{
        const {name,amount,categoryId,userId} = req.body
        if(!name || !categoryId || !userId) return res.status(400).json({error: 'Missing name, categoryId or userid'})
        
        const data = await service.createList(name,amount,userId,categoryId)
        res.status(200).json({message: "List income create success!"})
    }catch(error){
        console.error('Create List income error: ', error)
        res.status(500).json({error: error.message})
    }
}

// Read
exports.getAllListIncome = async(req,res)=>{
    try{
        const {categoryId,userId} = req.body
        if(!categoryId || !userId) return res.status(400).json({error: 'Missing categoryId or userId'})

        const data = await service.getAllListIncome(categoryId,userId)
        res.status(200).json(data)
    }catch(error){
        console.error('Get list income error: ',error)
        res.status(500).json({error: error.message})
    }
}

// Update
exports.updateList = async(req,res)=>{
    try{
        const {id,name,amount,userId,categoryId} = req.body
        if(!id || !userId || !categoryId) return res.status(400).json({error: 'Missing id, userId or categoryId'})
        
        const data = await service.updateList(id,name,amount,categoryId,userId)
        res.status(200).json({data})
    }catch(error){
        console.error('update list income error',error)
        res.status(500).json({error: error.message})
    }
}

//Delete
exports.deleteList = async (req,res)=>{
    try{
        const {id,categoryId,userId} = req.body
        if(!id || !categoryId || !userId) return res.status(400).json({error: "Missing id, categoryId or userId"})

        const data = await service.deleteList(id,categoryId,userId)
        res.status(200).json({data})
    }catch(error){
        console.error('Delete List income error: ',error)
        res.status(500).json({error: error.message})
    }
}