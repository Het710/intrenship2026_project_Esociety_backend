const express= require('express')
const router=express.Router()

const userController=require('../controllers/userController')
const validateToken=require('../middleware/authMiddleware')

router.get('/',validateToken,userController.getAllUsers)

router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser)

router.post('/forget-password',userController.forgetPassword)
router.post('/reset-password',userController.resetPassword)



module.exports = router;