"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMGS } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IAdmin } from "@/interfaces/admin.interface";
import EditUserDialog from "../manage-users/edit-user-dialog";
import { CustomTable } from "@/components/globals/custom-table";
import Link from "next/link";

export default function AdminsTable({
  data,
  refetch,
  allowEdit,
}: {
  data: IAdmin[];
  refetch: () => void;
  allowEdit: boolean;
}) {
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<IAdmin | null>(null);
  const columns: ColumnDef<IAdmin>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          className="w-full text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <p
          className={`text-center ${row.original.status === "Archive" ? "text-red-500" : ""}`}
        >
          {row.original.firstName} {row.original.lastName}
        </p>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => row?.original?.email,
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Image
          src={row.original.image || IMGS.UserPlaceHolder}
          alt="Admin Image"
          width={200}
          height={200}
          className="mx-auto rounded-sm transition-transform size-10 hover:scale-[2]"
        />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <p className="text-center">
          {" "}
          {typeof row?.original?.role === "string"
            ? "- - -"
            : row.original.role.title}
        </p>
      ),
    },
    {
      accessorKey: "ipRestriction",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IP Restriction
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row?.original?.ipRestriction ? (
          <p className="text-center">
            {row?.original?.ipRestriction ? row?.original?.ipAddress : "None"}
          </p>
        ) : (
          <p className="text-center">No</p>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) =>
        allowEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="rotate-90 text-2xl flex justify-center w-full">
              ...
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <button
                  onClick={() => {
                    setSelectedAdmin(row.original);
                    setOpenEditDialog(true);
                  }}
                  className="w-full text-left"
                >
                  Edit user
                </button>
              </DropdownMenuItem>
              <Link href={`/manage-users/${row.original._id}/files`}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <button className="w-full text-left">
                    View employee files
                  </button>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p className="text-center text-slate-400">No access</p>
        ),
    },
  ];

  return (
    <div className="w-full">
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="">
          <DialogTitle>Edit User</DialogTitle>
          <div className="p-2">
            {selectedAdmin && (
              <EditUserDialog
                reset={() => {
                  refetch();
                  setSelectedAdmin(null);
                }}
                setOpenEditDialog={setOpenEditDialog}
                admin={selectedAdmin}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <CustomTable columns={columns} data={data} paginate={false} />
    </div>
  );
}
