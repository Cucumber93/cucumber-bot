const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const expensesRoute = require("./routes/expense.route.js");
const webhookRoute = require("./routes/webhook.route.js");

dotenv.config();


const app = express();
app.use(express.json()); // global json parser
app.use(cors())

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );
// (async()=>{
//     const {data,error} = await supabase.from('ExpensesList').select('*');
//     if(error) console.error('Supabase connection error:', error);
//     else console.log('Supabase connected, expenses:', data);
// })()

// mount webhook route (route handles its own body parsing after middleware)
app.use('/webhook', webhookRoute);
app.use('/api/expenses',expensesRoute);

// optional simple root
app.get('/', (req, res) => res.send('OK - server running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
