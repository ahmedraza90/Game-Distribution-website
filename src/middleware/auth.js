const j = require('jsonwebtoken')
const sign_skima = require('../models/sign_skima')

const auth = async (req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ','')
    const token_check = j.verify(token,'gamedistros')
    const user = await sign_skima.findOne({_id:token_check._id, 'Tokens.token':token})
    if(!user){
        throw('user is not authorized')
    }
    req.token = token
    req.token_user = user
    next()
    }catch(e){
        res.status(400).send(e)
    }
    
}

module.exports = auth