const express= require('express')
const cors = require('cors')
require("dotenv").config()
const DBConnection = require('./src/utils/DBConnection')

const userRoutes = require('./src/routes/userRoutes')
const residentRoutes=require('./src/routes/residentRoutes')
const visitorRoutes=require('./src/routes/visitorRoutes')
const complaintRoutes=require('./src/routes/complaintRoutes')
const facilityRoutes=require('./src/routes/facilityRoutes')
const bookingsRoutes=require('./src/routes/bookingRoutes')
const paymentRoutes=require('./src/routes/paymentRoutes')
const noticeRoutes=require('./src/routes/noticeRoutes')
const alertRoutes=require('./src/routes/alertRoutes')
const razorpayRoutes=require('./src/routes/razorpayRoutes')
const discussionRoutes=require('./src/routes/discussionRoutes')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin:[
    "https://internship2026-project-esociety-fro.vercel.app",
    "https://internship2026-project-esociety-fro.vercel.app/"
  ],
  credentials:true
}))
// routes for all the controller
app.use('/api/user',userRoutes)
app.use('/api/residents',residentRoutes)
app.use('/api/visitors',visitorRoutes)
app.use('/api/complaints',complaintRoutes)
app.use('/api/facilities',facilityRoutes)
app.use('/api/bookings',bookingsRoutes)
app.use('/api/payments',paymentRoutes)
app.use('/api/notices',noticeRoutes)
app.use('/api/alerts',alertRoutes)
app.use('/api/razorpay',razorpayRoutes)
app.use('/api/discussions', discussionRoutes)


DBConnection()
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`App is listening on http://localhost:${PORT}`)
})