// index.js
require('dotenv').config(); // load .env first
const express = require('express');
const webhookRoute = require('./routes/webhookRoute');
// const { createClient } = require('@supabase/supabase-js');

const app = express();

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

// optional simple root
app.get('/', (req, res) => res.send('OK - server running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
