const mongoose = require('mongoose')
const Schema = mongoose.Schema

const discussionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  type: {
    type: String,
    enum: ["discussion", "poll"],
    default: "discussion",
    required: true
  },
  pollOptions: [{
    text: String,
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

module.exports = mongoose.model('discussion', discussionSchema)