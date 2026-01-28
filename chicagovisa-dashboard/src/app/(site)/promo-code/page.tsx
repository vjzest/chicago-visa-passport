"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PromoCodeForm from "@/components/pages/promo/add-promo";
import {
  ActivePromoCode,
  CreatePromoCode,
  GetPromoCode,
  updatePromoCode,
} from "@/services/end-points/end-point";
import LoadingPage from "@/components/globals/LoadingPage";
import { toast } from "sonner";
import { getCurrentDateInDC } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "@/components/globals/custom-alert";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/globals/custom-table";

export interface IData {
  _id: string;
  code: string;
  codeType: string;
  discount: string;
  isActive: boolean;
  isDeleted: boolean;
  startDate: string;
  min: number;
  max: number;
  endDate: string;
}
type PromoCodeFormValues = Omit<IData, "active">;

const Page = () => {
  const [promoCodes, setPromoCodes] = useState<IData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    const response = await GetPromoCode();
    if (response?.success) {
      setPromoCodes(response?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (data: IData) => {
    try {
      const newPromoCode = await CreatePromoCode(data);
      setPromoCodes((prevCodes) => [newPromoCode?.data, ...prevCodes]);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "unknown error occurred"
      );
    }
  };
  const handleEdit = async (updatedData: PromoCodeFormValues) => {
    try {
      await updatePromoCode(updatedData);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "unknown error occurred"
      );
    }
  };

  const handleToggleActive = React.useCallback(async (id: string) => {
    try {
      await ActivePromoCode(id);
      fetchData();
    } catch (error) {
      console.error("Error toggling promo code active state:", error);
    }
  }, []);

  const columns: ColumnDef<IData>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Code Name
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">{String(getValue())}</div>
      ),
    },
    {
      accessorKey: "codeType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Type
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center uppercase">{String(getValue())}</div>
      ),
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Discount
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <div className="text-center">
          {row.original.codeType === "flat"
            ? `$${getValue()}`
            : `${getValue()}%`}
        </div>
      ),
    },
    {
      accessorKey: "min",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Min
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">{"$" + String(getValue())}</div>
      ),
    },
    {
      accessorKey: "max",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Max
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">{"$" + String(getValue())}</div>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Start date
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">
          {new Date(getValue() as string).toLocaleString("en-us", {
            dateStyle: "medium",
          })}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          End date
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">
          {new Date(getValue() as string).toLocaleString("en-us", {
            dateStyle: "medium",
          })}
        </div>
      ),
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
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <div
            className={`text-center font-semibold ${
              new Date(row.original.endDate).setHours(0, 0, 0, 0) <
              getCurrentDateInDC().setHours(0, 0, 0, 0)
                ? "text-gray-500"
                : isActive
                  ? "text-green-500"
                  : "text-red-500"
            }`}
          >
            {new Date(row.original.endDate).setHours(0, 0, 0, 0) <
            getCurrentDateInDC().setHours(0, 0, 0, 0)
              ? "Expired"
              : isActive
                ? "Active"
                : "Inactive"}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: ({ column }) => <span>Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex rotate-90 cursor-pointer items-center justify-center text-2xl">
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
                  <PromoCodeForm
                    submitFunction={(formData) => handleEdit(formData)}
                    initialData={row.original}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <CustomAlert
              TriggerComponent={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  {row.original.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              }
              onConfirm={() => handleToggleActive(row.original._id)}
              alertTitle="Confirmation"
              alertMessage={`Are you sure you want to ${
                row.original.isActive ? "deactivate" : "activate"
              } this promo code?`}
              confirmText="Proceed"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="w-full py-4">
            <div className="flex flex-col md:flex-row w-full md:items-center justify-start md:justify-between gap-2 md:gap-0">
              <h1 className="text-xl md:text-2xl font-semibold">Promo codes</h1>
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <div className="flex w-full justify-between ">
                      <Button>Add Promo Code</Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="">
                    <div className="p-2">
                      <PromoCodeForm submitFunction={handleAdd} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <CustomTable paginate={false} data={promoCodes} columns={columns} />
        </>
      )}
    </div>
  );
};

export default Page;
