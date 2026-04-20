const mongoose = require('mongoose')
const Schema = mongoose.Schema

const visitorSchema = new Schema({
    visitorName:{
        type:String,
        required:true
    },
    visitType:{
        type:String,
        enum:["Guest","Delivery","Maintenance"],
        required:true
    },
    residentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"resident",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true

    },
    visitorPhoto:{
        type:String
    },
    approvalStatus:{
        type:String,
        enum:["Pending","Approved","Denied"],
        default:"Pending",
        required:true
    },
    entryTime:{
        type:Date,
        default:Date.now
    },
    exitTime:{
        type:Date,
    }
},{timestamps:true})

module.exports=mongoose.model('visitor',visitorSchema)