"use client";

import Link from "next/link";
import { useState } from "react";
import { Asterisk, ChevronDown, Dot, LucideIcon } from "lucide-react";

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

type SubSubmenu = {
  href: string;
  label: string;
  active: boolean;
  caseCount?: number;
};
interface CollapseSubMenuButtonProps {
  icon?: LucideIcon;
  label: string;
  active: boolean;
  submenus: SubSubmenu[];
  isOpen: boolean | undefined;
  isStatus: boolean;
  href: string;
  caseCount?: number;
}

export function CollapseSubMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
  isStatus,
  href,
  caseCount,
}: CollapseSubMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      {isStatus ? (
        <div className="flex items-center">
          <Link href={href} className="w-full">
            <Button
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start h-fit min-h-10 PY-3"
            >
              <div className="w-full items-center flex justify-between">
                <div className="flex items-center">
                  <span className="mr-4">
                    <Asterisk size={18} />
                  </span>
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
              </div>
            </Button>
          </Link>
          <CollapsibleTrigger
            className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1 p-2 hover:bg-sky-200 cursor-pointer rounded-md transition-colors hover:text-black"
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
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
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
            className="w-full justify-start h-fit min-h-10 PY-3"
          >
            <div className="w-full items-center flex justify-between">
              <div className="flex items-center">
                {Icon ? (
                  <span className={"ml-4 mr-2"}>
                    <Asterisk size={18} />
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
      <CollapsibleContent className="overflow-hidden rounded-md bg-[#3d81b6] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(
          ({ href, label, active, caseCount: caseCount2 }, index) => (
            <Button
              key={index}
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start h-fit min-h-10 PY-3 mb-1"
              asChild
            >
              <Link href={href}>
                <span className="ml-8 mr-2">
                  <Dot size={18} />
                </span>
                <p
                  className={cn(
                    "max-w-[170px] break-words text-xs text-wrap",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  {typeof caseCount2 !== "undefined" ? `(${caseCount2}) ` : ""}
                  {label}
                </p>
              </Link>
            </Button>
          )
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
                className="w-full justify-start h-fit min-h-10 PY-3 mb-1"
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
                        "max-w-[200px] break-words text-xs text-wrap",
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
          {typeof caseCount !== "undefined" ? `(${caseCount}) ` : ""}
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, caseCount: caseCount2 }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" href={href}>
              <p className="max-w-[180px] break-words text-xs text-wrap">
                {" "}
                {typeof caseCount2 !== "undefined" ? `(${caseCount2}) ` : ""}
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
