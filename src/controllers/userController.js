const userSchema = require('../models/userModel')
const bcrypt = require('bcrypt')
const sendMail = require('../utils/mailUtil')
const jwt=require('jsonwebtoken')
const MailMessage = require('nodemailer/lib/mailer/mail-message')
const secret = 'secret'
const registerUser = async(req,res)=>{
try {
    const hashPassword = await bcrypt.hash(req.body.password,10)
    const savedUser= await userSchema.create({...req.body,password:hashPassword})
     try {
    await sendMail(
    savedUser.email,
    "Welcome to E-Society",
    `Hello ${savedUser.firstName}, thank you for registering with our app!`
);
    } catch (mailErr) {
      console.log("Mail Error:", mailErr.message);
    }

    res.status(201).json({
        message:"User created successfully",
        data:savedUser
    })
} catch (err) {
    res.status(500).json({
        message:"error while creating user",
        error:err.message
    })
}

} 

const loginUser=async(req,res)=>{
try {
    const {email,password} = req.body
    const foundUserFromEmail = await userSchema.findOne({email:email})
    if(foundUserFromEmail){
        const isPasswordMatched = await bcrypt.compare(password,foundUserFromEmail.password)
        if(isPasswordMatched){
         const token = jwt.sign({id:foundUserFromEmail._id,role:foundUserFromEmail.role},secret,{expiresIn:"7d"})

         res.status(200).json({
            message:"Login Success",
            token,
            user:{
                _id:foundUserFromEmail._id,
                role:foundUserFromEmail.role,
                firstName:foundUserFromEmail.firstName
            }
         })
        } else{
            res.status(401).json({
                message:"Invalid password"
            })
        }
    } else{
        res.status(404).json({
            message:"User not found"
        })
    }
} catch (err) {
    return res.status(500).json({
        message:"Error while logging in",
        err:err.message
    })
}
} 

const getAllUsers=async(req,res)=>{
try {
    if(req.user.role !== 'Admin'){
        return res.status(403).json({
            message:"Only admin can view users"
        })
    }

    const users = await userSchema.find().select(" -password")

    return res.status(200).json({
        message:"Users fetched successfully",
        data:users
    })
} catch (error) {
    return res.status(500).json({
        message:"Error fetching users",
        err:error.message
    })
}
}

const forgetPassword = async(req,res)=>{
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).json({
                message:"Email is not provided"
            })
        }

        const foundUserFromEmail = await userSchema.findOne({email})
        if(foundUserFromEmail){
            const token = jwt.sign({id:foundUserFromEmail._id},secret,{expiresIn:'7d'})
            const url=`http://localhost:5173/reset-password/${token}`
              const mailText = `<html>
              <p>Click below to rest password</p>
            <a href ='${url}'>RESET PASSWORD</a>
        </html>`
          await sendMail(foundUserFromEmail.email,"Reset Password Link",mailText)
        res.status(200).json({
            message:"rest link has been sent to your email"
        })
        } else{
            res.status(404).json({
                message:"User not found"
            })
        } 
      
    } catch (error) {
        return res.status(500).json({
            message:"Error while changing the password",
            err:error.message
        })
    }
}

const resetPassword = async(req,res)=>{
    const {newPassword,token} = req.body
    try {
        if(!newPassword || !token){
            return res.status(400).json({
                message:"missing data"
            })
        }
        if(newPassword.length < 6){
            return res.status(400).json({
                message:"Password must be at least 6 characters"
            })
        }
        const decodedUser = jwt.verify(token,secret)
        const hashPassword = await bcrypt.hash(newPassword,10)
        const updateUser = await userSchema.findByIdAndUpdate(decodedUser.id,{password:hashPassword})
        res.status(200).json({
            message:"Password reset successfully"
        })
        
    } catch (error) {
          res.status(500).json({
            message:"server error..",
            err:error.message
        })
    }
}

module.exports={
    registerUser,
    loginUser,
    getAllUsers,
    forgetPassword,
    resetPassword
}