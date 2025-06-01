"use client";

import { useAuthStore } from "@/store/authStore";
import { useUserPresence } from "@/utils/useUserPresence";

export default function PresenceTracker() {
  const user = useAuthStore((state) => state.user);

  useUserPresence(user?.uid ?? "");

  return null;
}
