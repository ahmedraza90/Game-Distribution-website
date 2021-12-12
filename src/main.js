const express = require('express')
const sign = require('./routes/sign_route')
const game = require('./routes/game_routes')

const app = express()

app.use(express.json())
app.use(sign)
app.use(game)

app.listen(3000)