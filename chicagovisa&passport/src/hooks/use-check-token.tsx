import axiosInstance from "@/lib/config/axios";
import { useAuthStore } from "@/store/use-auth-store";
import { useCaseStore } from "@/store/use-case-store";
import { useState, useEffect } from "react";

interface UseCheckTokenReturn {
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
}

function useCheckToken(dependencies: any[] = []): UseCheckTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoggedIn, setIsLoggedIn } = useAuthStore((state) => state);
  const { setUserData } = useCaseStore((state) => state);

  useEffect(() => {
    const _token = localStorage.getItem("user_token");
    (async () => {
      try {
        if (!_token) return setIsLoggedIn(false);
        const data = await axiosInstance.get("/user/auth/check-token");
        const {
          email1,
          firstName,
          id,
          lastName,
          middleName,
          phone1,
          email2,
          phone2,
          dateOfBirth,
        } = data?.data?.user;
        const fullName =
          [firstName, middleName, lastName].filter(Boolean).join(" ") || "N/A";
        setUserData(
          email1,
          fullName,
          id,
          phone1,
          email2,
          phone2,
          firstName,
          middleName,
          lastName,
          dateOfBirth
        );
        if (data?.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setToken(_token);
      } catch (error) {
        setIsLoggedIn(false);
        setToken(null);
        localStorage.removeItem("user_token");
        // console.log("token error", error);
      } finally {
        setLoading(false);
      }
    })();
  }, dependencies);

  return { token, loading, isLoggedIn };
}

export default useCheckToken;
