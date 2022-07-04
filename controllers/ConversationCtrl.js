const Conversation = require('../models/Conversation');
const User = require('../models/User');

const ConversationCtl = {
  create: async (req, res) => {
    const senderId = req.user.id;
    const receiveId = req.body.receiveId;
    try {
      const receiverInfo = await User.findById(receiveId);
      const { username, avatar, _id } = receiverInfo;
      const conversation = await new Conversation({
        members: [senderId, receiveId],
      });
      const saveConversation = await conversation.save();
      return res.status(200).json(saveConversation);
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  getConversation: async (req, res) => {
    try {
      const conversation = await Conversation.find({ members: { $in: [req.user.id] } });
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  },

  getSingleConversation: async (req, res) => {
    try {
      const singleConversation = await Conversation.findById(req.param.id);
      return res.status(200).json(singleConversation);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  },
};

module.exports = ConversationCtl;
