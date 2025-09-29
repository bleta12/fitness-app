import { useEffect, useRef } from "react";
import { chatState, socket } from "./Social";

// Define Message type
export type Message = {
  _id?: string; // MongoDB id
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!activeContact) return null;

  const messages: Message[] = chatMap[activeContact.id] || [];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages & typing
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      if (!msg.senderId || !msg.receiverId) return;

      const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      // Ensure senderType is always correct
      const formattedMsg: Message = {
        ...msg,
        senderType: msg.senderId === userId ? "user" : "friend",
      };

      setChatMap((prev: Record<string, Message[]>) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), formattedMsg],
      }));
    };

    const handleTyping = (senderId: string) => {
      if (activeContact && senderId === activeContact.id) {
        setTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
      }
    };

    socket.on("receive_message", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("typing", handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [activeContact, userId, setChatMap, setTyping]);

  const sendMessage = () => {
    if (!message.trim() || !activeContact) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: Message = {
      senderId: userId,
      receiverId: activeContact.id,
      text: message,
      time,
      senderType: "user",
    };

    // Emit message to backend
    socket.emit("send_message", newMsg);

    // Update local chat immediately
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
        {messages.map((msg) => (
          <div
            key={msg._id || `${msg.senderId}-${msg.time}`}
            className={`flex w-full ${
              msg.senderType === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%] ${
                msg.senderType === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs mt-1 text-right opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-gray-500 text-sm">
            {activeContact.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
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
          className="w-20 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2 hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </>
  );
}
