import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const rawAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

const axiosInstance = setupCache(rawAxiosInstance, {
  ttl: 1000 * 5,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const isPassport = window.location.pathname.startsWith("/us-passport");

      if (isPassport && process.env.NEXT_PUBLIC_PASSPORT_BASEURL) {
        config.baseURL = process.env.NEXT_PUBLIC_PASSPORT_BASEURL;
        const accessToken = localStorage.getItem("passport_user_token");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } else {
        const accessToken = localStorage.getItem("user_token");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    }
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
      const responseURL = error.response?.request?.responseURL || "";
      if (
        responseURL.endsWith("check-token") ||
        responseURL.includes("payment-link") ||
        responseURL.includes("homepage") ||
        responseURL.includes("service-types")
      ) {
        return Promise.reject(error);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_token");
        localStorage.removeItem("case-storage");
        localStorage.removeItem("access-token");
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
