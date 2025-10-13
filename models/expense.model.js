class Expense {
  constructor({ id, name, value, categoryExpenseId, created_at,userId }) {
    this.id = id;
    this.name = name;
    this.value = value;  
    this.categoryExpenseId = categoryExpenseId;
    this.created_at = created_at;
    this.userId = userId
  }
}

module.exports = { Expense };
 