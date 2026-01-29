"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import { UseFormReturn } from "react-hook-form";

export function ColorPicker({
  className,
  form,
}: {
  className: string;
  form: UseFormReturn<
    {
      title: string;
      color: string;
      description?: string | undefined;
    },
    any,
    undefined
  >;
}) {
  const [background, setBackground] = useState("#ffff");

  const solids = [
    "#ff75c3", // Light pink
    "#ffa647", // Salmon (pinkish)
    "#fcea44", // Peach (pinkish)

    "#ffe83f", // Yellow
    "#fcaf3e", // Mustard yellow

    "#9fff5b", // Light green
    "#a0d6e8", // Teal
    "#388e3c", // Forest green

    "#E2E2E2", // Gray
    "#cd93ff", // Lavender
    "#6f42c1", // Dark purple
    "#09203f", // Dark blue
    "#e74c3c", // Cherry red
    "#fffafa",
    "#1779ba",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="size-4 rounded border !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="size-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Card className="flex flex-wrap gap-3 p-3">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="size-6 cursor-pointer rounded-md border active:scale-105"
              onClick={() => setBackground(s)}
            />
          ))}
        </Card>

        <Input
          id="custom"
          value={form.getValues("color")}
          className="col-span-2 mt-4 h-8"
          onChange={(e) => {
            setBackground(e.currentTarget.value);
            form.setValue("color", e.currentTarget.value);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
