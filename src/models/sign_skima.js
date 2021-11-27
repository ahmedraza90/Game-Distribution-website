const mongoose   = require('mongoose')
const validators = require('validator')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const sign_skima = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        validate:[
            {
                validator(value){
                    return validators.isAlpha(value)
                },
                message: `firstname is not valid `
            }
        ]

    },
    lastname:{
        type: String,
        required:[true,'lastname is required'],
        validate:[
            {
                validator(value){
                    return validators.isAlpha(value)
                },
                message: `last is not valid `
            }
        ]

    },
    email:{
        type: String,
        required:[true,'email is required'],
        // unique:[true,'email is registered'],
        validate:[
            {
                validator(value){
                    return validators.isEmail(value)
                },
                message: `email is not valid `
            },
            //Mongoose unique validation error type
            //https://stackoverflow.com/questions/13580589/mongoose-unique-validation-error-type
            {
                async validator(value){
                    //for sign-up id will be modified but for sign-in or update there is no need to check unique validation
                    if(this.isModified('_id')){
                    const count = await mongoose.model('sign').count({email:value})
                    return(!count)
                    }
                },
                message: `email is already taken`
            }
        ]

    },
    password:{
        type: String,
        required:[true,'password is required'],
        validate:[
        {
            validator(value){
                return value.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W)[a-zA-Z0-9\W]+$/)
                //https://stackoverflow.com/questions/388996/regex-for-javascript-to-allow-only-alphanumeric
            },
            message:'password must contains numbers and alphabets and special character'
        },
        {
            validator(value){
                return (value.length>=10)
            },
            message:`password length is less than 10 digits`
        }
        ]
    },
    Tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
})

sign_skima.statics.check_user = async (email,password)=>{
        const find = await sign.findOne({email})
        if(!find){
            throw('Invalid email')
        }
        const check_pass = await bcrypt.compare(password,find.password)
        if(check_pass===false){
            throw('unable to login')
        }
        return find
}

sign_skima.methods.JWT_token = async function(){
    const user = this
    const gen_token = jsonwebtoken.sign({_id:user._id.toString()},'gamedistros',{expiresIn:'48h'})
    user.Tokens = user.Tokens.concat({token:gen_token})
    return gen_token
}


//just before saving
sign_skima.pre('save',async function(next){
    const user = this
    //for sign-up and update there is need to match pass and confirm_pass but for sign-in no need
    if(user.confirm_pass){
       if(user.confirm_pass!=user.password){
        throw('password do not matched')
        }
        //Is there a way to remove a key from a document just before saving?
        //Either use User.update({ _id: id }, { $unset: { field: 1 }}, callback) 
        // or if you have a document instance, set the path to undefined and then save it:
        // doc.field = undefined; doc.save()
        //https://stackoverflow.com/questions/4486926/delete-a-key-from-a-mongodb-document-using-mongoose
        user.confirm_pass = undefined
    }
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const sign = mongoose.model('sign',sign_skima)
module.exports = sign


