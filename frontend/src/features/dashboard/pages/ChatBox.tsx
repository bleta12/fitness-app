import { useEffect } from "react";
import { chatState, socket } from "./Social";

// Define Message type
export type Message = {
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  senderType: "user" | "friend";
};

export default function ChatBox() {
  const {
    activeContact,
    chatMap,
    setChatMap,
    message,
    setMessage,
    typing,
    setTyping,
    userId,
  } = chatState;

  if (!activeContact) return null;

  const messages: Message[] = chatMap[activeContact.id] || [];

  // Listen for incoming messages & typing
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      if (!msg.senderId || !msg.receiverId) return;

      const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      setChatMap((prev: Record<string, Message[]>) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), msg],
      }));
    };

    const handleTyping = (senderId: string) => {
      if (activeContact && senderId === activeContact.id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    };

    socket.on("receive_message", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("typing", handleTyping);
    };
  }, [activeContact, userId, setChatMap, setTyping]);

  const sendMessage = () => {
    if (!message.trim() || !activeContact) return;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes} ${ampm}`;

    const newMsg: Message = {
      senderId: userId,
      receiverId: activeContact.id,
      text: message,
      time,
      senderType: "user",
    };

    socket.emit("send_message", newMsg);

    setChatMap((prev: Record<string, Message[]>) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setMessage("");
  };

  const handleTyping = () => {
    if (!activeContact) return;
    socket.emit("typing", { receiverId: activeContact.id });
  };

  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
        {messages.map((msg: Message, i: number) => (
          <div
            key={i}
            className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-2 rounded-lg ${
                msg.senderType === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs mt-1 text-right opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-gray-500 text-sm">{activeContact.name} is typing...</div>
        )}
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
        <button
          onClick={sendMessage}
          className="w-20 h-15 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2 hover:bg-blue-600"
        >
          Send
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </>
  );
}
