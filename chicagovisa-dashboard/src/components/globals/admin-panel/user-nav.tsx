"use client";

import { Loader, LogOut, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "../custom-alert";
import { useAdminStore } from "@/store/use-admin-store";
import { useEffect } from "react";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import Tooltip2 from "@/components/ui/tooltip-2";

export function UserNav() {
  const { admin, access, refresh, clearStore } = useAdminStore(
    (state) => state
  );

  const navigate = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_passport");
      localStorage.removeItem("case-storage");
      clearStore();
      navigate.replace("/login");
    } catch (error) { }
  };
  useEffect(() => {
    if (!admin && !access) {
      refresh();
    }
  }, [admin, access, refresh]);
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <div className="flex items-center gap-4">
      <Tooltip2 text={"Refresh the page"}>
        <RefreshCcw
          color="white"
          className="cursor-pointer active:rotate-90 active:animate-spin"
          onClick={refreshPage}
        />
      </Tooltip2>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <>
            <div className="flex flex-col items-end">
              {admin ? (
                <>
                  <span className="text-white uppercase font-semibold">
                    {admin?.firstName + " " + admin?.lastName}
                  </span>
                  <span className="text-slate-300 text-xs font-medium">
                    {access?.title}
                  </span>{" "}
                </>
              ) : (
                <Loader className="animate-spin" color="white" />
              )}
            </div>

            <Image
              height={30}
              width={30}
              src={admin?.image || IMGS.UserPlaceHolder}
              className="rounded-full"
              alt="Avatar"
            />
          </>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="" align="end" forceMount>
          <CustomAlert
            confirmText="Sure"
            alertTitle="Confirmation"
            alertMessage="Are you sure want to sign Out"
            TriggerComponent={
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <LogOut className="mr-3 size-4 text-muted-foreground" />
                Sign out
              </DropdownMenuItem>
            }
            onConfirm={() => {
              handleLogout();
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
