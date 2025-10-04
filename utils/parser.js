// parser.js
// ฟังก์ชัน parse แบบง่าย สำหรับ demo
// คืนค่า { intent, payload }

function parseText(text) {
  if (!text || !text.trim()) return { intent: 'unknown' };
  const t = text.trim();
  const lower = t.toLowerCase();

  if (lower === 'ช่วย' || lower === 'help') return { intent: 'help' };

  if (lower.startsWith('เพิ่ม ') || lower.startsWith('add ')) {
    // รูปแบบ: เพิ่ม <amount> <category> [YYYY-MM-DD] [note...]
    const parts = t.split(/\s+/);
    parts.shift(); // remove 'เพิ่ม' or 'add'
    const amount = parseFloat(parts[0]);
    if (isNaN(amount)) return { intent: 'unknown' };
    const category = parts[1] || 'อื่นๆ';
    // ดูว่ามีรูปแบบวันที่หรือไม่
    let date = null;
    let note = '';
    if (parts[2] && /^\d{4}-\d{2}-\d{2}$/.test(parts[2])) {
      date = parts[2];
      note = parts.slice(3).join(' ');
    } else {
      note = parts.slice(2).join(' ');
    }
    return { intent: 'add', payload: { amount, category, date, note } };
  }

  if (lower === 'รายการ' || lower === 'list') return { intent: 'list', payload: {} };
  if (lower.startsWith('list ')) {
    const arg = t.split(/\s+/)[1];
    return { intent: 'list', payload: { month: arg } };
  }

  if (lower === 'สรุป' || lower === 'summary') return { intent: 'summary', payload: {} };
  if (lower.startsWith('summary ') || lower.startsWith('สรุป ')) {
    const arg = t.split(/\s+/)[1];
    return { intent: 'summary', payload: { month: arg } };
  }

  if (lower.startsWith('ลบ ') || lower.startsWith('delete ')) {
    const id = parseInt(t.split(/\s+/)[1], 10);
    if (isNaN(id)) return { intent: 'unknown' };
    return { intent: 'delete', payload: { id } };
  }

  return { intent: 'unknown' };
}

module.exports = { parseText };
