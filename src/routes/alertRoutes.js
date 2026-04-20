const express=require('express')
const validateToken = require('../middleware/authMiddleware')
const router=express.Router()

const alertController = require('../controllers/alertController')
router.get('/', validateToken,alertController.getAllAlerts)

router.post('/', validateToken,alertController.createAlert)

router.put('/resolve/:id',validateToken,alertController.resolveAlert)
router.put('/:id',validateToken, alertController.updateAlert)

router.delete('/:id',validateToken,alertController.deleteAlert)

module.exports = router