const service = require('./services/expense.service');

(async()=>{
    console.log(await service.handleUserText('ช่วย'));
    console.log(await service.handleUserText('เพิ่ม 120 กาแฟ'));
    console.log(await service.handleUserText('รายการ'));
})()