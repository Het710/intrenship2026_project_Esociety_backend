const express=require('express')
const router=express.Router()

const razorpayController=require('../controllers/razorpayController')
const validateToken=require('../middleware/authMiddleware')

router.post('/create-order',validateToken,razorpayController.createOrder)
router.post('/verify',validateToken,razorpayController.verifyPayment)

module.exports=router