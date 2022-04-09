const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    postId: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comments', CommentSchema);
