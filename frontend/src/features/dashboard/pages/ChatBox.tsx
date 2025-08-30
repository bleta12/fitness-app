import { chatState } from "./Social";
import io from "socket.io-client";

const socket = io("http://localhost:4000");
const userId = "user123";

export default function ChatBox() {
  const { chat, setChat, message, setMessage, typing, activeContact } = chatState;

  if (!activeContact) return null;

  const sendMessage = () => {
    if (!message.trim()) return;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes} ${ampm}`;

    const newMsg = {
      senderId: userId,
      text: message,
      time,
      senderType: "user" as const,
    };

    socket.emit("send_message", { ...newMsg, receiverId: activeContact.id });
    setChat([...chat, newMsg]);
    setMessage("");
  };

  const handleTyping = () => {
    if (!activeContact) return;
    socket.emit("typing", { receiverId: activeContact.id });
  };

  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs md:max-w-md p-2 rounded-lg ${msg.senderType === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              <p>{msg.text}</p>
              <p className="text-xs mt-1 text-right opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}
        {typing && <div className="text-gray-500 text-sm">{activeContact.name} is typing...</div>}
      </div>

      <div className="p-3 border-t flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            handleTyping();
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="w-20 h-15 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2 hover:bg-blue-600">Send
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </>
  );
}

