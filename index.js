const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const expensesRoute = require("./routes/expense.route.js");
const balanceRoute = require("./routes/balance.route.js");
const trendExpensesRoute = require("./routes/trendExpenses.route.js");
const trendIncomeAndExpensesRoute = require('./routes/trendIncomeAndExpenses.route.js')
const webhookRoute = require("./routes/webhook.route.js");
const authRoute = require('./routes/auth.route.js')
const categoryIncomeRoute = require("./routes/categoriesIncome.route.js")
const categoryExpenses = require("./routes/categoriesExpenses.route.js")
const listExpense = require('./routes/listExpense.route.js')

dotenv.config();


const app = express();
// global json parser
app.use(cors())

app.use('/webhook', webhookRoute);
app.use(express.json()); 

app.use('/api/auth',authRoute)
app.use('/api/expenses',expensesRoute);
app.use('/api/balance',balanceRoute)
app.use('/api/trend-expenses',trendExpensesRoute)
app.use('/api/compare',trendIncomeAndExpensesRoute)
app.use("/api/category-income", categoryIncomeRoute)
app.use("/api/category-expenses",categoryExpenses)
app.use('/api/list-expense',,listExpense)

// optional simple root
app.get('/', (req, res) => res.send('OK - server running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
