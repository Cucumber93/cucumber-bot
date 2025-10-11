class Expense {
  constructor({ id, name, amount, categoryId, created_at }) {
    this.id = id;
    this.name = name;
    this.amount = amount; // ✅ เดิมคุณเขียนเป็น value (ผิดตัวแปร)
    this.categoryId = categoryId;
    this.created_at = created_at;
  }
}

module.exports = { Expense };
