const Chatting = require('@/models/Chatting');

// Global mapping of userId to socket.id
const userSocketMap = {};


const getChatting = async (req, res) => {
  const { from, to } = req.body;
  const chatting = await Chatting.findOne({ from, to });
  res.status(200).json(chatting);
};

const chatList = async (req, res) => {
  const { from } = req.body;
  const chatting = await Chatting.find({ from });
  res.status(200).json(chatting);
};

const users = {};


module.exports = { getChatting, chatList };
