"use client";

import Link from "next/link";
import { useState } from "react";
import { Asterisk, ChevronDown, ChevronUp, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CollapseSubMenuButton } from "./collapse-sub-menu-button";

type SubSubmenu = {
  href: string;
  label: string;
  active: boolean;
};
type Submenu = {
  href: string;
  label: string;
  active: boolean;
  subsubmenus: SubSubmenu[];
  caseCount?: string;
};

interface CollapseMenuButtonProps {
  href: string;
  icon?: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen?: boolean;
  isStatus: boolean;
  caseCount?: number;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  href,
  active,
  submenus,
  isOpen,
  isStatus,
  caseCount,
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
  return typeof isOpen === "boolean" ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      {isStatus ? (
        <div className="flex items-center border-t border-sky-600">
          <Link href={href} className="w-full">
            <Button
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start h-fit min-h-10 py-3"
            >
              <div className="w-full items-center flex justify-between">
                <div className="flex items-center">
                  {Icon ? (
                    <span className="mr-4">
                      <Icon size={18} />
                    </span>
                  ) : null}
                  <p
                    className={cn(
                      "max-w-[150px] break-words text-start text-xs text-wrap",
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-96 opacity-0"
                    )}
                  >
                    {typeof caseCount !== "undefined" ? `(${caseCount}) ` : ""}
                    {label}
                  </p>
                </div>
              </div>
            </Button>
          </Link>
          <CollapsibleTrigger
            className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1 p-2 cursor-pointer  hover:bg-sky-200 rounded-md transition-colors hover:text-black"
            asChild
          >
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              {isCollapsed ? (
                <ChevronUp
                  size={18}
                  className="transition-all duration-200 active:rotate-90"
                />
              ) : (
                <ChevronDown
                  size={18}
                  className="transition-all duration-200 active:rotate-90"
                />
              )}
            </div>
          </CollapsibleTrigger>
        </div>
      ) : (
        <CollapsibleTrigger
          className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
          asChild
        >
          <Button
            variant={active ? "secondary" : "ghost"}
            className="w-full justify-start h-fit min-h-10 py-3 border-t border-sky-600 hover:rounded-md rounded-none"
          >
            <div className="w-full items-center flex justify-between ">
              <div className="flex items-center">
                {Icon ? (
                  <span className="mr-4">
                    <Icon size={18} />
                  </span>
                ) : null}
                <p
                  className={cn(
                    "max-w-[150px] break-words text-xs text-wrap",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  {typeof caseCount !== "undefined" ? `(${caseCount}) ` : ""}
                  {label}
                </p>
              </div>
              <div
                className={cn(
                  "whitespace-nowrap",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                <ChevronDown
                  size={18}
                  className="transition-transform duration-200"
                />
              </div>
            </div>
          </Button>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent
        hidden={!isOpen}
        className="overflow-hidden bg-[#2b5c83] px-2 rounded-md data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        {submenus.map(
          (
            { href, label, active, subsubmenus, caseCount: caseCount2 },
            submenuIndex
          ) => {
            if (subsubmenus.length === 0) {
              const component = (
                <div className="w-full" key={submenuIndex}>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? "outline" : "ghost"}
                          className={cn(
                            "mb-1 h-fit min-h-10 py-3 w-full ",
                            isOpen === false
                              ? "justify-center"
                              : "justify-start"
                          )}
                          asChild
                        >
                          <Link href={href}>
                            <span className={"ml-4 mr-2"}>
                              <Asterisk size={18} />
                            </span>
                            <p
                              className={cn(
                                "max-w-[200px] break-words text-xs text-wrap",
                                isOpen === false
                                  ? "-translate-x-96 opacity-0"
                                  : "translate-x-0 opacity-100"
                              )}
                            >
                              {typeof caseCount2 !== "undefined"
                                ? `(${caseCount2}) `
                                : ""}
                              {label}{" "}
                            </p>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && (
                        <TooltipContent side="right">{label}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
              return component;
            } else {
              return (
                <div className="w-full" key={submenuIndex}>
                  <CollapseSubMenuButton
                    href={href}
                    isStatus={isStatus}
                    icon={Icon}
                    label={label}
                    active={active}
                    submenus={subsubmenus}
                    isOpen={isOpen}
                  />
                </div>
              );
            }
          }
        )}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start h-fit min-h-10 py-2 mb-1"
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    {Icon ? (
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <Icon size={18} />
                      </span>
                    ) : null}
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {typeof caseCount !== "undefined"
                        ? `(${caseCount}) `
                        : ""}
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" href={href}>
              <p className="max-w-[180px] truncate">
                {" "}
                {typeof caseCount !== "undefined" ? `(${caseCount}) ` : ""}
                {label}
              </p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
