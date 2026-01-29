"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "./sidebar";
import { ContentLayout } from "@/components/globals/admin-panel/content-layout";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-white dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false
            ? sidebar.view === "Statuses"
              ? "lg:ml-[20px]"
              : "lg:ml-[90px]"
            : "lg:ml-64"
        )}
      >
        <ContentLayout title="">{children}</ContentLayout>
      </main>
    </>
  );
}
