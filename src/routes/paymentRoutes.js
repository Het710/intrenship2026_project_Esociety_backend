const express=require('express')
const router=express.Router()

const paymentController = require('../controllers/paymentController')
const validateToken=require('../middleware/authMiddleware')
router.get('/', validateToken,paymentController.getAllPayments)
router.post('/', validateToken,paymentController.createPayment)
router.put('/success/:id',validateToken, paymentController.markPaymentSuccess)
router.delete('/:id',validateToken, paymentController.deletePayment)

module.exports = router