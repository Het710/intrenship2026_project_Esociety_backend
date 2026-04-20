const Razorpay = require("razorpay")
const crypto = require("crypto")
const paymentSchema = require("../models/paymentModel")
const facilityBookingSchema = require("../models/facilityBookingModel")

// ✅ INIT RAZORPAY
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
})


// ✅ CREATE PAYMENT + ORDER
const createOrder = async (req, res) => {
  try {
    const user = req.user

    const { amount, bookingId, paymentType, paymentMethod } = req.body

    // ✅ CREATE PAYMENT ENTRY (IMPORTANT FIX)
    const payment = await paymentSchema.create({
      payerId: user.id,
      bookingId,
      amount,
      paymentType,
      paymentMethod,   // ✅ FIXED HERE
      status: "Pending"
    })

    // ✅ CREATE RAZORPAY ORDER
    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: bookingId.toString()
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      order,
      paymentId: payment._id   // 👈 IMPORTANT
    })

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error)
    res.status(500).json({
      success: false,
      message: "Error creating order"
    })
  }
}


// ✅ VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      paymentId
    } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature === razorpay_signature) {

      // ✅ UPDATE PAYMENT
      await paymentSchema.findByIdAndUpdate(paymentId, {
        status: "Paid"
      })

      // ✅ UPDATE BOOKING
      await facilityBookingSchema.findByIdAndUpdate(bookingId, {
        paymentStatus: "Paid"
      })

      return res.status(200).json({
        success: true,
        message: "Payment Verified"
      })

    } else {
      return res.status(400).json({
        success: false,
        message: "Verification Failed"
      })
    }

  } catch (error) {
    console.log("VERIFY ERROR:", error)
    res.status(500).json({
      success: false,
      message: "Server Error"
    })
  }
}

module.exports = {
  createOrder,
  verifyPayment
}