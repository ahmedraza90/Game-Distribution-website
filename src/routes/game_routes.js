require('../db/mongoose')
const game = require('../models/game_skima')
const express = require('express')
const route = new express.Router()

//insert game
route.post('/add-games',async (req,res)=>{
    try{
        const user = new game(req.body)
        await user.save()
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//game list
//string query 1--category 2--skip
route.get('/get-games-filter-public',async(req,res)=>{
    const match={}
    if(req.query.category){
        match.category = req.query.category
    }
        try{
            const user = await game.find()
            // const user = await game.find(match).limit(6).skip(parseInt(req.query.skip)).sort({no_of_purchased:-1})
            res.json(user)
        }catch(e){
            console.log(e)
            res.status(400).send('e')
        }
})

//get a game
route.get('/get-a-game-public/:id',async(req,res)=>{
    try{
        const user = await game.findById(req.params.id)
        if(!user){
            return res.status(404).send('Invalid id')
        }
        const  uzer = user.toObject()
        delete uzer._id
        delete uzer.keys
        delete uzer.__v
        res.send(uzer)
    }catch(e){
        res.status(400).send(e)
    }
})

//update game
route.patch('/update-game-admin/:id', async(req,res)=>{
    try{
    const user = await game.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
    if(!user){
        return res.status(404).send('Invalid id')
    }
    res.send("successfully updated")
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

//delete game
route.delete('/delete-game/:id',async(req,res)=>{
    try{
        const user = await game.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(400).send('invalid id')
        }
        res.send('successfuly deleted')
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports = route
