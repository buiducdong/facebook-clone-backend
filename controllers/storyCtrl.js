const Story = require('../models/Story');
const User = require('../models/User');

const storyCtrl = {
  createStory: async (req, res) => {
    const story = new Story(req.body);
    try {
      const saveStory = await story.save();
      res.status(200).json(saveStory);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllStory: async (req, res) => {
    try {
      const stories = await Story.find().populate({
        path: 'User',
        strictPopulate: false,
      });
      res.status(200).json(stories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = storyCtrl;
