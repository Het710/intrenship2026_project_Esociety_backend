const residentSchema=require('../models/residentModel')

const getAllResidents=async(req,res)=>{
    try {
        const resident=await residentSchema.find()
        if (resident) {
            return res.status(200).json({
                message:"Resident found successfully",
                data:resident
            })
        } 
    } catch (error) {
        return res.status(500).json({
            message:"Error while finding the resident",
            err:error.message
        })
    }
    
}

const createResident=async(req,res)=>{
   try {
     const savedResident=await residentSchema.create(req.body)
     if(savedResident){
        return res.status(201).json({
            message:"Resident created successfully",
            data:savedResident
        })
     }
   } catch (error) {
    return res.status(500).json({
        message:"Error while creating the resident",
        err:error.message
    })
   }
}

const updateResident=async(req,res)=>{
   try {
    const id=req.params.id
    const updateResident = await residentSchema.findByIdAndUpdate(id,req.body,{new:true})
    if(updateResident){
        return res.status(200).json({
            message:"user updated successfully",
            data:updateResident
        })
    }
   } catch (error) {
    return res.status(500).json({
        message:"error while updating the user",
        err:error.message
    })
   }
}

const deleteResident=async(req,res)=>{
    try {
        const id = req.params.id;
        const deleteResident= await residentSchema.findByIdAndDelete(id)
        if(deleteResident){
            return res.status(200).json({
                message:"User deleted successfully",
                data:deleteResident
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:"Error while deleting the user",
            err:error.message
        })
    }
}

module.exports={
    getAllResidents,
    createResident,
    updateResident,
    deleteResident
}