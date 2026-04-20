const express = require('express')
const router = express.Router()

const discussionController = require('../controllers/discussionController')
const validateToken = require('../middleware/authMiddleware')

router.get('/', validateToken, discussionController.getDiscussions)

router.post('/create', validateToken, discussionController.createDiscussion)
router.post('/vote', validateToken, discussionController.voteInPoll)
router.post('/comment/:id', validateToken, discussionController.addComment)

module.exports = router;