"use client";
import { CustomTable } from "@/components/passport/globals/custom-table";
import SortableHeader from "@/components/passport/globals/table/sortable-header";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/services/axios/axios";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import Cell from "@/components/passport/globals/table/cell";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IAdmin } from "@/interfaces/admin.interface";
import CustomAlert from "@/components/passport/globals/custom-alert";
import { useAdminStore } from "@/store/use-admin-store";

type ICaseListing = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  accountDetails: any;
  groupSize: number;
  createdAt: string;
  lastOpened: string;
  status: {
    title: string;
  };
} & any;

const Page = ({ params: { userId } }: { params: { userId: string } }) => {
  const [cases, setCases] = useState<ICaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCases, setSelectedCases] = useState<ICaseListing[]>([]);
  const [caseManagers, setCaseManagers] = useState<IAdmin[]>([]);
  const [selectedCaseManager, setSelectedCaseManager] = useState<IAdmin | null>(
    null
  );
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>(null);
  const refreshStatuses = useAdminStore((state) => state.refreshStatuses);

  const columns: ColumnDef<ICaseListing>[] = [
    {
      id: "checkbox",

      cell: ({ row }) => (
        <Checkbox
          onClick={(e) => e.stopPropagation()}
          checked={
            selectedCases.find(
              (caseItem) => caseItem?.caseId === row.original?.caseId
            )
              ? true
              : false
          }
          onCheckedChange={(value) => {
            if (value) {
              setSelectedCases([...selectedCases, row.original]);
            } else {
              setSelectedCases(
                selectedCases.filter(
                  (caseItem) => caseItem.caseId !== row.original.caseId
                )
              );
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "caseId",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Case Id" />} />
      ),
      cell: ({ row }) => (
        <Cell value={row.original.caseNo} className="uppercase" />
      ),
    },

    {
      accessorKey: "email1",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Email" />} />
      ),
      cell: ({ row }) => (
        <Cell value={<>{row.getValue("email1") as string}</>} />
      ),
    },
    {
      accessorKey: "phone1",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Phone" />} />
      ),
      cell: ({ row }) => {
        return (
          <Cell
            value={
              <div className="text-nowrap text-center">
                {row.getValue("phone1") || `-`}
              </div>
            }
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: (props) => (
        <Cell value={<SortableHeader {...props} title="Status" />} />
      ),
      cell: ({ row }) => {
        return (
          <Cell
            value={
              <span className="text-wrap text-center font-semibold text-primary">
                {row.original?.status}
              </span>
            }
          />
        );
      },
    },

    {
      id: "createdAt",
      header: "Received On",
      cell: ({ row }) => {
        return (
          <span className="whitespace-nowrap">
            {new Date(row?.original?.createdAt).toLocaleString("en-us", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/New_York",
            })}{" "}
          </span>
        );
      },
    },
  ];
  const fetchCases = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/cases/userId/${userId}`);
      if (!data.success) throw new Error(data.message);
      const temp = data.data?.map((item: ICaseListing) => {
        setLoading(false);
        return {
          caseId: item._id,
          ...item.account,
          caseNo: item.caseNo,
          createdAt: item.createdAt,
          status: item.caseInfo?.status?.title,
          accountId: item.account?._id,
          lastOpened: item.lastOpened,
          fullName: `${item.account?.firstName || ""} ${item.account?.middleName || ""} ${item.account?.lastName || ""}`,
        };
      });
      setCases(temp);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCaseManagers = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/admins/case-managers");
      if (!data.success) throw new Error(data.message);

      setCaseManagers(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/statuses");
      if (!data?.success) throw new Error(data?.message);
      setStatuses(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const bulkUpdateCaseManager = async () => {
    try {
      const { data } = await axiosInstance.put(
        "/admin/cases/bulk-update/case-manager",
        {
          caseIds: selectedCases.map((caseItem) => caseItem.caseId),
          caseManagerId: selectedCaseManager?._id,
        }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Bulk updated case manager successfully");
      fetchCases();
      setSelectedCases([]);
      setSelectedCaseManager(null);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't bulk update case manager");
    }
  };
  const bulkUpdateStatus = async () => {
    try {
      const { data } = await axiosInstance.put(
        "/admin/cases/bulk-update/status",
        {
          caseIds: selectedCases.map((caseItem) => caseItem.caseId),
          statusId: selectedStatus?._id,
        }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Bulk updated case status successfully");
      refreshStatuses();
      fetchCases();
      setSelectedCases([]);
      setSelectedStatus(null);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't bulk update case manager");
    }
  };
  useEffect(() => {
    fetchCases();
    fetchCaseManagers();
    fetchStatuses();
  }, []);
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold md:text-2xl">
        Cases {cases.length > 0 ? `of ${cases?.[0].fullName}` : ``}
      </h1>
      <div
        className={`flex gap-2 items-center border py-2 rounded-sm ${selectedCases.length > 0 ? "block" : "hidden"}`}
      >
        <div className={`ml-6 flex w-fit items-center gap-2 `}>
          <label className="w-fit text-nowrap font-semibold" htmlFor="">
            Change CASE STATUS to:
          </label>
          <Select
            onValueChange={(value) => {
              if (!value) return;
              setSelectedStatus(statuses.find((st) => st._id === value)!);
            }}
            value={selectedStatus?._id}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses?.map((st: any) => (
                <SelectItem
                  key={st?._id}
                  value={st?._id}
                >{`${st?.title}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CustomAlert
            TriggerComponent={
              <Button disabled={!selectedStatus} size={"sm"} className="w-fit">
                <Check size={"1rem"} />
              </Button>
            }
            onConfirm={bulkUpdateStatus}
            alertMessage={`Re-assign status as ${selectedStatus?.title} to all the selected cases?`}
            confirmText="Yes"
            cancelText="Cancel"
            alertTitle="Update case status?"
          />
        </div>
        <div className={`ml-6 flex w-fit items-center gap-2 `}>
          <label className="w-fit text-nowrap font-semibold" htmlFor="">
            Change CASE MANAGER to:
          </label>
          <Select
            onValueChange={(value) => {
              if (!value) return;
              setSelectedCaseManager(
                caseManagers.find((cm) => cm._id === value)!
              );
            }}
            value={selectedCaseManager?._id}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select case manager" />
            </SelectTrigger>
            <SelectContent>
              {caseManagers?.map((cm: any) => (
                <SelectItem
                  key={cm?._id}
                  value={cm?._id}
                >{`${cm?.firstName} ${cm?.lastName}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CustomAlert
            TriggerComponent={
              <Button
                disabled={!selectedCaseManager}
                size={"sm"}
                className="w-fit"
              >
                <Check size={"1rem"} />
              </Button>
            }
            onConfirm={bulkUpdateCaseManager}
            alertMessage={`Re-assign case manager ${selectedCaseManager?.firstName} ${selectedCaseManager?.lastName} to all the selected cases?`}
            confirmText="Yes"
            cancelText="Cancel"
            alertTitle="Update case manager?"
          />
        </div>
      </div>
      {loading ? (
        <LoadingPage />
      ) : (
        <CardContent className="p-0">
          <CustomTable
            rowClickable={true}
            data={cases}
            columns={columns}
            showColumnFilter
            showSearchBar
            searchKeys={["email1", "phone1", "fullName", "caseId", "caseId"]}
          />
        </CardContent>
      )}
      <Card className="w-full "></Card>
    </>
  );
};

export default Page;
