"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddressForm } from "@/components/pages/shipping/address-form";
import React from "react";
import CustomAlert from "@/components/globals/custom-alert";
import {
  ToggleShippingAddressStatus,
  UpdateShippingAddress,
} from "@/services/end-points/end-point";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CustomTable } from "@/components/globals/custom-table";
import Cell from "@/components/globals/table/cell";

export type Address = {
  _id: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  instruction?: string;
  isActive: boolean;
  isDeleted: boolean;
};

type AddressTableProps = {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  refetch: () => void;
};

export function AddressTable({
  addresses,
  setAddresses,
  refetch,
}: AddressTableProps) {
  const handleEdit = async (updatedAddress: Address) => {
    try {
      const updated: Address = { ...updatedAddress, isActive: true };
      await UpdateShippingAddress(updated);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = React.useCallback(async (id: string) => {
    try {
      await ToggleShippingAddressStatus(id);
      setAddresses((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (error) {
      console.error("Error toggling promo code active state:", error);
    }
  }, []);

  const columns: ColumnDef<Address>[] = [
    {
      accessorKey: "locationName",
      header: () => <Cell value={"Location Name"} />,
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "authorisedPerson",
      header: () => <Cell value={"Authorized Person"} />,
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "state",
      header: "State",
    },
    {
      accessorKey: "zipCode",
      header: () => <Cell value={"Zip Code"} />,
    },
    {
      accessorKey: "instruction",
      header: "Instruction",
      cell: ({ row }) => {
        const instruction = row?.original?.instruction;
        return (
          <div className="text-center">
            {instruction ? instruction : "- - -"}
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
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <div
            className={`text-center font-semibold ${
              isActive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
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
                  <AddressForm
                    initialValues={row.original}
                    onSubmit={(formData) => handleEdit(formData)}
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
                  {row?.original?.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              }
              onConfirm={() => handleToggleActive(row.original._id)}
              alertTitle="Confirmation"
              alertMessage={`Are you sure you want to ${
                row?.original?.isActive ? "deactivate" : "activate"
              } this Shipping Address?`}
              confirmText="Proceed"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <CustomTable
      paginate={false}
      columns={columns}
      data={addresses}
      showColumnFilter={true}
      showSearchBar={true}
      searchKeys={[
        "company",
        "state",
        "zipCode",
        "locationName",
        "authorisedPerson",
        "city",
        "address",
        "authorisedPerson",
      ]}
    />
  );
}
