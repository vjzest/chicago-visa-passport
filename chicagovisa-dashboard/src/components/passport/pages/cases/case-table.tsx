"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export type Case = {
  _id: string;
  last_edit: string;
  case_number: string;
  case_manager: string;
  name: string;
  received: string;
  service_level: string;
  status: {
    main_status: string;
    sub_status: string;
    sub_status_2: string;
  };
  status_date: string;
  phone_number?: string;
  additional_info: {
    service_type: string;
  };
};

export function CaseTable({ data: initialData }: { data: Case[] }) {
  const [data, setData] = React.useState<Case[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  React.useEffect(() => {
    const filteredData =
      statusFilter === "All"
        ? initialData
        : initialData.filter(
            (caseItem) => caseItem.status.sub_status === statusFilter
          );
    setData(filteredData);
  }, [statusFilter, initialData]);

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "applicantInfo",
      header: "Name",
      cell: ({ row }) => {
        const applicantInfo = row.getValue("applicantInfo") as {
          firstName: string;
          middleName: string;
          lastName: string;
        };
        const { firstName, lastName } = applicantInfo;
        return <>{firstName + " " + lastName}</>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <>{new Date(row.getValue("createdAt")).toDateString()}</>
      ),
    },
    {
      accessorKey: "applicantInfo",
      header: "Date of birth",
      cell: ({ row }) => {
        const applicantInfo = row.getValue("applicantInfo") as {
          dateOfBirth: string;
        };

        return <>{new Date(applicantInfo.dateOfBirth).toDateString()}</>;
      },
    },
    {
      accessorKey: "applicantInfo",
      header: "Email",
      cell: ({ row }) => {
        const applicantInfo = row.getValue("applicantInfo") as {
          email: string;
        };
        return <>{applicantInfo.email}</>;
      },
    },
    {
      accessorKey: "applicantInfo",
      header: "Phone",
      cell: ({ row }) => {
        const applicantInfo = row.getValue("applicantInfo") as {
          phoneNumber: string;
        };
        return <>{applicantInfo.phoneNumber}</>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center justify-center text-2xl">
              ...
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(row.original.case_number)
              }
            >
              Copy Case Number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`cases/${row.original._id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View Details
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, columnId, value) => {
      const searchableFields = ["name", "case_number", "phone_number"];
      const matchesSearch = searchableFields.some((field) =>
        String(row.getValue(field)).toLowerCase().includes(value.toLowerCase())
      );
      return matchesSearch;
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 py-4">
        <div className="w-2/3">
          <Input
            placeholder="Search by name, case number, or phone number..."
            value={globalFilter ?? ""}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            className="max-w-sm border-2 border-primary"
          />
        </div>
        <div className="w-1/3 flex-col justify-between space-y-3 md:flex md:flex-row md:space-y-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <Button size={"xsm"} variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="first-letter:capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-1/3">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
            }}
          >
            <SelectTrigger className="border-2 border-primary">
              <SelectValue
                className="text-black"
                placeholder="Filter by status"
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="New / Incomplete">New / Incomplete</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
