const express=require('express')
const router =express.Router()
const bookingController=require('../controllers/bookingController')
const validateToken=require('../middleware/authMiddleware')

router.post('/',validateToken,bookingController.createBooking)

router.get('/',validateToken,bookingController.getBookings)

router.put('/pay/:id',validateToken,bookingController.makePayment)
router.put('/cancel/:id',validateToken,bookingController.cancelBooking)
router.put('/complete/:id',validateToken,bookingController.completeBooking)



module.exports =router