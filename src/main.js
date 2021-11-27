const express = require('express')
const sign = require('./routes/sign_route')

const app = express()

app.use(express.json())
app.use(sign)

app.listen(3000)