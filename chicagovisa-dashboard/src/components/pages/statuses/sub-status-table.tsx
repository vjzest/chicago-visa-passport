import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/globals/custom-table";
import SortableHeader from "@/components/globals/table/sortable-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StatusForm } from "@/components/pages/statuses/status-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Cell from "@/components/globals/table/cell";
import Link from "next/link";

interface SubStatusTableProps {
  status: any;
  onUpdateSubStatus: (id: string, values: any) => void;
  onDeleteSubStatus: (id: string) => void;
  parent?: string;
}

const SubStatusTable: React.FC<SubStatusTableProps> = ({
  status,
  onUpdateSubStatus,
  onDeleteSubStatus,
  parent = null,
}) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Title" />} />
      ),
      cell: ({ row }) => <Cell value={<div>{row.getValue("title")}</div>} />,
    },
    {
      accessorKey: "key",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Safe key" />} />
      ),
      cell: ({ row }) => (
        <Cell value={<div className="lowercase">{row.getValue("key")}</div>} />
      ),
    },
    {
      accessorKey: "description",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Description" />} />
      ),
      cell: ({ row }) => (
        <Cell value={<div>{row.getValue("description")}</div>} />
      ),
    },
    {
      accessorKey: "actions",
      header: ({ column }) => <Cell value={"Actions"} />,
      cell: ({ row }) => (
        <Cell
          value={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rotate-90 text-2xl">
                  ...
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="">
                    <div className="p-2">
                      <StatusForm
                        title="Sub Status"
                        data={row.original}
                        onSubmit={(values) =>
                          onUpdateSubStatus(row.original._id, values)
                        }
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenuSeparator />

                {parent && (
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href={`/statuses/${parent}/${row.original._id}`}>
                      {" "}
                      View sub-sub statuses
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={status}
      showSearchBar={true}
      searchKeys={["title", "description"]}
      showColumnFilter={true}
      paginate={false}
    />
  );
};

export default SubStatusTable;
