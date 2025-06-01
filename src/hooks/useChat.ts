import { useState, useEffect, useRef } from "react";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: any;
  seen: boolean;
}

export const useChat = (
  currentUserEmail: string,
  selectedUserEmail: string | null
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const chatId = [currentUserEmail, selectedUserEmail].sort().join("_");

  const scrollToBottomSmooth = (duration = 500) => {
    const container = containerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const distance = end - start;
    if (distance === 0) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      container.scrollTop = start + distance * eased;
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!currentUserEmail || !selectedUserEmail) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const all: Message[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Message, "id">),
      }));
      setMessages(all);
    });

    return () => unsubscribe();
  }, [chatId, currentUserEmail, selectedUserEmail]);

  useEffect(() => {
    scrollToBottomSmooth(300);
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    await addDoc(collection(db, "messages"), {
      sender: currentUserEmail,
      recipient: selectedUserEmail,
      chatId,
      text: trimmed,
      seen: false,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    containerRef,
  };
};
