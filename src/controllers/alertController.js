const alertSchema = require('../models/emergencyAlertModel')

const getAllAlerts = async (req,res)=>{
    try {

        const alerts = await alertSchema.find()

        return res.status(200).json({
            message:"Alerts fetched successfully",
            data:alerts
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching alerts",
            err:error.message
        })
        
    }
}

const createAlert = async (req,res)=>{
    try {

       const {message,alertType,priority} = req.body;
       if(req.user.role !== "Resident"){
        return res.status(403).json({
         message: "Only residents can create alerts"
        })
       }
       const savedAlert = await alertSchema.create({
        message,
        alertType,
        sentBy:req.user.id,
        priority
       })
        return res.status(201).json({
            message:"Alert created successfully",
            data:savedAlert
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while creating alert",
            err:error.message
        })
        
    }
}

const updateAlert = async (req,res)=>{
    try {

        const id = req.params.id

        const updatedAlert = await alertSchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        return res.status(200).json({
            message:"Alert updated successfully",
            data:updatedAlert
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating alert",
            err:error.message
        })
        
    }
}

const deleteAlert = async (req,res)=>{
    try {

        const id = req.params.id

        const deletedAlert = await alertSchema.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Alert deleted successfully",
            data:deletedAlert
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting alert",
            err:error.message
        })
        
    }
}

const resolveAlert=async(req,res)=>{
    try {
       if(req.user.role !== 'Admin' && req.user.role!== 'Security') {
         return res.status(403).json({
            message:"Only Admin or Security can resolve alerts"
         })
       }
       const id = req.params.id;

       const updated = await alertSchema.findByIdAndUpdate(id,{status:"Resolved"},{new:true})

       return res.status(200).json({
        message:"Alert Resolved",
        data:updated
       })

    } catch (error) {
        return res.status(500).json({
            message:"Error resolving alert",
            err: error.message
        })
    }
}

module.exports = {
    getAllAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    resolveAlert
}