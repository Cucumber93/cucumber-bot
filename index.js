const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const expensesRoute = require("./routes/expense.route.js");
const balanceRoute = require("./routes/balance.route.js");
const webhookRoute = require("./routes/webhook.route.js");

dotenv.config();


const app = express();
// global json parser
app.use(cors())

app.use('/webhook', webhookRoute);
app.use(express.json()); 

app.use('/api/expenses',expensesRoute);
app.use('/api/balance',balanceRoute)

// optional simple root
app.get('/', (req, res) => res.send('OK - server running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
