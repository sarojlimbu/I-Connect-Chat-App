import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  firstName?: string;
  lastName?: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
