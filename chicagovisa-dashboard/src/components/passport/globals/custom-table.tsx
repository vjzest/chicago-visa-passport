"use client";

import * as React from "react";
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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { getCurrentDateInDC } from "@/lib/utils";

interface IDataTableDemo {
  columns: ColumnDef<any>[];
  data: any[];
  rowClickable?: boolean;
  viewSingle?: boolean;
  showColumnFilter?: boolean;
  showSearchBar?: boolean;
  searchKeys?: string[];
  title?: string;
  children?: React.ReactNode;
  paginate?: boolean;
  pageSize?: number;
  allowEdit?: boolean;
  filterCols?: boolean;
  statusId?: string;
  customPagination?: {
    total: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}
function getColorBasedOnDate(inputDate: string | Date): string {
  const currentDate = getCurrentDateInDC();
  const givenDate = new Date(inputDate);
  if (isNaN(givenDate.getTime())) {
    return "";
  }
  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
  if (dayDifference < 3) {
    return "bg-green-300";
  } else if (dayDifference < 5) {
    return "bg-orange-300";
  } else {
    return "bg-red-300";
  }
}

export function CustomTable({
  columns,
  data,
  rowClickable = false,
  showColumnFilter = false,
  showSearchBar = false,
  viewSingle = true,
  searchKeys = [],
  children,
  title = "",
  paginate = true,
  pageSize = 20,
  customPagination,
  statusId = "",
  filterCols = false,
}: IDataTableDemo) {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (typeof window !== "undefined") {
      const storedSorting = localStorage.getItem(statusId + "sorting");
      if (storedSorting) {
        return JSON.parse(storedSorting);
      }
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const navigate = useRouter();
  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      return searchKeys.some((key) => {
        const cellValue = row.original[key];

        return cellValue?.toString().toLowerCase().includes(searchValue);
      });
    },
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: paginate ? pageSize : 1000,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  React.useEffect(() => {
    if (statusId) {
      localStorage.setItem(statusId + "sorting", JSON.stringify(sorting));
    }
  }, [sorting, statusId]);

  return (
    <div className="w-full bg-white">
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      <div className="my-2 flex flex-wrap justify-between  gap-3">
        <div className="flex w-full flex-col md:w-auto">
          {showSearchBar && (
            <Input
              placeholder="Search here..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          )}
        </div>
        {showColumnFilter && (
          <div className="flex w-full flex-wrap items-center justify-start gap-3 md:w-fit md:justify-end">
            {children}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"xsm"} variant="outline" className="">
                  Columns <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column?.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => {
                          column.toggleVisibility(!!value);
                          if (!filterCols) return;
                          if (value) {
                            const colStore = localStorage.getItem(
                              statusId + "cols"
                            );
                            localStorage.setItem(
                              statusId + "cols",
                              colStore ? colStore.replace(column.id, "") : ""
                            );
                          } else {
                            const colStore = localStorage.getItem(
                              statusId + "cols"
                            );
                            if (colStore) {
                              localStorage.setItem(
                                statusId + "cols",
                                colStore + column.id
                              );
                            } else {
                              localStorage.setItem(
                                statusId + "cols",
                                column.id
                              );
                            }
                          }
                        }}
                      >
                        {column?.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
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
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (rowClickable)
                      if (viewSingle) {
                        navigate.push(`/cases/${row?.original?.caseId}`);
                        sessionStorage.setItem("case-source", location.href);
                      } else {
                        navigate.push(`/cases/user/${row?.original?._id}`);
                      }
                  }}
                  className={
                    rowClickable
                      ? `cursor-pointer ${getColorBasedOnDate(row.original?.lastOpened)}`
                      : ""
                  }
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
                  {rowClickable ? "No Cases Available" : "No results"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {paginate &&
          data.length > 0 &&
          (customPagination ? (
            <>
              <div className="flex-1 text-sm text-muted-foreground">
                Page {customPagination?.currentPage} of{" "}
                {Math.ceil(
                  customPagination?.total / customPagination?.pageSize
                )}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="xsm"
                  onClick={() =>
                    customPagination.onPageChange(
                      customPagination.currentPage - 1
                    )
                  }
                  disabled={customPagination.currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="xsm"
                  onClick={() =>
                    customPagination.onPageChange(
                      customPagination.currentPage + 1
                    )
                  }
                  disabled={
                    customPagination.currentPage ===
                    Math.ceil(
                      customPagination.total / customPagination.pageSize
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 text-sm text-muted-foreground">
                {table?.getFilteredSelectedRowModel()?.rows?.length} of{" "}
                {table?.getFilteredRowModel()?.rows?.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table?.previousPage()}
                  disabled={!table?.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table?.nextPage()}
                  disabled={!table?.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
