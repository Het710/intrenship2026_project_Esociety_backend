const express = require('express')
const upload = require('../utils/multerUtil')
const router = express.Router()
const validateToken = require('../middleware/authMiddleware')

const complaintController = require('../controllers/complaintController')

router.get('/resident/:id', validateToken, complaintController.getComplaintsByResident)
router.get('/:id', validateToken, complaintController.getComplaintById)
router.get('/', validateToken, complaintController.getAllComplaints)

router.post('/upload', validateToken, upload.single('image'), complaintController.uploadComplainImage)
router.post('/', validateToken, complaintController.createComplaint)

router.put('/status/:id', validateToken, complaintController.updateComplaintStatus)
router.put('/:id', validateToken, complaintController.updateComplaint)

router.delete('/:id', validateToken, complaintController.deleteComplaint)

module.exports = router