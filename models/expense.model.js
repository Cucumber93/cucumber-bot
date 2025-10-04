const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ expenses: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getAllExpenses() {
  const db = readDb();
  return db.expenses || [];
}

function addExpense(exp) {
  const db = readDb();
  // คำนวณ id ใหม่ โดยใช้ max id + 1 (ปลอดภัยเมื่อโดนลบแล้ว)
  const nextId = db.expenses.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
  const item = Object.assign({}, exp, { id: nextId });
  // ensure amount is number (2 decimal)
  item.amount = Number(Number(item.amount).toFixed(2));
  db.expenses.push(item);
  writeDb(db);
  return item;
}

function deleteExpense(id) {
  const db = readDb();
  const idx = db.expenses.findIndex(e => e.id === id);
  if (idx === -1) return false;
  db.expenses.splice(idx, 1);
  writeDb(db);
  return true;
}

module.exports = { getAllExpenses, addExpense, deleteExpense };
