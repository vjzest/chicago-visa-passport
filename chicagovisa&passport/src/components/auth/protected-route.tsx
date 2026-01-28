"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import LoadingPage from "../globals/loading/loading-page";
import { useAuthStore } from "@/store/use-auth-store";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const setAfterAuthLink = useAuthStore((state) => state.setAfterAuthLink);

  useEffect(() => {
    const checkAuth = () => {
      const token: any = localStorage.getItem("user_token");
      if (!token) {
        setAfterAuthLink(pathname);
        router.replace("/login");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== "user") {
          localStorage.removeItem("user_token");
          setAfterAuthLink(pathname);
          router.replace("/login");
        }
        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem("user_token");
        console.error("Authentication error", error);
        setAfterAuthLink(pathname);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
