const express = require('express');
const { createServer } = require('http')
const { Server } = require('socket.io');
const app = express();
const httpServer = createServer(app);
const {socketWork} = require('@/config/socket');
const cors = require('cors');




app.use(express.json());
app.use(cors())
const io = new Server(httpServer, {
  cors: {
    origin: ["https://pothoczuto.xyz","http://localhost:3000"], // Your Next.js app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    transports: ['websocket', 'polling'] // Add explicit transports
  },
  allowEIO3: true // Enable compatibility with Socket.IO v3 clients
});


const {getLocalIpAddress} = require('@/utils/ipAddress');
const ipAddress = getLocalIpAddress();
socketWork(io);
const StartServer =  () => {
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => console.log(`Server running on port ${ipAddress}:${PORT}`));
}


module.exports = {StartServer, io , app, httpServer}