// modules/message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }, // store as formatted string like "12:30 PM"
  senderType: { type: String, enum: ["user", "friend"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
