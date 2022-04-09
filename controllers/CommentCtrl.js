const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const CommentCtrl = {
  create: async (req, res) => {
    const newComment = new Comment(req.body);
    try {
      const comment = await newComment.save();
      return res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getComments: async (req, res) => {
    try {
      const comments = await Comment.find({ postId: req.params.postId });
      return res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = CommentCtrl;
