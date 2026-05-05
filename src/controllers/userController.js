const userSchema = require('../models/userModel')
const bcrypt = require('bcrypt')
const sendMail = require('../utils/mailUtil')
const jwt=require('jsonwebtoken')
const secret = process.env.JWT_SECRET

if(!secret){
        console.error("JWT_SECRET is missing")
        process.exit(1)
    }
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const savedUser = await userSchema.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role
    });

    const { password: _, ...userData } = savedUser._doc;

    // try {
    //   sendMail(
    //     savedUser.email,
    //     "Welcome to E-Society",
    //     `Hello ${savedUser.firstName}, thank you for registering!`
    //   );
    // } catch (mailErr) {
    //   console.log("Mail Error:", mailErr.message);
    // }

    res.status(201).json({
      message: "User created successfully",
      data: userData
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
      message: "error while creating user",
      error: err.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            message:"Email and Password require"
        })
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.password) {
      return res.status(500).json({
        message: "User password not set properly"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }
  
    const token = jwt.sign(
      { id: user._id, role: user.role },
        secret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login Success",
      token,
      user: {
        _id: user._id,
        role: user.role,
        firstName: user.firstName
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Error while logging in",
      error: err.message
    });
  }
};

const getAllUsers=async(req,res)=>{
try {
    if(!req.user || req.user.role !== 'Admin'){
        return res.status(403).json({
            message:"Only admin can view users"
        })
    }

    const users = await userSchema.find().select("-password")

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
            const url = `https://internship2026-project-esociety-fro.vercel.app/reset-password/${token}`
              const mailText = `<html>
              <p>Click below to rest password</p>
            <a href ='${url}'>RESET PASSWORD</a>
        </html>`
          await sendMail(foundUserFromEmail.email,"Reset Password Link",mailText)
        res.status(200).json({
            message:"reset link has been sent to your email"
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
    let decodedUser;
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
       try {
    decodedUser = jwt.verify(token, secret);
} catch (err) {
    return res.status(401).json({
        message: "Token expired or invalid"
    });
}
        const hashPassword = await bcrypt.hash(newPassword,10)
        await userSchema.findByIdAndUpdate(decodedUser.id,{password:hashPassword})
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