const facilityBookingSchema = require('../models/facilityBookingModel')
const facilitySchema=require('../models/facilityModel')

const createBooking=async(req,res)=>{
    try {
        const {facilityId,bookingDate,timeSlot} =req.body
        const user = req.user;
        const facility=await facilitySchema.findById(facilityId)
        if(!facility){
            return res.status(404).json({
                message:"Facility not found"
            })
        }
        if(!facility.availability){
            return res.status(400).json({
                message:"Facility not available"
            })
        }

        const existingBooking=await facilityBookingSchema.findOne({
            facilityId,
            bookingDate,
            timeSlot,
            status:"Confirmed"
        })

    if (existingBooking) {
      return res.status(400).json({
        message: "Slot already booked"
      })
    }

    const booking=await facilityBookingSchema.create({
        residentId:user.id,
        facilityId,
        bookingDate,
        timeSlot,
        amount:facility.basePrice,
        paymentStatus:'Pending'
    })

    return res.status(201).json({
        message:"Booking created ",
        data:booking
    })
    } catch (error) {
        return res.status(500).json({
      message: "Error creating booking",
      err: error.message
    })
    }
}

const getBookings=async(req,res)=>{
    try {
        const user=req.user
        let bookings

        if(user.role === 'Admin'){
            bookings=await facilityBookingSchema.find().populate('facilityId').populate('residentId','firstName email')
        } else{
            bookings=await facilityBookingSchema.find({residentId:user.id}).populate('facilityId')
        }
        return res.status(200).json({
      message: "Bookings fetched",
      data: bookings
    })

    } catch (error) {
      return res.status(500).json({
      message: "Error fetching bookings",
      err: error.message
    })
    }
}

const makePayment=async(req,res)=>{
    try {
        const id=req.params.id;

        const booking=await facilityBookingSchema.findById(id)

        if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.paymentStatus = "Paid"
    await booking.save()

    return res.status(200).json({
      message: "Payment successful",
      data: booking
    })
    } catch (error) {
        return res.status(500).json({
      message: "Payment failed",
      err: error.message
    })
    }
}

const cancelBooking=async(req,res)=>{
    try {
        const id=req.params.id;
        const user=req.user

        const booking=await facilityBookingSchema.findById(id)

        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            })
        }

        if(booking.residentId.toString() !== user.id && user.role !== 'Admin'){
            return res.status(403).json({
                message:'Not Authorized'
            })
        }

        booking.status = 'Cancelled'
        await booking.save()

        return res.status(200).json({
            message:"Booking cancelled",
            data:booking
        })
    } catch (error) {
     return res.status(500).json({
      message: "Cancel failed",
      err: error.message
    })
    }
}

const completeBooking=async(req,res)=>{
    try {
        const id =req.params.id;
        const user=req.user
        const booking =await facilityBookingSchema.findById(id)

        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            })
        }

        booking.status = 'Completed'
        await booking.save()

        return res.status(200).json({
            message:"Booking completed",
            data:booking
        })

    } catch (error) {
        return res.status(500).json({
      message: "Error completing booking",
      err: error.message
    })
    }
}
module.exports={
    createBooking,
    getBookings,
    makePayment,
    cancelBooking,
    completeBooking
}
