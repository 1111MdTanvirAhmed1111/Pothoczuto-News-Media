// chatController.js (Prisma version)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const socketWork = (io) => {
  io.on('connection', (socket) => {
    const users = {};

    console.log('Socket connected:', socket.id);

    socket.on("join", (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} joined with socket ID: ${socket.id}`);
    });

    // Listen for sendMessage event
    socket.on('sendMessege', async (data) => {
      const { from, to, content } = data;

      try {
        // Find existing chat between 'from' and 'to' (in either direction)
        let chatting = await prisma.chatting.findFirst({
          where: {
            OR: [
              { from, to },
              { from: to, to: from },
            ],
          },
          include: { messages: true }, // Include messages if needed
        });

        if (!chatting) {
          // Create a new chat if none exists
          chatting = await prisma.chatting.create({
            data: {
              from,
              to,
              messages: {
                create: {
                  messager: from.toString(), // Convert to string if needed
                  content,
                },
              },
            },
          });
        } else {
          // Add a new message to the existing chat
          await prisma.message.create({
            data: {
              messager: from.toString(), // Convert to string if needed
              content,
              chattingId: chatting.id,
            },
          });
        }

        // Emit the message to both users if they are connected
        if (users[from]) {
          io.to(users[from]).emit('receivedMessege', { from, content });
        }
        if (users[to]) {
          io.to(users[to]).emit('receivedMessege', { from, content });
        }

      } catch (error) {
        console.error('Error in sendMessage:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      // Optionally clean up users object
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};

module.exports = { socketWork };