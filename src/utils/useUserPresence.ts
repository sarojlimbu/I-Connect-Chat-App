import { rtdb } from "./firebaseConfig";
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";
import { useEffect } from "react";

export function useUserPresence(uid: string) {
  useEffect(() => {
    if (!uid) return;

    const userStatusRef = ref(rtdb, "status/" + uid);
    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }

      onDisconnect(userStatusRef).set({
        state: "offline",
        lastChanged: serverTimestamp(),
      });

      set(userStatusRef, {
        state: "online",
        lastChanged: serverTimestamp(),
      });
    });

    return () => {
      unsubscribe();
      set(userStatusRef, {
        state: "offline",
        lastChanged: serverTimestamp(),
      });
    };
  }, [uid]);
}
