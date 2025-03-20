const { prisma } = require('@/config/dbConnect');



// Global mapping of userId to socket.id
const userSocketMap = {};

const getChatting = async (req, res) => {
  const { from, to } = req.body;

  try {
    // Find a chat between 'from' and 'to'
    const chatting = await prisma.chatting.findFirst({
      where: {
        from: parseInt(from), // Convert to Int
        to: parseInt(to),     // Convert to Int
      },
      include: {
        messages: true, // Include messages to match Mongoose behavior
      },
    });

    res.status(200).json(chatting || null); // Return null if no chat found, matching Mongoose
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat', message: error.message });
  }
};

const chatList = async (req, res) => {
  const { from } = req.body;

  try {
    // Find all chats where 'from' is the sender
    const chatting = await prisma.chatting.findMany({
      where: {
        from: parseInt(from), // Convert to Int
      },
      include: {
        messages: true, // Include messages to match Mongoose behavior
      },
    });

    res.status(200).json(chatting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat list', message: error.message });
  }
};



module.exports = { getChatting, chatList };