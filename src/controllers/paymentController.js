const paymentSchema = require('../models/paymentModel')
const facilityBookingSchema=require('../models/facilityBookingModel')
const getAllPayments = async (req,res)=>{
    try {

        const payments = await paymentSchema.find()

        return res.status(200).json({
            message:"Payments fetched successfully",
            data:payments
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching payments",
            err:error.message
        })
        
    }
}

const createPayment = async (req,res)=>{
    try {
        const user=req.user;
        console.log('req user: ',user)

        const{amount,paymentType,bookingId,paymentMethod} =req.body;
        const payment=await paymentSchema.create({
            payerId:user.id,
            bookingId,
            amount,
            paymentType,
            paymentMethod,
            status:'Pending'
        })

           return res.status(201).json({
            message:"Payment initiated",
            data:payment
        })
    } catch (error) {
        console.log("🔥 PAYMENT ERROR FULL:", error)   
    console.log("🔥 MESSAGE:", error.message)
        return res.status(500).json({
            message:"Error while creating payment",
            err:error.message
        })
        
    }
}

const updatePayment = async (req,res)=>{
    try {

        const id = req.params.id

        const updatedPayment = await paymentSchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        return res.status(200).json({
            message:"Payment updated successfully",
            data:updatedPayment
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating payment",
            err:error.message
        })
        
    }
}

const deletePayment = async (req,res)=>{
    try {

        const id = req.params.id

        const deletedPayment = await paymentSchema.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Payment deleted successfully",
            data:deletedPayment
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting payment",
            err:error.message
        })
        
    }
}

const markPaymentSuccess=async(req,res)=>{
    try {
        const id=req.params.id;
        const payment=await paymentSchema.findById(id)

        if(!payment){
            return res.status(404).json({
                message:"Payment Not Found"
            })
        }

        payment.status = 'Paid'
        await payment.save()

        if(payment.bookingId){
          await facilityBookingSchema.findByIdAndUpdate(
            payment.bookingId,
        { paymentStatus: "Paid" },
        {new:true}
)
        }

            return res.status(200).json({
            message:"Payment successful",
            data:payment
        })
    } catch (error) {
        return res.status(500).json({
            message:"payment failed",
            err:error.message
        })
    }
}

module.exports = {
    getAllPayments,
    createPayment,
    updatePayment,
    deletePayment,
    markPaymentSuccess
}