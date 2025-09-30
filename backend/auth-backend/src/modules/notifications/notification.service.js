const NotificationService = {
  send: (io, message) => {
    io.emit("notification", message);
  },

  scheduleWaterReminders: (io) => {
    setInterval(() => {
      io.emit("notification", "💧 Time to drink water!");
      console.log("💧 Reminder sent to all clients");
    }, 10000); // çdo 10 sekonda për testim
  },

  sendDailySummary: (io, calories) => {
    io.emit("notification", `🔥 Today you consumed ${calories} calories`);
    console.log(`🔥 Daily summary sent: ${calories} calories`);
  },
};

export default NotificationService;
