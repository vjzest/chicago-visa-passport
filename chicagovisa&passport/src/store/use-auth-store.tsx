import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  afterAuthLink: string;
  setAfterAuthLink: (value: string) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        setIsLoggedIn: (value) => set({ isLoggedIn: value }),
        afterAuthLink: "",
        setAfterAuthLink: (value) => {
          set({ afterAuthLink: value });
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
