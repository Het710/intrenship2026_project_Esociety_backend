const complaintSchema = require('../models/complaintModel')
const uploadToCloudinary = require('../utils/cloudinaryUtil')
const fs = require('fs')

const getAllComplaints = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
        return res.status(403).json({
            message: "Only Admin can view all complaints"
            })
        }
        const complaints = await complaintSchema.find().populate('raisedBy','name email')

        return res.status(200).json({
            message:"Complaints fetched successfully",
            data:complaints
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching complaints",
            err:error.message
        })
        
    }
}

const createComplaint = async (req,res)=>{
    try {

        const savedComplaint = await complaintSchema.create(req.body)

        return res.status(201).json({
            message:"Complaint created successfully",
            data:savedComplaint
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while creating complaint",
            err:error.message
        })
        
    }
}

const updateComplaint = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                message:"Only admin can update complaint status"
            })
        }
        const id = req.params.id

        const updatedComplaint = await complaintSchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        return res.status(200).json({
            message:"Complaint updated successfully",
            data:updatedComplaint
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating complaint",
            err:error.message
        })
        
    }
}

const deleteComplaint = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                message: "Only Admin can delete complaints"
            })
        }

        const id = req.params.id

        const deletedComplaint = await complaintSchema.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Complaint deleted successfully",
            data:deletedComplaint
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting complaint",
            err:error.message
        })
        
    }
}

const getComplaintById = async (req,res)=>{
    try {
        const id = req.params.id;
        const complaint = await complaintSchema.findById(id)
        if(complaint){
            return res.status(200).json({
                message:"Complaint with given id fetched successfully",
                data:complaint
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:"Error while fetching the complaint",
            err:error.message
        })
    }
}

const getComplaintsByResident = async(req,res)=>{
    try {
        if(req.user.role !== 'Resident'){
            return res.status(403).json({
                message:"Only Residents can view their complaints"
            })
        }
        const residentId = req.params.id;
        const getComplainByResident= await complaintSchema.find({raisedBy:residentId}).populate('raisedBy','name email')
        if(getComplainByResident){
            return res.status(200).json({
                message:"Complain done by particular resident",
                data:getComplainByResident
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:"Error while fetching the complaint",
            err:error.message
        })
    }


}

const updateComplaintStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const validStatus = ["Open", "In-Progress", "Resolved"];


        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const complaint = await complaintSchema.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (complaint.status === "Resolved") {
            return res.status(400).json({
                message: "Complaint already resolved"
            });
        }

        complaint.status = status;

        if (status === "Resolved") {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();

        return res.status(200).json({
            message: "Complaint status updated successfully",
            data: complaint
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while updating complaint status",
            err: error.message
        });
    }
};

const uploadComplainImage=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                message:"Image file is required"
            })
        }

        const filePath = req.file.path;
        const uploadResult = await uploadToCloudinary(filePath)
           if (!uploadResult || !uploadResult.secure_url) {
            return res.status(500).json({
                message: "Failed to upload image to Cloudinary"
            });
        }

        const complaint = await complaintSchema.create({
            ...req.body,
            raisedBy:req.user.id,
            complainImage:uploadResult.secure_url
        })

           fs.unlinkSync(filePath);

        return res.status(201).json({
            message: "Complaint created successfully with image",
            data: complaint
        });
    } catch (error) {
           if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
         return res.status(500).json({
            message: "Error while creating complaint with image",
            error: error.message
        });
    }
}
module.exports = {
    getAllComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintById,
    getComplaintsByResident,
    updateComplaintStatus,
    uploadComplainImage

}