const { parseText } = require('../utils/parser');
const model = require('../models/expense.model');

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function handleUserText(text) {
  const parsed = parseText(text);

  switch (parsed.intent) {
    case 'help':
      return {
        replyMessages: [
          {
            type: 'text',
            text:
              'คำสั่งที่ใช้ได้:\n' +
              '- เพิ่ม <จำนวน> <หมวด> [YYYY-MM-DD] [note]\n' +
              '- รายการ\n' +
              '- สรุป [YYYY-MM]\n' +
              '- ลบ <id>\n\n' +
              'ตัวอย่าง: เพิ่ม 120 กาแฟ\nพิมพ์ "list" หรือ "รายการ" เพื่อดูรายการล่าสุด'
          }
        ]
      };

    case 'add': {
      const p = parsed.payload;
      const date = p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : todayIso();
      const item = {
        amount: Number(p.amount),
        category: p.category || 'อื่นๆ',
        note: p.note || '',
        date,
        createdAt: new Date().toISOString()
      };
      const saved = model.addExpense(item);
      const textResp = `บันทึกเรียบร้อย: id=${saved.id} | ${saved.amount.toFixed(2)} บาท | ${saved.category} | ${saved.date}`;
      return { replyMessages: [ { type: 'text', text: textResp } ] };
    }

    case 'list': {
      const all = model.getAllExpenses();
      if (!all.length) return { replyMessages: [{ type: 'text', text: 'ยังไม่มีรายการ' }] };
      // เอารายการล่าสุด 20 รายการ (จากใหม่ไปเก่า)
      const latest = all.slice(-20).reverse();
      const lines = latest.map(e => `id=${e.id} | ${e.amount.toFixed(2)} | ${e.category} | ${e.date}`);
      return { replyMessages: [ { type: 'text', text: 'รายการล่าสุด:\n' + lines.join('\n') } ] };
    }

    case 'summary': {
      const month = parsed.payload && parsed.payload.month ? parsed.payload.month : todayIso().slice(0,7);
      const all = model.getAllExpenses();
      const forMonth = all.filter(e => e.date && e.date.slice(0,7) === month);
      if (!forMonth.length) {
        return { replyMessages: [ { type: 'text', text: `ไม่พบรายการในเดือน ${month}` } ] };
      }
      const total = forMonth.reduce((s, x) => s + Number(x.amount), 0);
      const byCat = {};
      forMonth.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount); });
      let text = `สรุปรายจ่าย ${month}\nรวม: ${total.toFixed(2)} บาท\n`;
      for (const cat of Object.keys(byCat)) text += `${cat}: ${byCat[cat].toFixed(2)} บาท\n`;
      return { replyMessages: [ { type: 'text', text } ] };
    }

    case 'delete': {
      const id = parsed.payload.id;
      const ok = model.deleteExpense(id);
      const text = ok ? `ลบรายการ id=${id} เรียบร้อย` : `ไม่พบรายการ id=${id}`;
      return { replyMessages: [ { type: 'text', text } ] };
    }

    default:
      return { replyMessages: [ { type: 'text', text: 'คำสั่งไม่ถูกต้อง — พิมพ์ "ช่วย" เพื่อดูคำสั่งที่ใช้ได้' } ] };
  }
}

module.exports = { handleUserText };
