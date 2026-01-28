"use client";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, DownloadIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/passport/globals/custom-alert";
import Link from "next/link";

interface IGetLoaFilesColumns {
  onDelete: (_id: string) => void;
}

export const getLoaFilesColumns = ({
  onDelete,
}: IGetLoaFilesColumns): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "name",
      id: "name",
      header: (props) => <SortableHeader {...props} title="Name" />,
      cell: ({ row }) => {
        return <div>{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: (props) => <SortableHeader {...props} title="Actions" />,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center gap-3">
            <Link href={row.original.url} target="_blank" download>
              <DownloadIcon className="cursor-pointer" />
            </Link>
            <Edit className="cursor-pointer text-primary" />
            <CustomAlert
              TriggerComponent={
                <Trash2 className="cursor-pointer text-destructive" />
              }
              onConfirm={() => onDelete && onDelete(row.original._id)}
            />
          </div>
        );
      },
    },
  ];
};

interface SortableHeaderProps<T extends object> {
  column: Column<T>;
  title: string;
}

function SortableHeader<T extends object>({
  column,
  title,
}: SortableHeaderProps<T>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  );
}
