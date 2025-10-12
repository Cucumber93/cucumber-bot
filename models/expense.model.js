class Expense {
  constructor({ id, name, value, categoryId, created_at }) {
    this.id = id;
    this.name = name;
    this.value = value; // ✅ เดิมคุณเขียนเป็น value (ผิดตัวแปร)
    this.categoryId = categoryId;
    this.created_at = created_at;
  }
}

module.exports = { Expense };
