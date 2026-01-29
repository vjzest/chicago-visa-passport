import { create } from "zustand";
import { IAdmin } from "@/interfaces/admin.interface";
import { TRoleData } from "@/app/(site)/manage-roles/data";
import axiosInstance from "@/services/axios/axios";
import { getCurrentDateInDC } from "@/lib/utils";
import { IStatus } from "@/interfaces/status.interface";
import { passportContentApi } from "@/services/passport-content.service";
import { PassportSection } from "@/types/passport-content";

interface AdminStore {
  // State
  admin: IAdmin | null;
  access: TRoleData | null;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  statuses: (IStatus & { caseCount: number })[];
  passportSections: { title: string }[];
  mode: "CHICAGO" | "PASSPORT";

  // Setters
  setAdmin: (admin: IAdmin | null) => void;
  setAccess: (access: TRoleData | null) => void;
  setMode: (mode: "CHICAGO" | "PASSPORT") => void;
  setError: (error: string | null) => void;

  // Actions
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  setupAutoRefresh: () => () => void;
  clearStore: () => void;
  refreshStatuses: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  admin: null,
  access: null,
  lastUpdated: null,
  isLoading: false,
  error: null,
  statuses: [],
  passportSections: [],
  mode: (typeof window !== "undefined" ? localStorage.getItem("admin_mode") as "CHICAGO" | "PASSPORT" : "CHICAGO") || "CHICAGO",

  // Basic setters
  setAdmin: (admin) => set({ admin }),
  setAccess: (access) => set({ access }),
  setMode: (mode) => {
    localStorage.setItem("admin_mode", mode);
    set({ mode });
    window.location.reload();
  },
  setError: (error) => set({ error }),

  // Clear store (useful for logout)
  clearStore: () =>
    set({
      admin: null,
      access: null,
      lastUpdated: null,
      error: null,
      isLoading: false,
      statuses: [],
    }),

  // Initialize admin and role data
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Fetch role, admin profile, and statuses concurrently
      const [roleResponse, adminResponse, statusesResponse] = await Promise.all(
        [
          axiosInstance.get("/admin/roles/my-role"),
          axiosInstance.get("/admin/auth/my-profile"),
          axiosInstance.get(
            "/admin/statuses?onlyAllowed=true&showCaseCount=true"
          ),
        ]
      );

      if (
        !roleResponse.data?.success ||
        !adminResponse.data?.success ||
        !statusesResponse.data?.success
      ) {
        throw new Error("Failed to fetch initialization data");
      }

      const roleData: TRoleData = roleResponse.data.data;
      const adminData: IAdmin = adminResponse.data.data;
      const statusesData: (IStatus & { caseCount: number })[] =
        statusesResponse.data.data;

      // Fetch Passport Sections if in PASSPORT mode
      let passportSections: { title: string }[] = [];
      if (get().mode === "PASSPORT") {
        try {
          const content = await passportContentApi.getContent();
          if (content?.usPassportPage?.passportSections) {
            passportSections = content.usPassportPage.passportSections.map((s: PassportSection) => ({ title: s.title }));
          }
        } catch (err) {
          console.error("Failed to fetch passport sections for menu", err);
        }
      }

      set({
        admin: adminData,
        access: roleData,
        statuses: statusesData,
        passportSections,
        lastUpdated: getCurrentDateInDC(),
        isLoading: false,
      });

      // Set up auto-refresh
      get().setupAutoRefresh();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      });
    }
  },

  // Manual refresh function (now matches initialize pattern)
  refresh: async () => {
    try {
      set({ isLoading: true, error: null });

      const [roleResponse, adminResponse, statusesResponse] = await Promise.all(
        [
          axiosInstance.get("/admin/roles/my-role"),
          axiosInstance.get("/admin/auth/my-profile"),
          axiosInstance.get(
            "/admin/statuses?onlyAllowed=true&showCaseCount=true"
          ),
        ]
      );

      if (
        !roleResponse.data?.success ||
        !adminResponse.data?.success ||
        !statusesResponse.data?.success
      ) {
        throw new Error("Failed to fetch refresh data");
      }

      const roleData: TRoleData = roleResponse.data.data;
      const adminData: IAdmin = adminResponse.data.data;
      const statusesData: (IStatus & { caseCount: number })[] =
        statusesResponse.data.data;

      // Fetch Passport Sections
      let passportSections: { title: string }[] = [];
      if (get().mode === "PASSPORT") {
        try {
          const content = await passportContentApi.getContent();
          if (content?.usPassportPage?.passportSections) {
            passportSections = content.usPassportPage.passportSections.map((s: PassportSection) => ({ title: s.title }));
          }
        } catch (err) {
          console.error("Failed to fetch passport sections for refresh", err);
        }
      }

      set({
        admin: adminData,
        access: roleData,
        statuses: statusesData,
        passportSections,
        lastUpdated: getCurrentDateInDC(),
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      });
    }
  },

  refreshStatuses: async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/statuses?onlyAllowed=true&showCaseCount=true"
      );
      if (!data?.success) throw new Error("Failed to fetch statuses");
      set((state) => ({
        ...state,
        statuses: data.data,
      }));
    } catch (error) {
      console.error("Error refreshing statuses:", error);
    }
  },

  // Setup auto-refresh (private method)
  setupAutoRefresh: () => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    let intervalId: NodeJS.Timeout;

    // Set up new interval
    intervalId = setInterval(() => {
      get().refresh();
    }, REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  },
}));

export function checkActionAccess<
  K1 extends keyof Omit<TRoleData, "title" | "_id">,
  K2 extends keyof TRoleData[K1],
>(key1: K1, key2: K2): boolean {
  const role = useAdminStore.getState().access;
  return !!role?.[key1]?.[key2];
}
