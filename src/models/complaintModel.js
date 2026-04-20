const mongoose=require('mongoose')
const Schema=mongoose.Schema

const complaintSchema=new Schema({
    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    category:{
        type:String,
         enum:["Plumbing","Electricity","Cleaning","Security","Other"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Open","In-Progress","Resolved"],
        default:"Open",
        required:true
    },
    complainImage:{
        type:String,
    },
    resolvedAt:{
        type:Date
    }
},{timestamps:true})

module.exports=mongoose.model('complaint',complaintSchema)