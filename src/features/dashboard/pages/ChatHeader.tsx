import { chatState } from "./Social";

export default function ChatHeader() {
  const { activeContact } = chatState;

  if (!activeContact) return null;

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${activeContact.avatarColor} mr-3`}></div>
        <div>
          <p className="font-medium">{activeContact.name}</p>
          <p className="text-xs text-gray-500">{activeContact.status}</p>
        </div>
      </div>
    </div>
  );
}
