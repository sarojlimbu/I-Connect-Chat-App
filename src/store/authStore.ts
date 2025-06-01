import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  firstName?: string;
  lastName?: string;
  status?: string;
};

type AuthStore = {
  showChat: boolean;
  isLoading: boolean;
  user: User | null;
  selectedUser: User | null;

  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setShowChat: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      selectedUser: null,
      showChat: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setShowChat: (value) => set({ showChat: value }),
      logout: () => {
        set({ user: null, selectedUser: null, showChat: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-store");
          document.cookie = `accessToken=; path=/; max-age=${0};`;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
