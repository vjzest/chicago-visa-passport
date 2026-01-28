"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, Mail, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCaseStore } from "@/store/use-case-store";
import CustomAlert from "@/components/globals/custom-alert";
import { useRouter } from "next/navigation";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";

export function UserNav() {
  const { userData } = useCaseStore((state) => state);
  const resetStore = usePassportApplicationStore((state) => state.resetStore);
  const clearAllData = useCaseStore((state) => state.clearAllData);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("case-storage");
    localStorage.removeItem("access-token");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("contingentcaseid");
    clearAllData();
    resetStore("");
    setTimeout(() => {
      //PENDING redirect to proper homepage
      window.location.href = "/login";
    }, 10);
  };
  return (
    <div className="relative">
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative size-8 rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarImage src="#" alt="Avatar" />
                    <AvatarFallback className="bg-transparent">
                      {userData?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          className="absolute -left-5 w-56"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-2 space-y-1">
              <p className="text-sm font-medium leading-none">
                {userData?.fullName}
              </p>
              <p className="flex gap-2 text-xs leading-none text-muted-foreground">
                <Mail className="size-4" />
                {userData?.email}
              </p>
              {userData?.phone && (
                <p className="flex gap-2 text-xs leading-none text-muted-foreground">
                  <Phone className="size-4" />
                  {userData?.phone}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link
                href="/dashboard/my-applications"
                className="flex items-center"
              >
                <LayoutGrid className="mr-3 size-4 text-muted-foreground" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/dashboard/settings" className="flex items-center">
                <User className="mr-3 size-4 text-muted-foreground" />
                Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

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
