"use client";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Cell from "@/components/globals/table/cell";
import ServiceLevelActionsCell from "./service-level-actions-cell";

interface ServiceLevelColumnsProps {
  handleEdit: (data: IServiceLevel) => Promise<void>;
  handleToggleActive: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
}

export const getServiceLevelColumns = ({
  handleEdit,
  handleToggleActive,
  fetchData,
}: ServiceLevelColumnsProps): ColumnDef<IServiceLevel>[] => [
  {
    accessorKey: "serviceLevel",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Service Level
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={`text-center uppercase ${row?.original?.isArchived ? "text-red-400" : ""}`}
      >
        {String(row.getValue("serviceLevel"))}
      </div>
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Time
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{String(row.getValue("time"))}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-center whitespace-nowrap">Service / Non-Ref</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            Service Fee :{" "}
          </span>
          <span>{`$${row.original.price}`}</span>
        </div>
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            NON-REF :{" "}
          </span>
          <span>{`$${row.original.nonRefundableFee}`}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "inboundFee",
    header: () => (
      <div className="text-center whitespace-nowrap">
        Inbound / Outbound Fee
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            IN :{" "}
          </span>
          <span>{`$${row.original.inboundFee}`}</span>
        </div>
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            OUT :{" "}
          </span>
          <span>{`$${row.original.outboundFee}`}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "paymentGateway",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Merchant Account
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("paymentGateway");
      const displayValue = value
        ? (value as any).processorName
        : "LOAD BALANCER";
      return <div className="text-center">{displayValue}</div>;
    },
  },
  {
    accessorKey: "authOnlyFrontend",
    header: () => "Auth Only Frontend",
  },
  {
    accessorKey: "amex",
    header: () => <div className="text-center">Payment</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            AMEX :{" "}
          </span>
          <span>{row.original.amex ? "true" : "false"}</span>
        </div>
        <div className="flex min-w-[80px] items-center justify-between gap-2 rounded border px-2 py-0.5 text-xs">
          <span className="font-bold text-gray-500 whitespace-nowrap">
            Double CHRG :{" "}
          </span>
          <span>{row.original.doubleCharge ? "true" : "false"}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "serviceTypes",
    header: () => <Cell value={"Service Types"} />,
    cell: ({ row }) => {
      const serviceTypes: {
        _id: string;
        serviceType: string;
        shortHand: string;
      }[] = row.getValue("serviceTypes");
      return (
        <div className="text-center">
          {serviceTypes?.map((type, index) => (
            <span key={type._id}>
              {type?.shortHand}
              {index < serviceTypes?.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Active
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        className={`text-center font-semibold ${row?.original?.isActive ? "text-green-500" : "text-red-500"}`}
      >
        {row.original?.isActive ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <ServiceLevelActionsCell
        row={row}
        handleEdit={handleEdit}
        handleToggleActive={handleToggleActive}
        fetchData={fetchData}
      />
    ),
  },
];
