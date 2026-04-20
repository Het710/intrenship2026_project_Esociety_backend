const facilitySchema = require('../models/facilityModel')

const getAllFacilities = async (req,res)=>{
    try {

        const facilities = await facilitySchema.find()

        return res.status(200).json({
            message:"Facilities fetched successfully",
            data:facilities
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while fetching facilities",
            err:error.message
        })
        
    }
}

const createFacility = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                message:"Only admin can create facility"
            })
        }

        const {name,basePrice} = req.body
        if(!name){
            return res.status(400).json({
                message:'Facility name is required'
            })
        }
        const savedFacility = await facilitySchema.create(req.body)

        return res.status(201).json({
            message:"Facility created successfully",
            data:savedFacility
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while creating facility",
            err:error.message
        })
        
    }
}

const updateFacility = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                message:"Only admin can update facility"
            })
        }
        const id = req.params.id

        const updatedFacility = await facilitySchema.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        return res.status(200).json({
            message:"Facility updated successfully",
            data:updatedFacility
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while updating facility",
            err:error.message
        })
        
    }
}

const deleteFacility = async (req,res)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                message:"Only Admin can delete facility"
            })
        }
        const id = req.params.id

        const deletedFacility = await facilitySchema.findByIdAndDelete(id)

        return res.status(200).json({
            message:"Facility deleted successfully",
            data:deletedFacility
        })

    } catch (error) {

        return res.status(500).json({
            message:"Error while deleting facility",
            err:error.message
        })
        
    }
}

module.exports = {
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility
}