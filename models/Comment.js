const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    postId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.export = mongoose.model('Comments', CommentSchema);
