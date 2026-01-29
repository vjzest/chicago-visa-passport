"use client";
import Link from "next/link";
import { List, LogOut, MenuIcon, PanelsTopLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccess } from "@/hooks/use-access";
import CustomAlert from "../custom-alert";
import { useAdminStore } from "@/store/use-admin-store";
import { useRouter } from "next/navigation";

export function SheetMenu() {
  const [view, setView] = useState<"Statuses" | "Tools">("Statuses");
  const access = useAccess();
  const { mode, setMode, clearStore } = useAdminStore((state) => ({
    mode: state.mode,
    setMode: state.setMode,
    clearStore: state.clearStore
  }));
  const navigate = useRouter();
  const handleLogout = () => {
    try {
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_passport");
      localStorage.removeItem("case-storage");
      navigate.replace("/login");
      clearStore();
    } catch (error) { }
  };

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <div className="flex flex-col gap-4 mb-4 items-center px-4 mt-2">
          <div className="flex items-center gap-4 py-2 opacity-100 h-10">
            <button
              onClick={() => {
                if (mode !== "CHICAGO") setMode("CHICAGO");
              }}
              className={cn(
                "text-lg font-bold transition-all duration-200",
                mode === "CHICAGO"
                  ? "text-sky-400 scale-105"
                  : "text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              )}
            >
              Visa
            </button>
            <span className="text-black/20 dark:text-white/20 select-none">|</span>
            <button
              onClick={() => {
                if (mode !== "PASSPORT") setMode("PASSPORT");
              }}
              className={cn(
                "text-lg font-bold transition-all duration-200",
                mode === "PASSPORT"
                  ? "text-sky-400 scale-105"
                  : "text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              )}
            >
              Passport
            </button>
          </div>
        </div>
        <Tabs
          hidden={
            Object.values(access?.viewAndEditManagementTools || {}).every(
              (val) => val === false
            ) &&
            !access?.ultimateUserPrivileges.createAndEditRoles &&
            !access?.ultimateUserPrivileges.createAndEditUsers
          }
          className="mx-auto"
          value={view}
          onValueChange={(value) => {
            setView(value === "Statuses" ? "Statuses" : "Tools");
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
        <Menu access={access} view={view} isOpen />
        <CustomAlert
          confirmText="Sure"
          alertTitle="Confirmation"
          alertMessage="Are you sure want to sign Out"
          TriggerComponent={
            <Button
              id="sign-out-btn"
              onSelect={(e) => e.preventDefault()}
              variant="outline"
              className="h-10 w-full justify-center"
            >
              <LogOut size={18} />
              <p className="ml-2">Sign out</p>
            </Button>
          }
          onConfirm={() => {
            handleLogout();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
