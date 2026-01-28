"use client";
import { CustomTable } from "@/components/globals/custom-table";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/services/axios/axios";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Eye, Loader2 } from "lucide-react";
import Tooltip2 from "@/components/ui/tooltip-2";
import AdvancedSearch from "@/components/globals/table/advanced-search";
import { toast } from "sonner";

import LoadingPage from "@/components/globals/LoadingPage";
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
import CustomAlert from "@/components/globals/custom-alert";
import { Switch } from "@/components/ui/switch";
import SortableHeader from "@/components/globals/table/sortable-header";
import { IStatus } from "@/interfaces/status.interface";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/store/use-admin-store";
import Cell from "@/components/globals/table/cell";

type ICaseListing = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  accountDetails: any;
  createdAt: string;
  lastOpened: string;
  status: {
    title: string;
  };
} & any;
type IAccountListing = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  caseCount: number;
  createdAt: string;
} & any;

type IFilter = {
  startDate: string;
  endDate: string;
  fullName: string;
  caseId: string;
  phone: string;
  email: string;
  lastFourOfCC: string;
  applicantName: string;
};

const Page = ({ params: { statusId } }: { params: { statusId: string } }) => {
  const [viewSingle, setViewSingle] = useState(true);
  const [cases, setCases] = useState<ICaseListing[]>([]);
  const [accounts, setAccounts] = useState<IAccountListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCases, setTotalCases] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [selectedCases, setSelectedCases] = useState<ICaseListing[]>([]);
  const [caseManagers, setCaseManagers] = useState<IAdmin[]>([]);
  const [selectedCaseManager, setSelectedCaseManager] = useState<IAdmin | null>(
    null
  );
  const [statusTitle, setStatusTitle] = useState("");
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>(null);
  const { storeStatuses, refreshStatuses } = useAdminStore((state) => ({
    storeStatuses: state.statuses,
    refreshStatuses: state.refreshStatuses,
  }));
  const originalCaseColumns: ColumnDef<ICaseListing>[] = [
    {
      id: "checkbox",
      header: (props) => {
        return (
          <Checkbox
            className="hover:scale-[1.8]"
            onClick={(e) => e.stopPropagation()}
            checked={
              // row.getIsSelected() &&
              selectedCases.length === cases.length && cases.length > 0
            }
            onCheckedChange={(value) => {
              if (value) {
                setSelectedCases(cases);
              } else {
                setSelectedCases([]);
              }
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          className="hover:scale-[1.8]"
          onClick={(e) => e.stopPropagation()}
          checked={
            // row.getIsSelected() &&
            selectedCases.find((caseItem) => {
              return caseItem?.caseId === row.original?.caseId;
            })
              ? true
              : false
          }
          onCheckedChange={(value) => {
            if (value) {
              setSelectedCases((prev) => [...prev, row.original]);
            } else {
              setSelectedCases((prev) =>
                prev.filter(
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
      accessorKey: "caseNo",
      id: "Case ID",
      header: ({ column }) => (
        <SortableHeader column={column}>Case ID</SortableHeader>
      ),
      cell: ({ row }) =>
        row.original.groupSize > 1 ? (
          <Cell
            value={<span>{row.original.caseNo}</span>}
            className="uppercase"
          />
        ) : (
          <Cell value={row.original.caseNo} className="uppercase" />
        ),
    },
    {
      accessorKey: "caseManager",
      id: "Case Manager",
      header: ({ column }) => (
        <SortableHeader column={column}>Case Manager</SortableHeader>
      ),
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original?.caseManager?.firstName} ${row.original?.caseManager?.lastName}`}
        />
      ),
    },
    {
      accessorKey: "name",
      id: "Applicant",
      header: ({ column }) => (
        <SortableHeader column={column}>Applicant</SortableHeader>
      ),
      cell: ({ row }) => {
        const nameValue =
          !row.original.firstName?.trim() &&
            !row.original.middleName?.trim() &&
            !row.original.lastName?.trim()
            ? "- - -"
            : `${row.original.firstName} ${row.original.middleName || ""} ${row.original.lastName}`;
        return nameValue.length > 40 ? (
          <Tooltip2 text={nameValue}>
            <Cell textWrap value={`${nameValue.substring(0, 40)}...`} />
          </Tooltip2>
        ) : (
          <Cell textWrap value={nameValue} />
        );
      },
    },
    {
      accessorKey: "createdAt",
      id: "Received On",
      header: ({ column }) => (
        <SortableHeader column={column}>Received On</SortableHeader>
      ),
      cell: ({ row }) => {
        return (
          <span className="whitespace-nowrap">
            {new Date(row?.original?.createdAt).toLocaleString("en-us", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/New_York",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "serviceType",
      id: "Service Type",
      header: ({ column }) => (
        <SortableHeader column={column}>Service Type</SortableHeader>
      ),
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original.serviceType ? row.original.serviceType + (row.original.hasPassportCard ? "*" : "") : "- - -"}`}
        />
      ),
    },
    {
      accessorKey: "serviceLevel",
      id: "Service Level",
      header: ({ column }) => (
        <SortableHeader column={column}>Service Level</SortableHeader>
      ),
      cell: ({ row }) => (
        <Cell textWrap value={`${row.original.serviceLevel || "- - -"}`} />
      ),
    },
    {
      accessorKey: "paymentMethod",
      id: "Payment Method",
      header: ({ column }) => (
        <SortableHeader column={column}>Payment Method</SortableHeader>
      ),
      cell: ({ row }) => {
        const pm = row.original.paymentMethod;
        const isOffline = row.original.isOfflineLink || row.original.deviceInfo?.isOfflineLink;
        return <Cell textWrap value={`${pm || (isOffline ? "Offline" : "Online")}`} />;
      },
    },
    {
      accessorKey: "processingLocation",
      id: "Location",
      header: ({ column }) => (
        <SortableHeader column={column}>Location</SortableHeader>
      ),
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original.processingLocation || "- - -"}`}
        />
      ),
    },

    {
      accessorKey: "status",
      id: "Status",
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
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
  ];
  const currentStatus = useMemo(() => {
    return storeStatuses.find((status: IStatus) => status._id === statusId);
  }, [storeStatuses, statusId]);

  useEffect(() => {
    if ((currentStatus?.caseCount ?? 0) < cases.length) refreshStatuses();
  }, [cases.length, currentStatus]);

  const accountColumns: ColumnDef<IAccountListing>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <SortableHeader column={column}>User</SortableHeader>
      ),
      cell: ({ row }) => (
        <Cell
          value={`${row.original.firstName} ${row.original.middleName || ""} ${row.original.lastName}`}
        />
      ),
    },
    {
      accessorKey: "email1",
      header: ({ column }) => (
        <SortableHeader column={column}>Email</SortableHeader>
      ),
      cell: ({ row }) => <Cell value={row.getValue("email1")} />,
    },
    {
      accessorKey: "phone1",
      header: ({ column }) => (
        <SortableHeader column={column}>Phone</SortableHeader>
      ),
      cell: ({ row }) => {
        return <Cell value={row.getValue("phone1") || `-`} />;
      },
    },
    {
      accessorKey: "caseCount",
      header: ({ column }) => (
        <SortableHeader column={column}>Case count</SortableHeader>
      ),
      cell: ({ row }) => {
        return <Cell value={row.getValue("caseCount") || `-`} />;
      },
    },

    {
      id: "caseId",
      header: () => <Cell value={"Actions"} />,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center ">
            <Link href={`cases/user/${row?.original?.accountId}`}>
              <Tooltip2 text={"View case details"}>
                <Eye className="size-5 cursor-pointer text-muted-foreground" />
              </Tooltip2>
            </Link>
          </div>
        );
      },
    },
  ];

  const fetchAndSetStatusTitle = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/statuses/" + statusId);
      setStatusTitle(data?.data?.title);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupedAccounts = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases/group-by-accounts?page=${currentPage}&statusId=${statusId}&pageSize=${pageSize}`
      );
      if (!data.success) throw new Error(data.message);
      const temp = data.data?.accounts?.map((item: ICaseListing) => {
        setLoading(false);
        return {
          ...item,
          fullName: `${item.firstName} ${item.middleName || ""} ${item.lastName}`,
          accountId: item.account?._id,
        };
      });
      setAccounts(temp);
      setTotalAccounts(data.data?.totalAccounts);
      setSelectedCases([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases?page=${currentPage}&statusId=${statusId}&pageSize=${pageSize}`
      );
      if (!data.success) throw new Error(data.message);

      setTotalCases(data?.data?.totalCases);
      const temp = data.data?.cases.map((item: ICaseListing) => ({
        caseId: item._id,
        ...item.applicantInfo,
        email1: item.contactInformation?.email1,
        phone1: item.contactInformation?.phone1,
        caseNo: item.caseNo,
        caseManager: item.caseInfo?.caseManager,
        processingLocation: item.caseInfo?.processingLocation?.locationName,
        createdAt: item.createdAt,
        status: item.caseInfo?.status?.title,
        serviceType: item.caseInfo?.serviceType?.serviceType,
        serviceLevel: item.caseInfo?.serviceLevel?.serviceLevel,
        lastOpened: item.lastOpened,
        hasPassportCard: item.hasPassportCard,
        paymentMethod: item.paymentMethod,
        isOfflineLink: item.isOfflineLink,
        deviceInfo: item.deviceInfo,
      }));
      setCases(temp);
      if (temp.length) setSelectedCases([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchFilteredCases = async (filters: IFilter) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/admin/cases/filter`, {
        params: { ...filters, page: currentPage, pageSize, statusId },
      });
      if (!data.success) throw new Error(data.message);
      let matchingStatus: null | { title: string };
      const temp = data.data?.map((item: ICaseListing) => {
        const { status, subStatus1, subStatus2 } = item?.caseInfo;

        if (subStatus1?._id === statusId) matchingStatus = subStatus1;
        else if (subStatus2?._id === statusId) matchingStatus = subStatus2;
        else matchingStatus = status;
        return {
          caseId: item._id,
          ...item.applicantInfo,
          email1: item.contactInformation?.email1,
          phone1: item.contactInformation?.phone1,
          caseManager: item.caseInfo?.caseManager,
          processingLocation: item.caseInfo?.processingLocation?.locationName,
          caseNo: item.caseNo,
          createdAt: item.createdAt,
          status: matchingStatus?.title,
          serviceType: item.caseInfo?.serviceType?.serviceType,
          serviceLevel: item.caseInfo?.serviceLevel?.serviceLevel,
          accountId: item.account?._id,
          lastOpened: item.lastOpened,
          hasPassportCard: item.hasPassportCard,
          paymentMethod: item.paymentMethod,
          isOfflineLink: item.isOfflineLink,
          deviceInfo: item.deviceInfo,
        };
      });
      setCases(temp);
      setSelectedCases([]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to filter cases");
    } finally {
      setLoading(false);
    }
  };
  const fetchCaseManagers = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/admins/case-managers?listInDropdown=true"
      );
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
      setStatuses(data?.data.filter((status: any) => status.level === 1));
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
    fetchCaseManagers();
    fetchStatuses();
    fetchAndSetStatusTitle();
  }, []);
  useEffect(() => {
    if (viewSingle) {
      fetchCases();
    } else {
      fetchGroupedAccounts();
    }
  }, [currentPage, pageSize, viewSingle]);

  useEffect(() => {
    if (selectedCases.length === 0) {
      setSelectedStatus(null);
      setSelectedCaseManager(null);
    }
  }, [selectedCases.length]);
  return (
    <>
      <h1 className="mb-6 text-xl md:text-2xl font-semibold">
        Cases{" "}
        {statusTitle && (
          <>
            in <span className="text-deep-blue">{statusTitle}</span>
          </>
        )}
      </h1>
      {viewSingle && (
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
              value={selectedStatus?._id ?? ""}
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
                <Button
                  disabled={!selectedStatus}
                  size={"sm"}
                  className="w-fit"
                >
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
              value={selectedCaseManager?._id ?? ""}
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
      )}
      <CardContent className="p-0">
        {viewSingle && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-end px-4 pt-2">
              <Link href="/crm-reports">
                <Button variant="secondary" className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                  <Eye className="w-4 h-4" />
                  Go to CRM Advanced Reporting
                </Button>
              </Link>
            </div>
            <AdvancedSearch
              clearFunction={fetchCases}
              searchFunction={fetchFilteredCases}
            />
          </div>
        )}
        {viewSingle && <div className="w-full border my-2"></div>}
        {loading ? (
          <Loader2 className="animate-spin size-12 mx-auto mt-[20vh] text-deep-blue mb-[40vh]" />
        ) : (
          <>
            <div className="flex items-center gap-16">
              <div className="flex gap-2 items-center">
                <span className="font-medium text-base">View Grouped</span>
                <Switch
                  checked={!viewSingle}
                  onCheckedChange={() => {
                    setViewSingle((prev) => !prev);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium text-base">Page Size</span>
                <select
                  className="px-3 py-1 bg-slate-50 border"
                  value={String(pageSize)}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {/* //options 20, 30, 40, 50 */}
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium text-base">Total Cases</span>
                <Badge className="text-base rounded-sm">{totalCases}</Badge>
              </div>
            </div>
            <div style={{ zoom: 0.95 }}>
              <CustomTable
                statusId={statusId}
                filterCols={true}
                rowClickable={true}
                viewSingle={viewSingle}
                data={viewSingle ? cases : accounts}
                columns={viewSingle ? originalCaseColumns : accountColumns}
                showColumnFilter
                customPagination={{
                  currentPage,
                  onPageChange: setCurrentPage,
                  total: viewSingle ? totalCases : totalAccounts,
                  pageSize: pageSize,
                }}
              />
            </div>
          </>
        )}
      </CardContent>
      <Card className="w-full "></Card>
    </>
  );
};

export default Page;
