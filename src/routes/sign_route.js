require('../db/mongoose')
const sign = require('../models/sign_skima')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')


//sign-up end point
router.post('/sign-up',async (req,res)=>{
  //Does mongoose filter out extra properties?
  //Any key/val set on the instance that does not exist in your schema is always ignored, regardless of 
  //schema option.
  //According to mongoose's docs: http://mongoosejs.com/docs/guide.html#strict
  //we are not storing confirm password field in skima. this is extra field so strict is set to false in 
  //order to get access confirm password in skima
    const user = new sign(req.body,false) //or user.set('confirm_pass',req.body.confirm_pass)
    try{
      //make sure confirm password is required
        if(!req.body.confirm_pass){
          throw("confirm_pass is required")
        }
         const token = await user.JWT_token()
         res.send({user, token})   
       }catch(error){
         //if error is validation error then create an empty obj loop through errors obj and catch the 
         //filed name from this object to get the message
          if(error.name=="ValidationError"){
            let err = {}
            Object.keys(error.errors).forEach((key)=>{
            err[key]=error.errors[key].message
            })
            return res.status(400).send(err)
          }
          res.status(400).send({error})
          //unique
          //password match
          //confirm pass req.
       }
})

//sign-in end point
router.post('/sign-in',async (req,res)=>{
//check email or password is empty or not from front end
try{
     const user  = await sign.check_user(req.body.email,req.body.password)
     const token = await user.JWT_token() 
     res.status(200).send({user,token})
}catch(e){
  res.status(400).send(e)
}
})

//log-out
router.post('/log-out',auth,async (req,res)=>{
//If I call contact.save(function(err){...}) I'll receive an error if the contact with the same phone 
//number already exists (as expected - unique)
//How do I update/upsert a document in Mongoose?
//https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
  try{  
          req.token_user.Tokens = req.token_user.Tokens.filter((t)=>{
            return t.token !== req.token
          })
          // const user = await sign.findByIdAndUpdate({_id:req.token_user._id},{'Tokens':req.token_user.Tokens})
          await req.token_user.save() 
          res.send(req.token_user)
  }catch(e){
          res.status(400).send(e)
  }

})
//update
router.patch('/update',auth,async (req,res)=>{
  try{
    //if password is there then confirm password is required
     if(req.body.password){
       if(!req.body.confirm_pass){
         throw('confirm password is required')
       }
     }
      const body = Object.keys(req.body)
      body.forEach((elem)=>{ 
       req.token_user[elem]=req.body[elem]
     })
    await req.token_user.save()
    res.send(req.token_user)
    }catch(error){
      if(error.name=="ValidationError"){
        let err = {}
        Object.keys(error.errors).forEach((key)=>{
        err[key]=error.errors[key].message
        })
        return res.status(400).send(err)
      }
      res.status(400).send({error})
    }

})

//delete user
router.delete('/delete',auth,async (req,res)=>{
  try{
    await req.token_user.remove()
    res.send('success')
  }catch(e){
    res.status(400).send(e)
  }
})
module.exports=router