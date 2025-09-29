// social.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import User from "./modules/ai/user.js";
import Message from "./modules/message.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 4000;

// --------------------
// MongoDB Connection
// --------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatDB";

console.log("Connecting to MongoDB at:", MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();
const onlineUsers = {};

// --------------------
// Socket.IO logic
// --------------------
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Register user
  socket.on("register", async (userId) => {
    if (!onlineUsers[userId]) onlineUsers[userId] = [];
    if (!onlineUsers[userId].includes(socket.id)) {
      onlineUsers[userId].push(socket.id);
    }

    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, online: true });
    } else {
      user.online = true;
      await user.save();
    }

    console.log("Registered user:", userId, onlineUsers[userId]);
  });

  // Send message
  socket.on("send_message", async (msg) => {
    try {
      const newMsg = await Message.create(msg);
      // Send to first receiver socket only
      const receiverSockets = onlineUsers[msg.receiverId] || [];
      if (receiverSockets.length > 0) {
        io.to(receiverSockets[0]).emit("receive_message", newMsg);
        senderSockets.forEach((id) =>
          io.to(id).emit("receive_message", newMsg)
        );
      }

      // Send to sender's other sockets (excluding current one)
      const senderSockets = (onlineUsers[msg.senderId] || []).filter(
        (id) => id !== socket.id
      );
      senderSockets.forEach((id) => io.to(id).emit("receive_message", newMsg));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  // Typing indicator
  socket.on("typing", ({ receiverId }) => {
    const receiverSockets = onlineUsers[receiverId] || [];
    receiverSockets.forEach((id) => io.to(id).emit("typing", socket.id));
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    Object.keys(onlineUsers).forEach(async (userId) => {
      onlineUsers[userId] = onlineUsers[userId].filter(
        (id) => id !== socket.id
      );
      if (onlineUsers[userId].length === 0) {
        delete onlineUsers[userId];
        await User.findOneAndUpdate({ userId }, { online: false });
      }
    });
    console.log("Socket disconnected:", socket.id);
  });
});

// --------------------
// Start server
// --------------------
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Optional test route
app.get("/", (req, res) => {
  res.send("Social chat server is running!");
});
