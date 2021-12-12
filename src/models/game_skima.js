const mongoose = require('mongoose')
const validators = require('validator')

const game_skima = new mongoose.Schema({
    name:{
        type:   String,
        required:true
    },
    cost:{
        type: Number,
        required:true,

    },
    images:[{
        type: Buffer
    }],
    keys:[{
        type:Number
    }],
    category:{
        type:String,
        required:true
    },
    no_of_purchased:{
        type: Number
    }
})

const game = mongoose.model('game',game_skima)
module.exports = game