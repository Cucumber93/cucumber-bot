const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const expensesRoute = require("./routes/expense.route.js");
const webhookRoute = require("./routes/webhook.route.js");

dotenv.config();



app.use(express.json()); // global json parser
app.use(cors())

app.use('/webhook', webhookRoute);

const app = express();
app.use('/api/expenses',expensesRoute);

// optional simple root
app.get('/', (req, res) => res.send('OK - server running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
