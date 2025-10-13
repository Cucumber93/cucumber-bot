class Income{
    constructor({id,name,value,categoryIncomeId,created_at,userId}){
        this.id = id
        this.name = name
        this.value = value
        this.categoryIncomeId = categoryIncomeId
        this.created_at = created_at
        this.userId = userId
    }
}

module.exports = {Income}