const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.calcuateNetBalance =async()=>{
    try{
        const {data:incomeData,error:incomeError} = await supabase
        .from('Income')
        .select('amount');

        if(incomeError) throw new Error(incomeError.message);

        const {data:expenseData,error:expenseError} = await supabase
        .from('ExpensesList')
        .select('value');

        if(expenseError) throw new Error(expenseError.message);

        const totalIncome = incomeData.reduce((sum,item)=>sum+item.amount,0);
        const totalExpense = expenseData.reduce((sum,item)=>sum+item.value,0);
        const netBalance = totalIncome - totalExpense;

        return {totalIncome,totalExpense,netBalance};
    }catch(err){
        throw new Error(err.message)
    }
}