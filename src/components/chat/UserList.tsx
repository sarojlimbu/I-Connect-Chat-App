"use client";

import { useAuthStore } from "@/store/authStore";
import { useUserList } from "@/hooks/useUserList";
import ChatWindow from "./ChatWindow";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function UserList() {
  const setSelectedUser = useAuthStore((s) => s.setSelectedUser);
  const selectedUser = useAuthStore((s) => s.selectedUser);
  const setShowChat = useAuthStore((s) => s.setShowChat);
  const showChat = useAuthStore((s) => s.showChat);
  const isMobile = useIsMobile();

  const users = useUserList();

  if (typeof window !== "undefined" && isMobile === undefined) {
    return null;
  }

  return (
    <div className="flex h-screen w-full">
      <div
        className={`${
          isMobile ? "w-full" : "w-80"
        } border-r border-gray-300 overflow-y-auto ${
          isMobile && showChat ? "hidden" : "block"
        }`}
      >
        <h1 className="text-3xl font-bold px-4 py-4">Messages</h1>
        <Separator />
        {users.map((u) => (
          <div
            key={u.uid}
            onClick={() => {
              setSelectedUser(u);
              if (isMobile) setShowChat(true);
            }}
            className={`flex items-center p-3 gap-3 cursor-pointer hover:bg-gray-100 ${
              u.email === selectedUser?.email ? "bg-blue-50" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                {u.email[0]?.toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  u.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {u.displayName}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {u.lastMessage?.content?.slice(0, 40)?.concat("...") ||
                  "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex-1 ${isMobile && !showChat ? "hidden" : "block"}`}>
        {selectedUser ? (
          <ChatWindow />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Select a user to chat
          </div>
        )}
      </div>
    </div>
  );
}
