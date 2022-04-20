const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    desc: {
      type: String,
    },
    like: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stories', StorySchema);
