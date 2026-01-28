import Link from "next/link";
import { LogOut, PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import Image from "next/image";
import { IMGS } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomAlert from "@/components/globals/custom-alert";
import { useCaseStore } from "@/store/use-case-store";
import useFetchStoreData from "@/hooks/use-fetch-store-data";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
const logo = "/landing/assets/logo.svg";

export function Sidebar() {
  useFetchStoreData();
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const clearAllData = useCaseStore((state) => state.clearAllData);
  const resetStore = usePassportApplicationStore((state) => state.resetStore);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("case-storage");
    localStorage.removeItem("access-token");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("lastNotified");
    localStorage.removeItem("contingentcaseid");
    resetStore("");
    clearAllData();
    setTimeout(() => {
      //PENDING redirect to proper homepage
      window.location.href = "/login";
    }, 10);
  };
  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bg-white  z-20 h-full -translate-x-full md:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto  px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 ",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard/my-applications"
            className="flex items-center gap-2"
          >
            {sidebar?.isOpen ? (
              <Image
                height={200}
                width={200}
                alt="logo"
                className="w-[7rem]"
                src={logo}
              />

            ) : (
              <Image
                height={500}
                width={500}
                alt="logo"
                className="w-20"
                src={IMGS.LogoOnly}
              />
              // <span className="text-deep-blue font-extrabold text-2xl">CP</span>
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
        <li className="flex w-full grow items-end">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <CustomAlert
                  confirmText="Sure"
                  alertTitle="Confirmation"
                  alertMessage="Are you sure want to sign Out"
                  TriggerComponent={
                    <Button
                      id="sign-out-btn"
                      onSelect={(e) => e.preventDefault()}
                      variant="outline"
                      className="mb-8 mt-5 h-10 w-full justify-center"
                    >
                      <span
                        className={cn(sidebar?.isOpen === false ? "" : "mr-4")}
                      >
                        <LogOut size={18} />
                      </span>
                      <p
                        className={cn(
                          "whitespace-nowrap",
                          sidebar?.isOpen === false
                            ? "opacity-0 hidden"
                            : "opacity-100"
                        )}
                      >
                        Sign out
                      </p>
                    </Button>
                  }
                  onConfirm={() => {
                    handleLogout();
                  }}
                />
              </TooltipTrigger>
              {sidebar?.isOpen === false && (
                <TooltipContent side="right">Sign out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </li>
      </div>
    </aside>
  );
}
