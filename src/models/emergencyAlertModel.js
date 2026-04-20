const mongoose=require('mongoose')
const Schema = mongoose.Schema

const alertSchema=new Schema({
    message:{
        type:String,
        required:true
    },
    alertType:{
        type:String,
        enum:["Fire","Security","Medical","Other"],
        required:true
    },
    sentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"High"
    },
    status:{
        type:String,
        enum:["Active","Resolved"],
        default:"Active"
    }

},{timestamps:true})

module.exports = mongoose.model('alert',alertSchema)