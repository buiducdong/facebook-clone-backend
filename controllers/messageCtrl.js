const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const messageCtrl = {
  getMessage: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      const receiverId = conversation.members.find((m, i) => m !== req.user.id);
      const receiverInfo = await User.findById(receiverId);
      const messages = await Message.find({ conversationId: req.params.id });
      const data = { messages: messages, receiverInfo: receiverInfo };
      return res.status(200).json(data);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  },
  createMessage: async (req, res) => {
    const newMessage = new Message(req.body);
    try {
      const saveMessage = await newMessage.save();
      return res.status(200).json(saveMessage);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  },
};

module.exports = messageCtrl;
