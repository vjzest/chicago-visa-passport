import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/globals/table/custom-table";
import { EyeIcon } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Cell from "@/components/globals/table/cell";

type Application = {
  _id: string;
  case: string;
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  caseManager: {
    firstName: string;
    lastName: string;
  };
  status: {
    title: string;
    key: string;
  };
};

export function CaseDetailTable({
  data,
  caseId,
}: {
  data: Application[];
  caseId: string;
}) {
  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "_id",
      header: "Application ID",
      cell: ({ row }) => {
        return <Cell>{row?.original?._id?.toUpperCase()}</Cell>;
      },
    },
    {
      accessorKey: "applicantInfo.firstName",
      header: "Name",
      cell: ({ row }) => (
        <>
          {row?.original?.applicantInfo?.firstName}{" "}
          {row?.original?.applicantInfo?.lastName}
        </>
      ),
    },
    {
      accessorKey: "status.title",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`flex w-fit items-center justify-center rounded-full p-1 px-5
          ${
            row?.original?.status?.key === "visa-delivered"
              ? "border border-green-500 text-green-500"
              : row?.original?.status?.key === "visa-rejected"
                ? "border border-red-500 text-red-500"
                : "border border-yellow-500 text-yellow-500"
          }`}
        >
          {row?.original?.status?.title}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/my-applications/${caseId}/${row?.original?._id}`}
        >
          <TooltipProvider>
            <EyeIcon />
          </TooltipProvider>
        </Link>
      ),
    },
  ];

  return (
    <CustomTable
      data={data}
      columns={columns} // columnFilters={columnFilters}
      // globalFilter={globalFilter}
      // setGlobalFilter={setGlobalFilter}
      // statusFilter={statusFilter}
      // setStatusFilter={setStatusFilter}
    />
  );
}
