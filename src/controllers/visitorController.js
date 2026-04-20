const visitorSchema = require('../models/visitorModel')
const uploadToCloudinary = require('../utils/cloudinaryUtil')

const getAllVisitors = async (req,res)=>{
    try {

        const visitors = await visitorSchema.find().populate({
            path:'residentId',
            populate:{
                path:'userId',
                select:'firstName lastName email '
            }
        })

        return res.status(200).json({
            message:"Visitors fetched successfully",
            data:visitors
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching visitors",
            err:error.message
        })
        
    }
}

const createVisitor = async (req, res) => {
    try {
        if (req.user.role !== 'Security') {
            return res.status(403).json({ message: "Only security can add visitors" });
        }

        const { visitorName, visitType, residentId } = req.body;
        let photoUrl = "";

        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.path);
            photoUrl = uploaded.secure_url;
        }

        const savedVisitor = await visitorSchema.create({
            visitorName,
            visitType,
            residentId,
            visitorPhoto: photoUrl,
            createdBy: req.user.id,
            approvalStatus: 'Pending'
        });

        return res.status(201).json({
            message: "Visitor created successfully",
            data: savedVisitor
        });

    } catch (error) {
        return res.status(500).json({ message: "Error", err: error.message });
    }
}

const updateVisitor = async (req,res)=>{
    try {
        if(req.user.role !== 'Security'){
            return res.status(403).json({
                message:"Only security can update the visitor"
            })
        }
        const id = req.params.id

        const updatedVisitor = await visitorSchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        return res.status(200).json({
            message:"Visitor updated successfully",
            data:updatedVisitor
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating visitor",
            err:error.message
        })
        
    }
}

const deleteVisitor = async (req,res)=>{
    try {
        if(req.user.role !== 'Security'){
            return res.status(403).json({
                message:"Only security can delete the visitor"
            })
        }
        const id = req.params.id

        const deletedVisitor = await visitorSchema.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Visitor deleted successfully",
            data:deletedVisitor
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting visitor",
            err:error.message
        })
        
    }
}

const getVisitorById=async(req,res)=>{
    try {
        const id = req.params.id;
        const visitor = await visitorSchema.findById(id)
        if(visitor){
            return res.status(200).json({
                message:"visitor with given id fetched successfully",
                data:visitor
            })
        } else {
            return res.status(404).json({
                message:"Visitor not found"
            })
        }
    } catch (error) {
          return res.status(500).json({
            message:"Error while fetching visitor",
            err:error.message
        })
    }
}

const getVisitorsByResident=async(req,res)=>{
 try {
     const residentId=req.params.id;
    const visitor=await visitorSchema.find({residentId}).populate({
        path:'residentId',
        populate:{
            path:'userId',
            select:'firstName lastName email'
        }
    })
    if(visitor){
        return res.status(200).json({
            message:"Visitor with given resident",
            data:visitor
        })
    }
 } catch (error) {
       return res.status(500).json({
            message:"Error while getting visitor",
            err:error.message
        })
 }
}

const updateVisitorApprovalStatus = async(req,res)=>{
    try {
        if(req.user.role !== 'Resident'){
            return res.status(403).json({
                message:"Only resident can approve or reject"
            })
        }
        const id =req.params.id;
        const { approvalStatus } = req.body;
        if(!["Approved","Denied"].includes(approvalStatus)){
            return res.status(400).json({
                message:"Invalid status"
            })
        }
        const status=await visitorSchema.findByIdAndUpdate(id,{approvalStatus},{new:true})
        if(status){
            return res.status(200).json({
                message:"Visitor approval status updated successfully",
                data:status
            })
        }
    } catch (error) {
          return res.status(500).json({
            message:"Error while getting visitor status",
            err:error.message
        })
    }
}

const markVisitorExit=async(req,res)=>{
    try {
        if(req.user.role !== 'Security'){
            return res.status(403).json({
                message:"Only security can mark exit"
            })
        }
        const id = req.params.id;
        const exitTime = Date.now()
        const visitor = await visitorSchema.findByIdAndUpdate(id,{exitTime},{new:true})
        if(visitor){
            return res.status(200).json({
                message:"Successfully marked the visitor exit time",
                data:visitor
            })
        }
    } catch (error) {
           return res.status(500).json({
            message:"Error while marking the visitor exit time",
            err:error.message
        })
    }
}

const filterVisitor= async(req,res)=>{
 try {
    const {approvalStatus,visitType} = req.query;
    const filter={}

    if(approvalStatus) filter.approvalStatus = approvalStatus;
    if(visitType) filter.visitType = visitType

    const visitors = await visitorSchema.find(filter).populate({
        path:'residentId',
        populate:{
            path:'userId',
            select:'firstName lastName email'
        }
    })
     return res.status(200).json({
    message: visitors.length > 0 
        ? "Visitors fetched successfully"
        : "No visitors found",
    data: visitors
})
    
 } catch (error) {
       return res.status(500).json({
            message:"Error while filtering visitors",
            err:error.message
        })
 }
}

module.exports = {
    getAllVisitors,
    createVisitor,
    updateVisitor,
    deleteVisitor,
    getVisitorById,
    getVisitorsByResident,
    updateVisitorApprovalStatus,
    markVisitorExit,
    filterVisitor
}