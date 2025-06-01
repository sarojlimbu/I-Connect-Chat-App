"use client";

import { useAuthStore } from "@/store/authStore";
import { useChat } from "@/hooks/useChat";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "../ui/button";

export default function ChatWindow() {
  const currentUser = useAuthStore((s) => s.user);
  const selectedUser = useAuthStore((s) => s.selectedUser);
  const setShowChat = useAuthStore((s) => s.setShowChat);
  const isMobile = useIsMobile();

  if (!currentUser || !selectedUser?.email) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  const meName = (currentUser.displayName || currentUser.email!.split("@")[0])!;
  const meAvatar = meName.charAt(0).toUpperCase();
  const otherName = (selectedUser.displayName ||
    selectedUser.email.split("@")[0])!;
  const otherAvatar = otherName.charAt(0).toUpperCase();

  const { messages, newMessage, setNewMessage, sendMessage, containerRef } =
    useChat(currentUser.email!, selectedUser.email);

  return (
    <div className="flex flex-col h-full bg-white w-full">
      <div className="flex items-center px-4 py-3 border-b border-gray-200 ">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
            {otherAvatar}
          </div>
          <div className="flex flex-col">
            <span className="font-medium w-fit text-gray-800">{otherName}</span>
            <span
              className={`text-sm ${
                selectedUser.status === "online"
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {selectedUser.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        {isMobile && (
          <div className="flex justify-end w-full ">
            <Button
              onClick={() => {
                if (isMobile) setShowChat(false);
              }}
              variant="secondary"
              className="rounded-xl"
            >
              Back
            </Button>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-100"
      >
        {messages.map((msg) => {
          const isMe = msg?.sender === currentUser.email;
          const avatarLetter = isMe ? meAvatar : otherAvatar;
          const alignment = isMe ? "justify-end" : "justify-start";
          const bubbleBg = isMe
            ? "bg-white text-gray-800 rounded-bl-none"
            : "bg-blue-500 text-white rounded-br-none";

          return (
            <div key={msg.id} className={`flex ${alignment} items-start`}>
              {!isMe && (
                <div className="mr-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {avatarLetter}
                  </div>
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${bubbleBg} shadow-sm`}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={`flex items-center space-x-1 mt-1 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-[10px] text-gray-400">
                    {msg.timestamp
                      ? new Date(
                          msg.timestamp.seconds * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>

              {isMe && (
                <div className="ml-2">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold">
                    {avatarLetter}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex items-center px-4 py-3 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}
