require('dotenv').config();
const express = require('express')
const webhookRoute = require('./routes/webhookRoute')

const app = express()
app.use(express.json())

//webhook routeฃ
app.get('/', (req, res) => res.send('OK - Expense bot running'));
app.use('/webhook', webhookRoute)

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})