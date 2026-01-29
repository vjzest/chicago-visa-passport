"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useMenuList } from "@/lib/menu-list";
import { CollapseMenuButton } from "./collapse-menu-button";
import { TRoleData } from "@/app/(site)/manage-roles/data";

interface MenuProps {
  isOpen: boolean | undefined;
  view: "Statuses" | "Tools";
  access: TRoleData | null;
}

export function Menu({ isOpen, view, access }: MenuProps) {
  const pathname = usePathname();
  const menuList = useMenuList(pathname);


  if (menuList?.[0]?.menus?.length < 1)
    return (
      <div className="flex flex-col gap-2 mt-20">
        {Array(12)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="min-w-full bg-slate-50 opacity-25 min-h-[2rem] rounded-md animate-pulse"
            ></div>
          ))}
      </div>
    );
  return (
    <>
      <nav className="thin-scrollbar light-grey-scrollbar mt-2 size-full overflow-y-auto">
        <ul className="flex min-h-[calc(90vh-48px-36px-16px-32px)] flex-col items-start space-y-1 lg:min-h-[calc(90vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, groupIndex) => {
            if (view === "Statuses" && groupIndex !== 0) return null;
            if (view === "Tools" && groupIndex === 0) return null;

            return (
              <li
                className={cn("w-full", groupLabel ? "pt-5" : "")}
                key={groupIndex}
              >
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-slate-300">
                    {groupLabel}
                  </p>
                ) : isOpen === false &&
                  groupLabel &&
                  groupLabel !== "Statuses" ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="flex w-full items-center justify-center">
                          <Ellipsis className="size-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="pb-2"></p>
                )}
                {menus.map(
                  (
                    {
                      href,
                      label,
                      icon: Icon,
                      active,
                      submenus,
                      key,
                      caseCount,
                    },
                    menuIndex
                  ) => {
                    if (!isOpen && !key) return null;
                    const specialKeys = new Set(["users", "roles"]);
                    if (specialKeys.has(key!)) {
                      switch (key) {
                        case "users":
                          if (
                            access?.ultimateUserPrivileges.createAndEditUsers ===
                            false
                          ) {
                            return null;
                          }

                        case "roles":
                          if (
                            access?.ultimateUserPrivileges.createAndEditRoles ===
                            false
                          ) {
                            return null;
                          }
                      }
                    } else {
                      if (
                        key &&
                        access &&
                        access.viewAndEditManagementTools[
                        key as keyof TRoleData["viewAndEditManagementTools"]
                        ] === false
                      ) {
                        return null;
                      }
                    }
                    if (submenus.length === 0) {
                      const component = (
                        <div
                          className="w-full border-t border-sky-600"
                          key={menuIndex}
                        >
                          <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={active ? "outline" : "ghost"}
                                  className={cn(
                                    " h-10 w-full",
                                    isOpen === false
                                      ? "justify-center"
                                      : "justify-start"
                                  )}
                                  asChild
                                >
                                  <Link href={href}>
                                    {Icon ? (
                                      <span
                                        className={
                                          isOpen === false ? "" : "mr-4"
                                        }
                                      >
                                        <Icon size={18} />
                                      </span>
                                    ) : null}
                                    <p
                                      className={cn(
                                        "max-w-[200px] text-xs break-words",
                                        isOpen === false
                                          ? "-translate-x-96 hidden"
                                          : "translate-x-0 opacity-100 "
                                      )}
                                    >
                                      {typeof caseCount !== "undefined"
                                        ? `(${caseCount}) `
                                        : ""}
                                      {label}{" "}
                                    </p>
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              {isOpen === false && (
                                <TooltipContent side="right">
                                  {label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );

                      return component;
                    } else {
                      return (
                        <div className="w-full" key={menuIndex}>
                          <CollapseMenuButton
                            isStatus={view === "Statuses" ? true : false}
                            href={href}
                            icon={Icon}
                            label={label}
                            active={active}
                            submenus={submenus}
                            isOpen={isOpen}
                            caseCount={caseCount}
                          />
                        </div>
                      );
                    }
                  }
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
