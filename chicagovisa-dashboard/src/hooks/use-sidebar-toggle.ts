import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
  view: "Statuses" | "Tools";
  setView: (arg: "Statuses" | "Tools") => void;
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: true,
      setIsOpen: () => {
        set({ isOpen: !get().isOpen });
      },
      view: "Statuses",
      setView: (arg) => {
        set({ view: arg });
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
