"use client";
import CustomAlert from "@/components/globals/custom-alert";
import { CustomTable } from "@/components/globals/custom-table";
import Cell from "@/components/globals/table/cell";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IAdmin } from "@/interfaces/admin.interface";
import Tooltip2 from "@/components/ui/tooltip-2";
import { TooltipProvider } from "@/components/ui/tooltip";
import axiosInstance from "@/services/axios/axios";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type IStatus = {
  _id: string;
  title: string;
  level: number;
};

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
  caseId: string;
  caseNo: string;
  caseManager: any;
  processingLocation: string;
  serviceType: string;
  serviceLevel: string;
  hasPassportCard: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactInformation?: {
    email1?: string;
    phone1?: string;
  };
  caseInfo?: {
    caseManager?: IAdmin;
    processingLocation?: { locationName?: string };
    status?: IStatus;
    serviceType?: { serviceType?: string };
    serviceLevel?: { serviceLevel?: string };
  };
  applicantInfo?: any;
  groupSize?: number;
} & any;

export default function CasesDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<ICaseListing[]>([]);
  const [filteredCases, setFilteredCases] = useState<ICaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [selectedCases, setSelectedCases] = useState<ICaseListing[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>(null);
  const [selectedCaseManager, setSelectedCaseManager] = useState<IAdmin | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [caseManagers, setCaseManagers] = useState<IAdmin[]>([]);
  const [caseGraph, setCaseGraph] = useState<Record<string, number>>({});
  const [totalActive, setTotalActive] = useState(0);

  const originalCaseColumns: ColumnDef<ICaseListing>[] = [
    {
      id: "checkbox",
      header: (props) => {
        return (
          <Checkbox
            className="hover:scale-[1.8]"
            onClick={(e) => e.stopPropagation()}
            checked={selectedCases.length === cases.length && cases.length > 0}
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
      header: (props) => <Cell value={<Cell value="Case ID" />} />,
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
      header: (props) => <Cell value="Case Manager" />,
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original?.caseManager?.firstName} ${row.original?.caseManager?.lastName}`}
        />
      ),
    },
    {
      accessorKey: "name",
      header: (props) => <Cell value="Applicant" />,
      cell: ({ row }) => {
        const nameValue =
          !row.original.firstName?.trim() &&
            !row.original.middleName?.trim() &&
            !row.original.lastName?.trim()
            ? "- - -"
            : `${row.original.firstName} ${row.original.middleName || ""} ${row.original.lastName}`;
        return nameValue.length > 40 ? (
          <TooltipProvider>
            <Tooltip2 text={nameValue}>
              <Cell textWrap value={`${nameValue.substring(0, 40)}...`} />
            </Tooltip2>
          </TooltipProvider>
        ) : (
          <Cell textWrap value={nameValue} />
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
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "serviceType",
      header: (props) => <Cell value="Service Type" />,
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original.serviceType ? row.original.serviceType + (row.original.hasPassportCard ? "*" : "") : "- - -"}`}
        />
      ),
    },
    {
      accessorKey: "serviceLevel",
      header: (props) => <Cell value="Service Level" />,
      cell: ({ row }) => (
        <Cell textWrap value={`${row.original.serviceLevel || "- - -"}`} />
      ),
    },
    {
      accessorKey: "processingLocation",
      header: (props) => <Cell value="Location" />,
      cell: ({ row }) => (
        <Cell
          textWrap
          value={`${row.original.processingLocation || "- - -"}`}
        />
      ),
    },
    {
      accessorKey: "status",
      header: (props) => <Cell value={<Cell value="Status" />} />,
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

  const fetchCaseManagers = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/admins/case-managers?listInDropdown=true"
      );
      if (!data.success) throw new Error(data.message);
      setCaseManagers(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch case managers");
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/statuses?onlyAllowed=true"
      );
      if (!response.data.data) throw new Error("No status data found");

      const filteredStatuses = response.data.data.filter(
        (status: IStatus) => status.level === 1
      );

      setStatuses(filteredStatuses);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch statuses");
    }
  };

  const fetchCases = async () => {
    setLoading(true);
    try {
      // Extract query parameters
      const isCrm = searchParams.get("crm") === "true";
      const queryObj: any = {};

      if (isCrm) {
        // CRM Fields mapping
        const crmFields = [
          "customerName", "email", "phone", "gender", "ageGroup", "exactAge",
          "dob", "country", "state", "city", "zipCode",
          "orderId", "website", "serviceType", "visaCountry", "visaType",
          "expediteTier", "slaStatus",
          "totalOrderValueMin", "totalOrderValueMax", "refundAmount",
          "promoCode", "creditCardType", "paymentStatus", "paymentProcessor",
          "orderDateFrom", "orderDateTo", "paymentDate", "docSubmissionDate",
          "issuedDate", "shippingDate", "deliveryDate", "slaDeadline",
          "acquisitionSource", "campaign", "landingPage", "deviceType",
          "browser", "os", "courier", "courierLocation", "govOffice",
          "qaStatus", "reworkNeeded", "reworkReason",
          "ticketStatus", "ticketReason", "resolutionTime", "csatScore", "npsScore",
          "keywords", "staffAgent", "repeatCustomer", "clvMin", "clvMax", "fraudFlag"
        ];

        crmFields.forEach(field => {
          if (searchParams.has(field)) {
            const val = searchParams.get(field);
            // Convert numbers and booleans back if needed (backend treats them or we pass as strings?)
            // Usually form sends strings in URL, we pass them to API.
            queryObj[field] = val;
          }
        });

        queryObj.orderStatus = searchParams.getAll("orderStatus");
      } else {
        // Basic filters for non-CRM search
        if (searchParams.has("startDate"))
          queryObj.startDate = searchParams.get("startDate");
        if (searchParams.has("endDate"))
          queryObj.endDate = searchParams.get("endDate");
        if (searchParams.has("startTime"))
          queryObj.startTime = searchParams.get("startTime");
        if (searchParams.has("endTime"))
          queryObj.endTime = searchParams.get("endTime");
        if (searchParams.has("caseId"))
          queryObj.caseId = searchParams.get("caseId");
        if (searchParams.has("phone")) queryObj.phone = searchParams.get("phone");
        if (searchParams.has("email")) queryObj.email = searchParams.get("email");
        if (searchParams.has("lastFourOfCC"))
          queryObj.lastFourOfCC = searchParams.get("lastFourOfCC");
        if (searchParams.has("applicantName"))
          queryObj.applicantName = searchParams.get("applicantName");

        // Arrays
        queryObj.statuses = searchParams.getAll("statuses");
        queryObj.processingLocations = searchParams.getAll("processingLocations");
      }

      // If no parameters, redirect back to search
      if (
        Object.keys(queryObj).length === 0 ||
        (!isCrm && (queryObj.statuses?.length === 0 || queryObj.processingLocations?.length === 0))
      ) {
        toast.error("Invalid search parameters");
        router.push("/search");
        return;
      }

      const endpoint = isCrm ? "/admin/reports/crm-reports" : "/admin/cases/filter-all-cases";
      const { data } = await axiosInstance.post(
        endpoint,
        queryObj
      );

      if (!data.success) throw new Error(data.message);

      // setStatusFilter("");
      const temp = data.data?.map((item: any) => {
        // Defensive mapping to handle differences between global search and CRM report responses
        const caseInfo = item.caseInfo || {};
        const applicantInfo = item.applicantInfo || {};
        const contactInfo = item.contactInformation || {};

        // Normal search uses nested caseInfo.caseManager object
        // CRM reports might use flattened data or direct properties
        let cm = caseInfo.caseManager || item.caseManager;
        if (typeof cm === "string") {
          const parts = cm.trim().split(/\s+/);
          cm = {
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
          };
        }

        // Applicant Name fallback (CRM often has customerName)
        const firstName = applicantInfo.firstName || item.firstName || item.customerName?.trim().split(/\s+/)[0] || "";
        const lastName = applicantInfo.lastName || item.lastName || item.customerName?.trim().split(/\s+/).slice(1).join(" ") || "";
        const middleName = applicantInfo.middleName || item.middleName || "";

        return {
          caseId: item._id,
          ...applicantInfo,
          email1: contactInfo.email1 || item.email,
          phone1: contactInfo.phone1 || item.phone,
          caseNo: item.caseNo || item.orderId,
          caseManager: cm,
          processingLocation: caseInfo.processingLocation?.locationName || item.processingLocation || item.location,
          createdAt: item.createdAt,
          status: caseInfo.status?.title || item.status || item.orderStatus || "New",
          serviceType: caseInfo.serviceType?.serviceType || item.serviceType,
          serviceLevel: caseInfo.serviceLevel?.serviceLevel || item.serviceLevel,
          lastOpened: item.lastOpened || item.updatedAt || item.createdAt, // Fallback for row color logic
          hasPassportCard: item.hasPassportCard,
          firstName,
          middleName,
          lastName,
          groupSize: item.groupSize || 1,
        };
      });

      setCases(temp);
      setFilteredCases(temp);

      // Build case graph for status counts
      const caseGraphTemp: Record<string, number> = {};
      let tempTotalActive = 0;
      temp.forEach((item: ICaseListing) => {
        if (
          item.status !== "Complete Not Processed" &&
          item.status !== "Contingent" &&
          item.status !== "Voided"
        )
          tempTotalActive++;
        if (caseGraphTemp[item.status]) {
          caseGraphTemp[item.status] += 1;
        } else {
          caseGraphTemp[item.status] = 1;
        }
      });
      setTotalActive(tempTotalActive);
      setCaseGraph(caseGraphTemp);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cases");
    } finally {
      setLoading(false);
      scrollTo(0, 0);
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
      fetchCases();
      setSelectedCases([]);
      setSelectedStatus(null);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't bulk update case status");
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

  // Function to handle redirecting to search page with current filters
  const handleEditFilters = () => {
    // Get the current URL search params and pass them to the search page
    const currentParams = searchParams.toString();
    router.push(`/search?${currentParams}`);
  };

  useEffect(() => {
    fetchStatuses();
    fetchCaseManagers();
    fetchCases();
  }, [searchParams]);

  useEffect(() => {
    if (!statusFilter) setFilteredCases(cases);
    else if (statusFilter === "active") {
      setFilteredCases(
        cases.filter(
          (el: ICaseListing) =>
            el.status !== "Complete Not Processed" &&
            el.status !== "Contingent" &&
            el.status !== "Voided"
        )
      );
    } else {
      setFilteredCases(
        cases.filter((el: ICaseListing) => el.status === statusFilter)
      );
    }
  }, [statusFilter, cases]);

  useEffect(() => {
    const statusFilterInSession = sessionStorage.getItem("case-filter-status");
    setStatusFilter(statusFilterInSession || "");
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-base md:text-2xl font-semibold">Search Results</h1>
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
        <div className="flex gap-2">
          <Button size={"sm"} onClick={handleEditFilters} variant={"outline"}>
            Edit filters
          </Button>
        </div>
      </div>

      {cases.length > 0 ? (
        <>
          <Card className="p-4 mt-3">
            <CardTitle className="mb-2 text-base font-medium">
              Search Overview
            </CardTitle>
            <div className="flex flex-wrap md:grid md:grid-cols-4 gap-6">
              <Card
                onClick={() => {
                  setStatusFilter("");
                  sessionStorage.setItem("case-filter-status", "");
                }}
                className={`${statusFilter === "" ? " shadow-deep-blue border-deep-blue bg-sky-50" : ""} cursor-pointer border-2 px-3 py-1 flex justify-between rounded-sm`}
              >
                <span className="font-semibold uppercase mr-2">Total</span>
                <span className="font-semibold">{cases.length}</span>
              </Card>
              <Card
                onClick={() => {
                  setStatusFilter("active");
                  sessionStorage.setItem("case-filter-status", "active");
                }}
                className={`${statusFilter === "active" ? " shadow-deep-blue border-deep-blue bg-sky-50" : ""} cursor-pointer border-2 px-3 py-1 flex justify-between rounded-sm`}
              >
                <span className="font-semibold uppercase mr-2">
                  Total Active
                </span>
                <span className="font-semibold">{totalActive}</span>
              </Card>
              {Object.entries(caseGraph)
                .sort(([keyA, valueA], [keyB, valueB]) => {
                  if (
                    keyA === "Complete Not Processed" ||
                    keyA === "Contingent" ||
                    keyA === "Voided"
                  )
                    return -1;
                  else return 1;
                })
                .map(([key, value]) => {
                  return (
                    <Card
                      onClick={() => {
                        if (statusFilter === key) {
                          setStatusFilter("");
                          sessionStorage.setItem("case-filter-status", "");
                        } else {
                          setStatusFilter(key);
                          sessionStorage.setItem("case-filter-status", key);
                        }
                      }}
                      key={key}
                      className={`${statusFilter === key ? " shadow-deep-blue border-deep-blue bg-sky-50" : ""} border-2 transition-all cursor-pointer px-3 hover:bg-slate-100 py-1 flex justify-between rounded-sm`}
                    >
                      <span className="mr-2">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </Card>
                  );
                })}
            </div>
          </Card>
          <CustomTable
            data={filteredCases}
            rowClickable={true}
            paginate={false}
            columns={originalCaseColumns}
          />
        </>
      ) : (
        <p className="w-full my-[30vh] text-center font-medium text-lg text-slate-400">
          No results found
        </p>
      )}
    </>
  );
}
