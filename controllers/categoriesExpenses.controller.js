
const service = require('../services/categoriesExpenses.service')

//Create 
exports.createCategory = async(req,res)=>{
    try{
        const {name, userId} = req.body
        if(!name || !userId)
            return res.status(400).json({error: 'Missing name or userId'})

        const data = await service.createCategory(name,userId)
        res.status(200).json({message: 'Category created',data})
    }catch(error){
        console.error('Create category error: ',error)
        res.status(500).json({error: error.message})
    }
}

// Read
exports.getCategoriesByUser = async(req,res)=>{
    try{
        const {userId} = req.body
        if(!userId) return res.status(400).json({error: 'Missing userId'})

        const data = await service.getCategoriesByUser(userId)
        res.status(200).json({message: 'Get category success!',data})
    }catch(error){
        console.error('Get category error: ',error)
        res.status(500).json({error: error.message})
    }
}

// Update
exports.updateCategory = async(req,res)=>{
    try{
        const {id,name,userId} = req.body
        if(!id || !name || !userId) return res.status(400).json({error: 'Missing id, name or userId'})

        const data = await service.updateCategory(id,name,userId)
        res.status(200).json({message: 'Updated category',data})
    }catch(error){
        console.error('Update category error',error)
        res.status(500).json({error:error.message})
    }
}

exports.deleteCategory = async(req,res)=>{
    try{
        const {id,userId} = req.body
        if(!id,!userId) return res.status(400).json({error: 'Missing id or userId'})

        const data = await service.deleteCategory(id,userId)
        res.status(200).json({message: 'Deleted category'})
    }catch(error){
        console.error('Delete cetagory error: ',error)
        res.status(500).json({error: error.message})
    }
}

