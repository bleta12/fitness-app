import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ChatBox from "./ChatBox";
import ChatHeader from "./ChatHeader";
import Navbar from "@/components/Navbar";
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000");
export const chatState: any = {};

function Social() {
  const [userId] = useState(() => {
    // Try to get userId from cookie first
    const existing = Cookies.get("userId");
    if (existing) return existing;

    const newId = crypto.randomUUID?.() || `user_${Date.now()}`;
    Cookies.set("userId", newId, { expires: 7 }); // cookie expires in 7 days
    return newId;
  });

  const contacts = [
    { id: "1", name: "Alex Turner", status: "Online", avatarColor: "bg-yellow-200" },
    { id: "2", name: "Jessica Lee", status: "Online", avatarColor: "bg-pink-200" },
    { id: "3", name: "Trainer Chen", status: "Offline", avatarColor: "bg-green-200" },
    { id: "4", name: "Coach Martinez", status: "Online", avatarColor: "bg-purple-200" },
  ];

  const [activeContact, setActiveContact] = useState<any>(null);
  const [chatMap, setChatMap] = useState<Record<string, any[]>>({});
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  Object.assign(chatState, {
    activeContact,
    setActiveContact,
    chatMap,
    setChatMap,
    message,
    setMessage,
    typing,
    setTyping,
    userId,
  });

  // Connect to socket with persistent userId
  useEffect(() => {
    socket.emit("register", userId);

    socket.on("receive_message", (msg) => {
      setChatMap((prev) => {
        const chat = prev[msg.senderId] || [];
        return { ...prev, [msg.senderId]: [...chat, msg] };
      });
    });

    socket.on("typing", (senderId: string) => {
      if (activeContact && senderId === activeContact.id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [userId, activeContact]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex bg-gray-100 p-8">
        <Navbar />
        {/* Contacts Sidebar */}
        <div className="w-1/4 bg-white rounded-lg shadow flex flex-col mr-5">
          <div className="flex border-b">
            <button className="flex-1 py-3 px-4 text-center font-semibold border-b-2 border-blue-500">
              Friends
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                  activeContact?.id === contact.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setActiveContact(contact)}
              >
                <div className={`w-10 h-10 rounded-full ${contact.avatarColor} mr-3`}></div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a friend to start chatting</p>
            </div>
          ) : (
            <>
              <ChatHeader />
              <ChatBox />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;
