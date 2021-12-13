const express = require('express')
const sign = require('./routes/sign_route')
const game = require('./routes/game_routes')
const port = process.env.PORT || 3000


const app = express()

app.use(express.json())
app.use(sign)
app.use(game)

app.listen(port)