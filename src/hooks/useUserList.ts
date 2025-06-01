"use client";

import { useEffect, useState } from "react";
import { db, rtdb } from "@/utils/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { useAuthStore } from "@/store/authStore";

type User = {
  uid: string;
  email: string;
  displayName?: string;
};

type LastMessage = {
  content: string;
  seen: boolean;
  timestamp: string;
};

export type UserWithStatus = User & {
  status: "online" | "offline";
  lastMessage?: LastMessage;
};

export function useUserList() {
  const authUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<UserWithStatus[]>([]);

  useEffect(() => {
    if (!authUser?.email) return;
    const unsubscribers: (() => void)[] = [];

    async function setupListeners() {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "!=", authUser?.email)
      );
      const usersSnap = await getDocs(usersQuery);
      const usersList: User[] = usersSnap.docs.map((d) => d.data() as User);

      const initialState: UserWithStatus[] = usersList.map((u) => ({
        ...u,
        status: "offline",
        lastMessage: undefined,
      }));
      setUsers(initialState);

      usersList.forEach((u) => {
        const statusRef = ref(rtdb, `status/${u.uid}`);
        const unsubPresence = onValue(statusRef, (snap) => {
          const st = snap.val()?.state ?? "offline";
          setUsers((prev) =>
            prev.map((x) => (x.uid === u.uid ? { ...x, status: st } : x))
          );
        });
        unsubscribers.push(unsubPresence);
      });

      usersList.forEach((u) => {
        const chatId = [authUser?.email, u.email].sort().join("_");
        const lastMsgQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatId),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const unsubLast = onSnapshot(lastMsgQuery, (snap) => {
          if (snap.empty) {
            setUsers((prev) =>
              prev.map((x) =>
                x.uid === u.uid ? { ...x, lastMessage: undefined } : x
              )
            );
            return;
          }
          const data = snap.docs[0].data() as any;
          setUsers((prev) =>
            prev.map((x) =>
              x.uid === u.uid
                ? {
                    ...x,
                    lastMessage: {
                      content: data.text || "",
                      seen: data.seen || false,
                      timestamp:
                        data.timestamp?.toDate().toLocaleString() || "",
                    },
                  }
                : x
            )
          );
        });
        unsubscribers.push(unsubLast);
      });
    }

    setupListeners();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [authUser?.email]);

  return users;
}
