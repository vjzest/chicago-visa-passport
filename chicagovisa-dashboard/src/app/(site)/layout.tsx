import type { Metadata } from "next";
import ProtectedRoute from "@/components/globals/Auth/protected-route";
import AdminPanelLayout from "@/components/globals/admin-panel/admin-panel-layout";
import { Suspense } from "react";
import LoadingPage from "@/components/globals/LoadingPage";

export const metadata: Metadata = {
  title: "Chicago Passport & Visa Admin",
  description: "Admin management console",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <ProtectedRoute>
        <AdminPanelLayout>
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </AdminPanelLayout>
      </ProtectedRoute>
    </main>
  );
}
