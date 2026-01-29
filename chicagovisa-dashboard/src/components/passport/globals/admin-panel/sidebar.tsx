import Link from "next/link";
import { List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useAdminStore } from "@/store/use-admin-store";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccess } from "@/hooks/use-access";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const access = useAccess();
  const { mode, setMode } = useAdminStore((state) => ({
    mode: state.mode,
    setMode: state.setMode
  }));

  const handleModeChange = (newMode: "CHICAGO" | "PASSPORT") => {
    if (mode === newMode) return;
    setMode(newMode);
  };

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen transition-all ease-in-out duration-300 bg-deep-blue text-white hidden lg:flex",
        sidebar?.isOpen === false ? "-translate-x-full" : "translate-x-0",
        "lg:translate-x-0",
        sidebar?.isOpen === false
          ? sidebar.view === "Tools"
            ? "w-[90px]"
            : "w-[20px]"
          : "w-64"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      {!(!sidebar.isOpen && sidebar.view === "Statuses") && (
        <div className="invisible-scrollbar relative flex h-full flex-col  overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
          <div
            className={cn(
              "flex flex-col gap-4 mb-4 transition-all duration-300",
              sidebar?.isOpen === false ? "items-center px-0 h-0 overflow-hidden" : "items-center px-4"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-4 py-2 transition-all duration-300",
                sidebar?.isOpen === false ? "opacity-0 h-0 w-0 overflow-hidden" : "opacity-100 h-10"
              )}
            >
              <button
                onClick={() => handleModeChange("CHICAGO")}
                className={cn(
                  "text-lg font-bold transition-all duration-200",
                  mode === "CHICAGO"
                    ? "text-sky-400 scale-105"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                Visa
              </button>
              <span className="text-white/20 select-none">|</span>
              <button
                onClick={() => handleModeChange("PASSPORT")}
                className={cn(
                  "text-lg font-bold transition-all duration-200",
                  mode === "PASSPORT"
                    ? "text-sky-400 scale-105"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                Passport
              </button>
            </div>
          </div>

          <Tabs
            hidden={
              !sidebar?.isOpen ||
              (Object.values(access?.viewAndEditManagementTools || {}).every(
                (val) => val === false
              ) &&
                !access?.ultimateUserPrivileges.createAndEditRoles &&
                !access?.ultimateUserPrivileges.createAndEditUsers)
            }
            className="mx-auto"
            value={sidebar.view}
            onValueChange={(value) => {
              sidebar.setView(value === "Statuses" ? "Statuses" : "Tools");
            }}
          >
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:bg-deep-blue data-[state=active]:text-white text-deep-blue"
                value="Statuses"
              >
                <List size={"1.2rem"} />
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-deep-blue data-[state=active]:text-white text-deep-blue"
                value="Tools"
              >
                <Settings size={"1.2rem"} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Menu view={sidebar.view} isOpen={sidebar?.isOpen} access={access} />
        </div>
      )}
    </aside>
  );
}
