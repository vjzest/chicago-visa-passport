"use client";
import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import Image from "next/image";
import { IMGS } from "@/lib/constants";
import { useState } from "react";

export function SheetMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className=" h-8" variant="outline" size="icon">
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
            <Link
              href="/dashboard/my-applications"
              className="flex items-center gap-2"
            >
              <Image
                height={500}
                width={500}
                alt="logo"
                className="w-[15rem]"
                src={IMGS.JetPassportsFull}
              />
            </Link>
          </Button>
        </SheetHeader>
        <Menu setOpen={setOpen} isOpen />
      </SheetContent>
    </Sheet>
  );
}
