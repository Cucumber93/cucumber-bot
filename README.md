# cucumber-bot
income-expenses line bot

# How to run

node index.js


# Trend Expenses API
| Type         | Function                   | Key ที่ส่งกลับ                    | ตัวอย่างค่า                                                  | ช่วงเวลา              |
| ------------ | -------------------------- | --------------------------------- | ------------------------------------------------------------ | --------------------- |
| `hourly`     | getTrendExpensesHourly     | `{hour, category, totalExpense}`  | `{"hour":"13:00","category":"Food","totalExpense":120}`      | วันนี้                |
| `last7days`  | getTrendExpensesLast7Days  | `{date, category, totalExpense}`  | `{"date":"2025-10-11","category":"Food","totalExpense":300}` | 7 วันล่าสุด           |
| `last30days` | getTrendExpensesLast30Days | `{date, category, totalExpense}`  | เหมือนด้านบน                                                 | 30 วันล่าสุด          |
| `monthly`    | getTrendExpensesMonthly    | `{month, category, totalExpense}` | `{"month":"2025-10","category":"Food","totalExpense":900}`   | รายเดือนของปีนี้      |
| `yearly`     | getTrendExpensesYearly     | `{year, category, totalExpense}`  | `{"year":"2025","category":"Food","totalExpense":15000}`     | รายปี (ย้อนหลัง 5 ปี) |

# Trend Income and Expenses API
| ฟังก์ชัน                         | ขอบเขตเวลา             | คีย์หลักที่ส่งกลับ                      | ตัวอย่างค่า                                                |
| -------------------------------- | ---------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `getHourlySummary`               | วันนี้                 | `{ hour, totalIncome, totalExpense }`   | `{hour:"14:00", totalIncome:100, totalExpense:50}`         |
| `getLast7DaysSummary`            | 7 วันล่าสุด            | `{ date, totalIncome, totalExpense }`   | `{date:"2025-10-07", totalIncome:500, totalExpense:200}`   |
| `getLast30DaysSummary`           | 30 วันล่าสุด           | `{ date, totalIncome, totalExpense }`   | `{date:"2025-10-01", totalIncome:900, totalExpense:650}`   |
| `getMonthlySummary`              | รายเดือน (1–สิ้นเดือน) | `{ period, totalIncome, totalExpense }` | `{period:"2025-10", totalIncome:30000, totalExpense:2500}` |
| `getMonthlyDetails(year, month)` | ข้อมูลภายในเดือน       | `{ month, income[], expenses[] }`       | `{month:"2025-10", income:[...], expenses:[...]}`          |
| `getYearlySummary`               | รายปี                  | `{ year, totalIncome, totalExpense }`   | `{year:"2025", totalIncome:120000, totalExpense:45000}`    |

