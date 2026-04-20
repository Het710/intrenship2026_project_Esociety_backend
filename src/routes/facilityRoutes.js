const express=require('express')
const router=express.Router()

const facilityController = require('../controllers/facilityController')
const validateToken=require('../middleware/authMiddleware')
router.get('/',validateToken, facilityController.getAllFacilities)
router.post('/',validateToken, facilityController.createFacility)
router.put('/:id',validateToken, facilityController.updateFacility)
router.delete('/:id',validateToken, facilityController.deleteFacility)

module.exports = router