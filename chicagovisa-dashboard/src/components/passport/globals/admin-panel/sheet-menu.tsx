"use client";
import Link from "next/link";
import { List, LogOut, MenuIcon, PanelsTopLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const clearStore = useAdminStore((state) => state.clearStore);
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
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/search" className="flex items-center gap-2">
              <PanelsTopLeft className="mr-1 size-6" />
              <h1 className="text-lg font-bold">Jet Passports</h1>
            </Link>
          </Button>
        </SheetHeader>
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
