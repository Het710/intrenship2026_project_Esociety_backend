const noticeSchema = require('../models/noticeModel')

const getAllNotices = async (req,res)=>{
    try {
    const notices = await noticeSchema.find({
    $or: [
        { expiryDate: { $gte: new Date() } },
        { expiryDate: null }
    ]
   }).sort({ createdAt: -1 }).populate('postedBy','firstName lastName')

        return res.status(200).json({
            message:"Notices fetched successfully",
            data:notices
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching notices",
            err:error.message
        })
        
    }
}

const createNotice = async (req,res)=>{
    try {
       if(req.user.role !== "Admin"){
        return res.status(403).json({
        message: "Only admin can add notice" 
        })
       }

       const {title,description,expiryDate} = req.body
        const savedNotice = await noticeSchema.create({
            title,
            description,
            expiryDate,
            postedBy:req.user.id
        })

        return res.status(201).json({
            message:"Notice created successfully",
            data:savedNotice
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while creating notice",
            err:error.message
        })
        
    }
}

const updateNotice = async (req,res)=>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(403).json({
                message:"Only admin can update notice"
            })
        }
        const id = req.params.id

        const updatedNotice = await noticeSchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )
        if (!updatedNotice) {
    return res.status(404).json({
        message: "Notice not found"
    });
}
        return res.status(200).json({
            message:"Notice updated successfully",
            data:updatedNotice
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating notice",
            err:error.message
        })
        
    }
}

const deleteNotice = async (req,res)=>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(403).json({
                message:"Only admin can delete notice"
            })
        }

        const id = req.params.id

        const deletedNotice = await noticeSchema.findByIdAndDelete(id)

        if (!deletedNotice) {
    return res.status(404).json({
        message: "Unable to delete the notice"
    });
}

        return res.status(200).json({
            message:"Notice deleted successfully",
            data:deletedNotice
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting notice",
            err:error.message
        })
        
    }
}

const getNoticeById=async(req,res)=>{
    try {
        const id = req.params.id;
        const notice = await noticeSchema.findById(id)
        if(!notice){
          return res.status(404).json({
        message: "Notice not found"
    });
        }
          return res.status(200).json({
                message:"notice fetched successfully",
                data:notice
            })
    } catch (error) {
          return res.status(500).json({
            message:"Error while fetching notice",
            err:error.message
        })
    }
}

const getNoticesByUser = async(req,res)=>{
   try {
        const userId = req.params.id;
        const notices = await noticeSchema
            .find({ postedBy: userId })
            .populate('postedBy', 'name email');
        return res.status(200).json({
            message: notices.length > 0
                ? "Notices fetched successfully"
                : "No notices found for this user",
            data: notices
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while fetching notices by user",
            err: error.message
        });
    }
}

module.exports = {
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    getNoticeById,
    getNoticesByUser
}