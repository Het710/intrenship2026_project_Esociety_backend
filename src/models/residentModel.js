const mongoose=require('mongoose')
const Schema=mongoose.Schema

const residentSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    flatNumber:{
        type:String,
        required:true
    },
    block:{
        type:String
    },
    membershipType:{
        type:String,
        enum:["Owner","Tenant"],
        required:true
    },
    moveInDate:{
        type:Date,
        default:Date.now
    },
},{timestamps:true})

module.exports = mongoose.model('resident',residentSchema)