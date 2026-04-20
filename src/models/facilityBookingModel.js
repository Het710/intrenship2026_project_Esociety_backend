const mongoose = require('mongoose')
const Schema=mongoose.Schema

const facilityBookingSchema=new Schema({
residentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},
facilityId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'facility',
    required:true
},
bookingDate:{
    type:Date,
    required:true
},
timeSlot:{
    type:String,
    required:true
},
amount:{
    type:Number,
    default:0
},
paymentStatus:{
    type:String,
    enum:["Pending", "Paid", "Failed"],
    default:"Pending",
    required:true
},
status:{
type:String,
enum:["Confirmed", "Cancelled", "Completed"],
default:"Confirmed",
required:true
}
},{timestamps:true})

module.exports=mongoose.model('booking',facilityBookingSchema)