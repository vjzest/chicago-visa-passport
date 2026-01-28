"use client";
import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTable } from "@/components/globals/custom-table";
import { AdditionalServiceForm } from "./additional-service-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomAlert from "@/components/globals/custom-alert";
import { additionalService } from "@/services/end-points/pass-end-points";

type Addon = {
  subTitle: string;
  price: number;
  _id: string;
};

type AdditionalService = {
  _id: string;
  title: string;
  description: string;
  description2: string;
  price: number;
  serviceTypes: string[];
  addons: Addon[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdditionalServiceProps = {
  additionalServices: AdditionalService[];
  setAdditionalServices:
    | React.Dispatch<React.SetStateAction<AdditionalService[]>>
    | any;
  refetchData: () => void;
};

export function AdditionalServiceTable({
  additionalServices,
  setAdditionalServices,
  refetchData,
}: AdditionalServiceProps) {
  const handleToggleActive = async (id: string) => {
    const response = await additionalService.Active(id);
    setAdditionalServices((prev: any[]) =>
      prev.map((service) =>
        service._id === id
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };
  const handleDelete = async (id: string) => {
    const response = await additionalService.Delete(id);
    setAdditionalServices((prev: any[]) =>
      prev.map((service) =>
        service._id === id
          ? { ...service, isDeleted: !service.isDeleted }
          : service
      )
    );
  };
  const handleEdit = async (data: any) => {
    try {
      const response = await additionalService.Update(data);

      if (response?.data) {
        refetchData();
      } else {
        console.error("Failed to update the service. No data received.");
      }
    } catch (error) {
      console.error("Error updating additional service:", error);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "price", header: "Price" },
      {
        accessorKey: "serviceTypes",
        header: "Service Types",
        cell: ({ row }: { row: { original: AdditionalService } }) => (
          <div>
            {row.original?.serviceTypes?.map(
              (serviceType: any, index: number) => (
                <span key={serviceType._id}>
                  {
                    serviceType?.shortHand /* Assuming visaType has a 'visaTypeName' field */
                  }
                  {index < row.original.serviceTypes.length - 1 && ", "}
                </span>
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: "addons",
        header: "Addons",
        cell: ({ row }: { row: { original: AdditionalService } }) => (
          <div>
            {row.original.addons.length > 0 ? (
              row.original.addons.map((addon: Addon, index: number) => (
                <div key={addon._id} className="mb-1">
                  <span className="font-semibold">{addon.subTitle}:</span> $
                  {addon.price}
                  {index < row.original.addons.length - 1 && (
                    <hr className="my-1" />
                  )}
                </div>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        ),
      },
      // {
      //   accessorKey: "Deleted",
      //   header: "Deleted",
      //   cell: ({ row }: { row: { original: AdditionalService } }) => (
      //     <div
      //       className={`text-center font-semibold ${row.original.isDeleted ? "text-red-500" : "text-green-500"}`}
      //     >
      //       {row.original.isDeleted ? "Yes" : "No"}
      //     </div>
      //   ),
      // },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ row }: { row: { original: AdditionalService } }) => (
          <div
            className={`text-center font-semibold ${row.original.isActive ? "text-green-500" : "text-red-500"}`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: AdditionalService } }) => (
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
                    <AdditionalServiceForm
                      data={row.original}
                      onSubmit={(data: any) =>
                        handleEdit({ ...data, _id: row.original._id })
                      }
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
                alertMessage={`Are you sure you want to ${row.original.isActive ? "deactivate" : "activate"} this Additional Service?`}
                confirmText="Proceed"
              />
              {/* <CustomAlert
                TriggerComponent={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    {row.original.isDeleted ? "Restore" : "Delete"}
                  </DropdownMenuItem>
                }
                onConfirm={() => handleDelete(row.original._id)}
                alertTitle="Confirmation"
                alertMessage={`Are you sure you want to ${row.original.isDeleted ? "restore" : "delete"} this Additional Service?`}
                confirmText="Proceed"
              /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleToggleActive, handleDelete]
  );

  return (
    <div>
      <CustomTable
        paginate={false}
        columns={columns}
        data={additionalServices}
      />
    </div>
  );
}

export default AdditionalServiceTable;
