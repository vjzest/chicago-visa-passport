"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/globals/table/sortable-header";
import Link from "next/link";
import { CustomTable } from "@/components/globals/custom-table";
import { Switch } from "@/components/ui/switch";
import Cell from "@/components/globals/table/cell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ServiceTypeArchiveDialog from "./service-type-archive-dialog";
import { Badge } from "@/components/ui/badge";

type ServiceTypeTableProps = {
  serviceTypes: IServiceType[];
  refetch: () => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
};

const ServiceTypeTable = ({
  serviceTypes,
  refetch,
  showArchived,
  setShowArchived,
}: ServiceTypeTableProps) => {
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
              className={`${row?.original?.isArchived ? "text-red-400" : ""}`}
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
      accessorKey: "isEvisa",
      header: () => <Cell alignCenter={true} value="E-Visa" />,
      cell: ({ row }) => (
        <Cell
          alignCenter={true}
          value={
            row.original.isEvisa ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                E-Visa
              </Badge>
            ) : (
              <Badge variant="secondary">Standard</Badge>
            )
          }
        />
      ),
    },
    {
      accessorKey: "countries",
      header: () => <Cell value="Countries" />,
      cell: ({ row }) => {
        const serviceType = row.original;

        // Get country pair - could be populated object or not
        const countryPair = serviceType.countryPair && typeof serviceType.countryPair === 'object'
          ? serviceType.countryPair as ICountryPair
          : null;

        if (!countryPair) {
          return <Cell value={<Badge variant="secondary">No Route</Badge>} />;
        }

        return (
          <Cell
            value={
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex gap-1 items-center">
                  <span className="font-medium">{countryPair.fromCountryName}</span>
                  <span>→</span>
                  <span className="font-medium">{countryPair.toCountryName}</span>
                </div>
                {serviceType.allowedCitizenOf && serviceType.allowedCitizenOf.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {serviceType.allowedCitizenOf.length} citizen(s)
                  </span>
                )}
              </div>
            }
          />
        );
      },
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
      >
        <div className="flex items-center space-x-2 mr-2">
          <Switch
            id="archived-mode"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <label
            htmlFor="archived-mode"
            className="text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Show Archived
          </label>
        </div>
      </CustomTable>
    </div>
  );
};

export default ServiceTypeTable;
