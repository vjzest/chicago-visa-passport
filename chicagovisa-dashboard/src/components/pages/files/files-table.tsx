"use client";

import * as React from "react";
import { Download, Search } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const data = [
  {
    position: 1,
    processingLocation: "Location 1",
    manifest: "Manifest 1",
    name: "John Doe",
    birthDate: "01/01/1990",
    departureDate: "01/01/2024",
    serviceLevel: "Level 1",
    trackingNumber: "123456",
    notes: "Note",
  },
  {
    position: 2,
    processingLocation: "Location 2",
    manifest: "Manifest 2",
    name: "Jane Doe",
    birthDate: "02/02/1991",
    departureDate: "02/02/2024",
    serviceLevel: "Level 2",
    trackingNumber: "654321",
    notes: "Note",
  },
  // Add more data as needed
];

const columns: ColumnDef<(typeof data)[0]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Position
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "processingLocation",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Processing Location
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "manifest",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Manifest
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Name
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Birth Date
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "departureDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Departure Date
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
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
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "trackingNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Tracking Number
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        Notes
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{String(getValue())}</div>
    ),
  },
];

const ManifestTable: React.FC<{ className?: string }> = ({ className }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    },
  });

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((e) => Object.values(e).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "manifest_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={cn("p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-primary text-2xl font-semibold">Manifest</h1>
        <button
          onClick={handleDownload}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <Download className="mr-2" />
          Download
        </button>
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
        <div className="flex flex-col">
          <label htmlFor="manifest" className="mb-1 text-sm font-medium">
            Select manifest
          </label>
          <select
            id="manifest"
            className="rounded-md border border-gray-300 p-2"
          >
            <option>Select Manifest</option>
            {/* Add options here */}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-1 text-sm font-medium">
            Location
          </label>
          <div className="flex items-center rounded-md border border-gray-300">
            <select id="location" className="flex-1 rounded-md p-2">
              <option>Select location</option>
              {/* Add options here */}
            </select>
            <button className="p-2">
              <Search />
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="text-[0.8rem]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup?.headers?.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column?.columnDef?.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                    <TableCell className="text-center" key={cell.id}>
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
    </div>
  );
};

export default ManifestTable;
