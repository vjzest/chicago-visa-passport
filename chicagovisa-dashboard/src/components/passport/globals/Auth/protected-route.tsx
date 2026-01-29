"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import LoadingPage from "../LoadingPage";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const mode = localStorage.getItem("admin_mode");
      const tokenKey = mode === "PASSPORT" ? "admin_token_passport" : "admin_token";
      let token: any = localStorage.getItem(tokenKey);

      // Fallsback: if current mode token is missing, check if they have the other one
      // to avoid redirect loops between login and dashboard
      if (!token) {
        const fallbackKey = mode === "PASSPORT" ? "admin_token" : "admin_token_passport";
        token = localStorage.getItem(fallbackKey);
      }

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check role
        if (decoded.role !== "admin") {
          throw new Error("User is not an admin");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, isLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
