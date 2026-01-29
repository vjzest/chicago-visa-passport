"use client";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children?: React.ReactNode;
  className?: string;
  title?: string
}

export default function SortableHeader<TData, TValue>({
  column,
  children,
  className,
  title
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={className}
    >
      {title ?? children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
