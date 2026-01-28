import type { Metadata } from "next";
import DashboardPanelLayout from "@/components/dashboard/dashboard-panel/dashboard-panel-layout";
import "../../globals.css";
import ProtectedRoute from "@/components/auth/protected-route";
import NotificationCard from "@/components/globals/notification-card";
import "./dashboard.css";
import { Suspense } from "react";
import LoadingPage from "@/components/globals/loading/loading-page";
export const metadata: Metadata = {
  title: "Chicago Passport & Visa Expedite Services",
  description: "One platform for all your Passport Related Activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRoute>
        <NotificationCard />
        <DashboardPanelLayout>
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </DashboardPanelLayout>
      </ProtectedRoute>
    </>
  );
}
