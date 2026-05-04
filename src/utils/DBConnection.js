const mongoose = require('mongoose')
require("dotenv").config()

const DBConnection=async(req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("DB connected")
    })
    .catch((err)=>{
        console.log("error",err)
    })
}
module.exports = DBConnection