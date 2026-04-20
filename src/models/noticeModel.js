const mongoose=require('mongoose')
const Schema=mongoose.Schema

const noticeSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    expiryDate:{
        type:Date
    }
},{timestamps:true})

module.exports = mongoose.model('notice',noticeSchema)