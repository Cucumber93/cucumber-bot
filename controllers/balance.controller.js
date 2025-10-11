const balanceService = require('../services/balance.service.js');

exports.getNetBalance = async(req, res)=>{
    try{
        const result = await balanceService.calcuateNetBalance();
        res.json(result);

    }catch(err){
        console.error('Controller error: ',err.message)
        res.status(500).json({error:'Internal Server Error'});
    }
}