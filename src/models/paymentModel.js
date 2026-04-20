const mongoose=require('mongoose')
const Schema = mongoose.Schema

const paymentSchema=new Schema({
    payerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentType:{
        type:String,
        enum:["Maintenance","Booking"],
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["UPI", "Card", "Cash"],
        required:true
    },
    status:{
        type:String,
        enum:["Paid", "Pending", "Failed"],
        default:"Pending",
        required:true
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'booking'
    },
    paymentTime:{
        type:Date,
        default:Date.now
    }


},{timestamps:true})

module.exports=mongoose.model('payment',paymentSchema)