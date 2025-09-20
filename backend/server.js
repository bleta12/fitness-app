// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store all sockets per userId
const connectedUsers = {}; // { userId: [socketId, ...] }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (userId) => {
    if (!connectedUsers[userId]) connectedUsers[userId] = [];
    connectedUsers[userId].push(socket.id);
    console.log("Registered user:", userId, connectedUsers[userId]);
  });

  // Listen for messages
  socket.on("send_message", (msg) => {
    const receiverSockets = connectedUsers[msg.receiverId] || [];
    // Send message to all receiver sockets
    receiverSockets.forEach((sockId) => {
      io.to(sockId).emit("receive_message", msg);
    });
    // No need to send back to sender, frontend handles it locally
  });

  // Listen for typing
  socket.on("typing", ({ receiverId }) => {
    const receiverSockets = connectedUsers[receiverId] || [];
    receiverSockets.forEach((sockId) => {
      io.to(sockId).emit("typing", socket.id);
    });
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in connectedUsers) {
      connectedUsers[userId] = connectedUsers[userId].filter(
        (id) => id !== socket.id
      );
      if (connectedUsers[userId].length === 0) delete connectedUsers[userId];
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
