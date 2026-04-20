const mongoose=require('mongoose')
const Schema= mongoose.Schema

const facilitySchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    availability:{
        type:Boolean,
        default:true,
        required:true
    },
    basePrice:{
        type:Number,
        default:0
    },
    capacity:{
        type:Number
    }
},{timestamps:true})

module.exports=mongoose.model('facility',facilitySchema)