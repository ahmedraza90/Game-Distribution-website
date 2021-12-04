const j = require('jsonwebtoken')
const sign_skima = require('../models/sign_skima')

const auth = async (req,res,next)=>{
    try{
    //extarcting secret key frrom header
    const token = req.header('Authorization').replace('Bearer ','')

    //when token get expired it does not get verify varifying the secretkey
    const token_check = j.verify(token,'gamedistros')
    
    //finding user details with id and token we get from secret key 
    const user = await sign_skima.findOne({_id:token_check._id, 'Tokens.token':token})
    if(!user){
        throw('user is not authorized')
    }
    req.token = token
    req.token_user = user
    next()
    }catch(e){
        res.status(400).send(`Invalid token`)
    }
    
}

module.exports = auth