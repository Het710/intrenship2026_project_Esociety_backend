const express=require('express')
const validateToken = require('../middleware/authMiddleware')
const router=express.Router()

const noticeController = require('../controllers/noticeController')

router.get('/user/:id', validateToken,noticeController.getNoticesByUser);
router.get('/:id', validateToken,noticeController.getNoticeById);
router.get('/', validateToken,noticeController.getAllNotices)

router.post('/', validateToken,noticeController.createNotice)

router.put('/:id', validateToken,noticeController.updateNotice)

router.delete('/:id', validateToken,noticeController.deleteNotice)

module.exports = router