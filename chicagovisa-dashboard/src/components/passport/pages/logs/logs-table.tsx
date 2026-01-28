"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/passport/globals/custom-table";
import SortableHeader from "@/components/passport/globals/table/sortable-header";
import { getFormattedDateAndTime } from "@/lib/utils";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

type LogsTableProps = {
  logs: any[];
};

export function LogsTable({ logs }: LogsTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      id: "admin",
      header: (props) => <SortableHeader {...props} title="User" />,
      cell: ({ row }) => {
        return <div className="">{row?.original?.admin?.firstName}</div>;
      },
    },
    {
      accessorKey: "module",
      header: (props) => <SortableHeader {...props} title="module" />,
      cell: ({ row }) => (
        <div className="rounded-full border-2 border-green-500  bg-green-100/30 px-3 py-1  text-center uppercase shadow-lg backdrop-blur-lg">
          {row.getValue("module")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: (props) => <SortableHeader {...props} title="action" />,
      cell: ({ row }) => {
        return <StatusMessage message={row.getValue("action")} />;
      },
    },
    {
      id: "createdAt",
      header: "Log Date & Time",
      cell: ({ row }) => {
        const { formattedDate, formattedTime } = getFormattedDateAndTime(
          row?.original?.createdAt
        );
        return `${formattedDate} - ${formattedTime}`;
      },
    },
  ];

  return (
    <div className="w-full py-3">
      <CustomTable
        columns={columns}
        data={logs}
        showSearchBar={true}
        showColumnFilter
        searchKeys={["status"]}
      />
    </div>
  );
}

function StatusMessage({ message }: { message: string }) {
  const regex = /"(.*?)"/g;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard", {
        position: "bottom-right",
      });
    });
  };

  const formattedMessage = message.split(regex).map((part, index) => {
    if (message.match(regex) && index % 2 === 1) {
      return (
        <span key={index} className="inline-flex items-center space-x-1">
          <strong className="italic">{part}</strong>
          <button onClick={() => copyToClipboard(part)}>
            <ClipboardIcon className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
          </button>
        </span>
      );
    }
    return part;
  });

  return <p>{formattedMessage}</p>;
}
