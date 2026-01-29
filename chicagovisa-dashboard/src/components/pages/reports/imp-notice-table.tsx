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
import { ArrowUpDown, ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import { caseApi } from "@/services/end-points/end-point";
import Tooltip2 from "@/components/ui/tooltip-2";
import Cell from "@/components/globals/table/cell";
import CopyText from "@/components/globals/copy-text";

export type Case = {
  _id: string;
  caseInfo: {
    caseManager: string;
    status: { title: string };
    serviceLevel: string;
  };
  account: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  createdAt: string;
  applications: any[];
};

export function DataTableDemo() {
  const [data, setData] = React.useState<Case[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const getAllNewCase = async () => {
    const allNewCase = await caseApi.getAllNew();
    setData(allNewCase.data);
  };

  React.useEffect(() => {
    getAllNewCase();
  }, []);

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Case Id
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-nowrap items-center gap-2">
          <CopyText text={row?.original?._id} iconPosition="after" />
        </div>
      ),
    },
    {
      accessorKey: "accountDetails.fullName",
      header: "User",
      cell: ({ row }) => {
        const {
          firstName = "",
          middleName = "",
          lastName = "",
        } = row.original?.account || {};
        return (
          <div className="flex flex-nowrap items-center gap-2">
            {`${firstName} ${middleName} ${lastName}`}
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row?.original?.createdAt).toDateString(),
    },

    {
      accessorKey: "caseInfo.serviceLevel.serviceLevel",
      header: "Service Level",
    },
    {
      accessorKey: "caseInfo.status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Cell
            value={
              <span className="text-wrap text-center font-semibold text-primary">
                {row?.original?.caseInfo?.status?.title}
              </span>
            }
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center ">
            <Link href={`cases/${row?.original?._id}`}>
              <Tooltip2 text="View case details">
                <Eye className="size-5 cursor-pointer text-muted-foreground" />
              </Tooltip2>
            </Link>
          </div>
        );
      },
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
    filterFns: {
      custom: (row, columnId, filterValue) => {
        if (filterValue === "all") return true;
        return row.original.caseInfo.status === filterValue;
      },
    },
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      table.getColumn("caseInfo_status")?.setFilterValue(undefined);
    } else {
      table.getColumn("caseInfo_status")?.setFilterValue(value);
    }
  };

  return (
    <div className="w-full">
      {data && (
        <>
          <div className="flex w-full flex-col-reverse items-center gap-3 py-4 sm:flex-row">
            <div className="w-full sm:w-1/3 lg:w-2/3">
              <Input
                placeholder="Search by name or case Id..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="border-2 border-primary"
              />
            </div>
            <div className="flex w-full flex-col justify-between gap-3 sm:w-2/3 sm:flex-row lg:w-1/3">
              <div className="w-full">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="border-2 border-primary">
                    <SelectValue
                      className="text-black"
                      placeholder="Filter by status"
                    ></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-full">
                    <Button
                      size={"xsm"}
                      variant="outline"
                      className="ml-auto flex justify-between px-3"
                    >
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
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
              <TableBody className="w-full overflow-auto">
                {table && table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="">
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
