"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/passport/globals/table/sortable-header";
import Link from "next/link";
import { CustomTable } from "@/components/passport/globals/custom-table";
import Cell from "@/components/passport/globals/table/cell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ServiceTypeArchiveDialog from "./service-type-archive-dialog";

type ServiceTypeTableProps = {
  serviceTypes: IServiceType[];
  refetch: () => void;
};

const ServiceTypeTable = ({ serviceTypes, refetch }: ServiceTypeTableProps) => {
  const columns: ColumnDef<IServiceType>[] = [
    {
      accessorKey: "serviceType",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Visa Type" />} />
      ),
      cell: ({ row }) => (
        <Cell
          value={
            <span
              className={`${row.original.isArchived ? "text-red-400" : ""}`}
            >
              {row.getValue("serviceType")}
            </span>
          }
        />
      ),
    },
    {
      accessorKey: "shortHand",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Short Hand" />} />
      ),
      cell: ({ row }) => <Cell value={row.getValue("shortHand")} />,
    },
    {
      accessorKey: "sortOrder",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Sort Order" />} />
      ),
      cell: ({ row }) => <Cell value={row.getValue("sortOrder")} />,
    },
    {
      accessorKey: "processingTime",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Processing Time" />} />
      ),
      cell: ({ row }) => <Cell value={row.getValue("processingTime")} />,
    },
    {
      accessorKey: "actions",
      header: () => <Cell alignCenter={true} value={"Actions"} />,
      cell: ({ row }) => {
        return (
          <Cell
            alignCenter={true}
            value={
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center w-full focus:outline-none">
                  <button className="flex rotate-90 cursor-pointer items-center justify-center text-2xl">
                    ...
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link
                    href={"/service-types/" + row.original._id}
                    className="w-fit"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Edit
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ServiceTypeArchiveDialog
                      refetch={refetch}
                      serviceType={row.original}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        );
      },
    },
  ];
  return (
    <div className="w-full py-2 md:py-3">
      <CustomTable
        paginate={false}
        columns={columns}
        data={serviceTypes}
        showSearchBar={true}
        showColumnFilter
        searchKeys={["serviceType", "shortHand"]}
      />
    </div>
  );
};

export default ServiceTypeTable;
