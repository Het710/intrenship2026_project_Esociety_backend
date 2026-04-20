const express = require('express')
const validateToken = require('../middleware/authMiddleware')
const upload = require('../utils/multerUtil')
const router=express.Router()

const visitorController = require('../controllers/visitorController')

router.get('/resident/:id', validateToken,visitorController.getVisitorsByResident);
router.get('/filter', validateToken,visitorController.filterVisitor);
router.get('/', validateToken,visitorController.getAllVisitors)
router.get('/:id', validateToken,visitorController.getVisitorById)

router.post('/', validateToken,upload.single('visitorPhoto'),visitorController.createVisitor)

router.put('/status/:id', validateToken,visitorController.updateVisitorApprovalStatus); 
router.put('/exit/:id', validateToken,visitorController.markVisitorExit);
router.put('/:id', validateToken,visitorController.updateVisitor)

router.delete('/:id', validateToken,visitorController.deleteVisitor)

module.exports = router