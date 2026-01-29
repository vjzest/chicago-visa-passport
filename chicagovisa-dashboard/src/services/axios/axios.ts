import env from "@/lib/env.config";
import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const rawAxiosInstance = axios.create({
  baseURL: env.BASE_URL,
});

const axiosInstance = setupCache(rawAxiosInstance, {
  ttl: 1000 * 5,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Dynamic Base URL Switching based on Admin Mode
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("admin_mode");
      // Explicitly check for PASSPORT mode
      if (mode === "PASSPORT" && env.PASSPORT_BASE_URL) {
        config.baseURL = env.PASSPORT_BASE_URL;
        const accessToken = localStorage.getItem("admin_token_passport");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } else {
        // Default to Chicago
        config.baseURL = env.BASE_URL;
        const accessToken = localStorage.getItem("admin_token");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    }

    // DEBUG LOG
    console.log(`[Request] Mode: ${localStorage.getItem("admin_mode")} | URL: ${config.baseURL}${config.url}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const mode = localStorage.getItem("admin_mode");
        if (mode === "PASSPORT") {
          localStorage.removeItem("admin_token_passport");
        } else {
          localStorage.removeItem("admin_token");
        }
        // window.location.href = "/login"; // TEMPORARILY DISABLED
        console.error("401 Unauthorized - Check Backend Logs");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
