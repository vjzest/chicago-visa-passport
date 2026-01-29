"use client";
import React, { useEffect, useState } from "react";
import { CustomTable } from "@/components/passport/globals/custom-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ServiceLevelForm from "./service-level-form";
import {
  CreateServiceLevel,
  DeleteServiceLevel,
  GetServiceLevels,
  ToggleServiceLevelStatus,
  UpdateServiceLevel,
  visaTypeApi,
} from "@/services/end-points/end-point";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlert from "@/components/passport/globals/custom-alert";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import Cell from "@/components/passport/globals/table/cell";
import ServiceLevelArchiveDialog from "../service-type/service-level-archive-dialog";
import { Switch } from "@/components/ui/switch";

const ServiceColumnLayout = () => {
  const [filteredServiceLevels, setFilteredServiceLevels] = useState<
    IServiceLevel[]
  >([]);
  const [serviceLevels, setServiceLevels] = useState<IServiceLevel[]>([]);
  const [archivedServiceLevels, setArchivedServiceLevels] = useState<
    IServiceLevel[]
  >([]);
  const [open, setOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const addNewService = async (data: any) => {
    try {
      const newService = await CreateServiceLevel(data);

      setServiceLevels((prevLevels) => [...prevLevels, newService?.data]);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    const serviceLevel = await GetServiceLevels();
    const actives: IServiceLevel[] = [];
    const archives: IServiceLevel[] = [];
    serviceLevel?.data?.forEach((el: IServiceLevel) =>
      el.isArchived ? archives.push(el) : actives.push(el)
    );
    setServiceLevels(actives);
    setArchivedServiceLevels(archives);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (updatedData: IServiceLevel) => {
    try {
      const updated: IServiceLevel = { ...updatedData, isActive: true };
      const response = await UpdateServiceLevel(updatedData);
      if (!response) {
        throw new Error("Error updating service level");
      }
      setServiceLevels((prevData) =>
        prevData.map((item) =>
          item._id === updated._id ? response.data : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = React.useCallback(async (id: string) => {
    try {
      await ToggleServiceLevelStatus(id);
      setServiceLevels((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch (error) {
      console.error("Error toggling promo code active state:", error);
    }
  }, []);

  const columns: ColumnDef<IServiceLevel>[] = [
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
          className={`text-center uppercase ${row.original.isArchived ? "text-red-400" : ""}`}
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Price
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{`$${row.getValue("price")}`}</div>
      ),
    },
    {
      accessorKey: "nonRefundableFee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Non Refundable Fee
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{`$${row.getValue("nonRefundableFee")}`}</div>
      ),
    },
    {
      accessorKey: "inboundFee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Inbound Fee
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{`$${row.getValue("inboundFee")}`}</div>
      ),
    },
    {
      accessorKey: "outboundFee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          Outbound Fee
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{`$${row.getValue("outboundFee")}`}</div>
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
      header: () => "AMEX",
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
      accessorKey: "doubleCharge",
      header: ({ column }) => (
        <Button variant="ghost" className="text-center">
          Double Charge
        </Button>
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
                  <ServiceLevelForm
                    submitFunction={(formData) => handleEdit(formData)}
                    initialData={row.original}
                  />
                </div>
              </DialogContent>
            </Dialog>

            {!row.original.isArchived && (
              <>
                <DropdownMenuSeparator />
                <CustomAlert
                  TriggerComponent={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer w-full"
                    >
                      {row.original.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                  }
                  onConfirm={() => handleToggleActive(row.original?._id)}
                  alertTitle="Confirmation"
                  alertMessage={`Are you sure you want to ${
                    row.original.isActive ? "deactivate" : "activate"
                  } this Service Level? ${row.original.isActive ? "This will make the service levels unavailable to the customer for future orders." : ""}`}
                  confirmText="Proceed"
                />
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ServiceLevelArchiveDialog
                refetch={fetchData}
                serviceLevel={row.original}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  useEffect(() => {
    if (showArchived) {
      setFilteredServiceLevels([...serviceLevels, ...archivedServiceLevels]);
    } else {
      setFilteredServiceLevels([...serviceLevels]);
    }
  }, [showArchived, serviceLevels, archivedServiceLevels]);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {" "}
          <div className="mb-4 flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
            <h1 className="text-xl font-semibold md:text-2xl">Service Level</h1>
            <div className="flex flex-col gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="max-w-max">Add New Service Level</Button>
                </DialogTrigger>
                <DialogContent className="">
                  <div className="p-2">
                    <ServiceLevelForm submitFunction={addNewService} />
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex items-center space-x-2">
                <Switch
                  id="archived-mode"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <label htmlFor="archived-mode" className="text-sm font-medium">
                  Show Archived
                </label>
              </div>{" "}
            </div>
          </div>
          <CustomTable
            paginate={false}
            columns={columns}
            data={filteredServiceLevels}
            showColumnFilter={true}
            showSearchBar={true}
            searchKeys={["serviceLevel", "time", "price"]}
          ></CustomTable>
        </>
      )}
    </div>
  );
};

export default ServiceColumnLayout;
