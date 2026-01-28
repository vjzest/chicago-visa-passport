"use client";
import "../globals.css";
import { Footer, Header } from "@/components/globals";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingPage from "@/components/globals/loading/loading-page";
import useCheckToken from "@/hooks/use-check-token";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { isLoggedIn } = useCheckToken([pathname]);
  const navigate = useRouter();

  const tokenCheck = () => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        navigate.replace("/dashboard/my-applications");
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error fetching token", e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    tokenCheck();
  }, [isLoggedIn]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header />
      <main className="py-10">{children}</main>
      <Footer />
    </>
  );
}
