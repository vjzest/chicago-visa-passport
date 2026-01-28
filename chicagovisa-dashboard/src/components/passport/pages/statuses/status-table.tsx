"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/passport/globals/custom-table";
import SortableHeader from "@/components/passport/globals/table/sortable-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StatusForm } from "./status-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Cell from "@/components/passport/globals/table/cell";
import Link from "next/link";

type StatusTableProps = {
  statuses: any[];
  onUpdate: (id: string, values: any) => void; // Uncommented
  showSortOrder?: boolean;
};
export function StatusTable({
  statuses,
  onUpdate,
  showSortOrder = false,
}: StatusTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sortOrder",
      header: (props) => <SortableHeader {...props} title="Sort Order" />,
      cell: ({ row }) => (
        <Cell value={<span className="">{row.getValue("sortOrder")}</span>} />
      ),
      enableSorting: showSortOrder,
    },
    {
      accessorKey: "title",
      header: (props) => <SortableHeader {...props} title="Title" />,
      cell: ({ row }) => <div className="">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "description",
      header: (props) => <SortableHeader {...props} title="Description" />,
      cell: ({ row }) => (
        <div className={" "}>{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "key",
      header: (props) => <SortableHeader {...props} title="Safe key" />,
      cell: ({ row }) => (
        <div className={"lowercase"}>{row.getValue("key")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <Cell alignCenter={true} value={"Actions"} />,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rotate-90 text-2xl disabled:cursor-not-allowed w-full flex justify-center"
              title={
                row?.original?.isStatic
                  ? "This Status cannot be Edited or Deleted"
                  : ""
              }
            >
              ...
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <StatusForm
                    showSortOrder={true}
                    statusCount={statuses.length}
                    data={row.original}
                    onSubmit={(values) => onUpdate!(row.original._id, values)}
                  />
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Link href={"/statuses/" + row.original._id}>
                  View sub-statuses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (!showSortOrder) {
    columns.shift();
  }

  return (
    <div className="w-full py-2 md:py-3">
      <CustomTable
        paginate={false}
        columns={columns}
        data={statuses}
        showSearchBar={true}
        showColumnFilter
        searchKeys={["title", "description"]}
      />
    </div>
  );
}
