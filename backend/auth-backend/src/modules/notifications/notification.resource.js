import express from "express";
import http from "http";
import { Server } from "socket.io";

const router = express.Router();

// ✅ përdor global që të mos niset dy herë me ts-node-dev
if (!global.notificationServerStarted) {
  global.notificationServerStarted = true;

  const server = http.createServer();
  server.setMaxListeners(0); // 🚀 hiq limitin e listeners → pa warning

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected to notifications:", socket.id);
    socket.emit("notification", "🔔 Hello from backend!");
  });

  // 💧 Reminder çdo 15 sekonda (testim → mund ta bësh 2 orë më vonë)
  setInterval(() => {
    io.emit("notification", "💧 Time to drink water!");
    console.log("💧 Reminder sent to all clients");
  }, 15000);

  // 🔥 Daily summary (njëherë pas 5 sekondash kur niset serveri)
  setTimeout(() => {
    io.emit("notification", "🔥 Today you consumed 1800 calories");
    console.log("🔥 Daily summary sent");
  }, 5000);

  // Nis serverin në 5001 me fallback në 5002
  const DEFAULT_PORT = 5001;
  server.listen(DEFAULT_PORT, () => {
    console.log(`🔔 Notification server running on port ${DEFAULT_PORT}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const fallbackPort = DEFAULT_PORT + 1;
      server.listen(fallbackPort, () => {
        console.log(`⚡ Port ${DEFAULT_PORT} ishte i zënë, tani u kalua në ${fallbackPort}`);
      });
    } else {
      console.error("❌ Notification server error:", err);
    }
  });
}

// Test route
router.get("/ping", (req, res) => {
  res.json({ message: "Notifications module is working ✅" });
});

export default router;
