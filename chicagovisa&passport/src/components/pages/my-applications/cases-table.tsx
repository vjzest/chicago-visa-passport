import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CustomTable } from "@/components/globals/table/custom-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Case = {
  _id: string;
  caseManager: string;
  status: any;
  serviceLevel: string;
  serviceType: string;
  created: string;
  applicationsCount: number;
  applicantInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
  };
  isCanceled: boolean;
  actionNeeded: boolean;
  applicationReviewStatus: string;
  hasStartedPassportForm: boolean;
  caseNo: string;
  isPassport: boolean;
};

export function CaseTable({ data: initialData }: { data: Case[] }) {
  const [data, setData] = useState<any>({});

  // console.log({ data })

  useEffect(() => {
    const transformedData = initialData?.map((caseItem: any) => ({
      _id: caseItem._id,
      caseManager: `${caseItem?.caseInfo?.caseManager?.firstName} ${caseItem?.caseInfo?.caseManager?.lastName}`,
      status: caseItem?.caseInfo?.status,
      actionNeeded:
        caseItem?.isAccessible &&
        ((caseItem?.reviewStage === "application" &&
          caseItem?.applicationReviewStatus === "pending") ||
          caseItem?.applicationReviewStatus === "rejected" ||
          (caseItem?.reviewStage === "documents" &&
            caseItem?.docReviewStatus === "pending") ||
          caseItem?.docReviewStatus === "rejected"),
      serviceLevel: caseItem?.caseInfo?.serviceLevel?.serviceLevel,
      applicationReviewStatus: caseItem?.applicationReviewStatus,
      applicantName: `${caseItem?.applicantInfo?.firstName} ${caseItem?.applicantInfo?.middleName ?? ""}  ${caseItem?.applicantInfo?.lastName}`,
      serviceType: caseItem?.caseInfo?.serviceType?.serviceType,
      created: new Date(caseItem?.submissionDate).toDateString(),
      applicationsCount: caseItem?.applications?.length,
      fromCountry: caseItem?.caseInfo?.fromCountryCode,
      applications: caseItem?.applications,
      toCountry: caseItem?.caseInfo?.toCountryCode,
      isCanceled: caseItem?.isCanceled || false,
      hasStartedPassportForm: caseItem?.hasStartedPassportForm || false,
      caseNo: caseItem?.caseNo,
      isPassport: caseItem?.caseInfo?.serviceType?.silentKey?.toLowerCase().includes("passport") || false,
    }));

    setData(transformedData);
  }, [initialData]);

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "_id",
      header: "Case ID",
      cell: ({ row }) => (
        <div className="flex items-center uppercase">
          {row?.original?.caseNo}
        </div>
      ),
    },
    {
      accessorKey: "applicantName",
      header: "Applicant",
    },
    {
      accessorKey: "serviceType",
      header: "Service type",
    },
    {
      accessorKey: "serviceLevel",
      header: "Speed of Service",
    },
    {
      accessorKey: "fromCountry",
      header: "From Country",
    },
    {
      accessorKey: "toCountry",
      header: "To Country",
    },
    {
      accessorKey: "created",
      header: "Submitted on",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const basePath = row.original.isPassport ? "/us-passport/dashboard/my-applications" : "/dashboard/my-applications";
        return row.original.actionNeeded ? (
          <Link
            className="flex items-center"
            href={`${basePath}/${row?.original?._id}`}
          >
            <Button size={"sm"}>Continue</Button>
            <span className="ml-4 whitespace-nowrap flex animate-pulse items-center rounded-full font-semibold text-red-500 duration-700">
              <ArrowLeft />
              Action needed!
            </span>
          </Link>
        ) : (
          <Link
            className="flex items-center"
            href={`${basePath}/${row?.original?._id}`}
          >
            <Button size={"sm"}>View</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <CustomTable
          paginate={true}
          pageSize={10}
          searchKeys={["caseNo", "serviceLevel", "_id", "caseManager"]}
          showSearchBar={true}
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
