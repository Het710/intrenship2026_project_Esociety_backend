const discussionSchema = require('../models/discussionModel')

const createDiscussion = async (req, res) => {
  try {
    const { title, content, type, options } = req.body
    const user = req.user

    if(req.user.role !== 'Admin'){
        return res.status(403).json({
        message: "Forbidden: Only Admin can create discussions or polls"
      })
    }

    const pollOptions = options ? options.map(opt => ({ text: opt, votes: [] })) : []

    const discussion = await discussionSchema.create({
      title,
      content,
      type,
      pollOptions,
      author: user.id
    })

    return res.status(201).json({
      message: "Discussion created successfully",
      data: discussion
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error creating discussion",
      err: error.message
    })
  }
}

const getDiscussions = async (req, res) => {
  try {
    const discussions = await discussionSchema.find()
      .populate('author', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      message: "Discussions fetched",
      data: discussions
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching discussions",
      err: error.message
    })
  }
}

const voteInPoll = async (req, res) => {
  try {
    const { discussionId, optionId } = req.body
    const user = req.user

    const discussion = await discussionSchema.findById(discussionId)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    discussion.pollOptions.forEach(opt => {
      opt.votes = opt.votes.filter(v => v.toString() !== user.id.toString())
    })

    const option = discussion.pollOptions.id(optionId)
    if (!option) {
      return res.status(404).json({ message: "Option not found" })
    }

    option.votes.push(user.id)
    await discussion.save()

    return res.status(200).json({
      message: "Vote recorded",
      data: discussion
    })
  } catch (error) {
    return res.status(500).json({
      message: "Voting failed",
      err: error.message
    })
  }
}

const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body
    const user = req.user

    const discussion = await discussionSchema.findById(id)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    discussion.comments.push({
      user: user.id,
      text
    })

    await discussion.save()

    return res.status(201).json({
      message: "Comment added",
      data: discussion
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error adding comment",
      err: error.message
    })
  }
}

module.exports = {
  createDiscussion,
  getDiscussions,
  voteInPoll,
  addComment
}