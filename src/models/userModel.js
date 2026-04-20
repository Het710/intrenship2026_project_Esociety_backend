const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Resident","Admin","Security"],
        default:"Resident"
    },
    status:{
        type:String,
        default:"active",
        enum:["active","inactive","deleted","blocked"]

    }
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)