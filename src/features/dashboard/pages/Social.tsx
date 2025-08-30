import { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader.tsx";
import ChatBox from "./ChatBox.tsx";
import Navbar from "../../../components/Navbar.tsx";

const socket = io("http://localhost:4000");

type Message = {
  senderId: string;
  text: string;
  time: string;
  senderType: "user" | "friend";
};

type Contact = {
  id: string;
  name: string;
  status: string;
  avatarColor: string;
};

const contacts: Record<string, Contact> = {
  "1": { id: "1", name: "Alex Turner", status: "Online", avatarColor: "bg-yellow-200" },
  "2": { id: "3", name: "Trainer Chen", status: "Offline", avatarColor: "bg-green-200" },
  "3": { id: "2", name: "Jessica Lee", status: "Online", avatarColor: "bg-pink-200" },
  "4": { id: "4", name: "Coach Martinez", status: "Online", avatarColor: "bg-purple-200" },
};

export const chatState: {
  activeContact: Contact | null;
  setActiveContact: (c: Contact | null) => void;
  chat: Message[];
  setChat: (m: Message[]) => void;
  message: string;
  setMessage: (m: string) => void;
  typing: boolean;
  setTyping: (b: boolean) => void;
} = {} as any;

function Social() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  // Expose state globally to child components
  Object.assign(chatState, { activeContact, setActiveContact, chat, setChat, message, setMessage, typing, setTyping });

  const userId = "user123";

  useEffect(() => {
    socket.emit("register", userId);

    socket.on("receive_message", (msg: Message) => {
      if (activeContact && msg.senderId === activeContact.id) setChat([...chat, msg]);
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
  }, [activeContact, chat]);

  return (
    <div className="flex h-screen">
      {/* Sidebar + Chat */}
      <div className="flex-1 flex bg-gray-100 p-6">
        {/* Contacts Sidebar */}
      <Navbar />
        <div className="w-1/3 bg-white rounded-lg shadow flex flex-col mr-6">
          <div className="flex border-b">
            <button className="flex-1 py-3 px-4 text-center font-semibold border-b-2 border-blue-500">Friends</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.values(contacts).map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                  activeContact?.id === contact.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setActiveContact(contact);
                  setChat([]);
                }}
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
