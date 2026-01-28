"use client";
import React, { useEffect, useState } from "react";
import { CustomTable } from "@/components/globals/table/custom-table";
import { transactionFetchApi } from "@/lib/endpoints/endpoint";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import CopyText from "@/components/globals/copy-text";
import { BreadCrumbComponent } from "@/components/globals";
import { Card, CardContent } from "@/components/ui/card";
import LoadingPage from "@/components/globals/loading/loading-page";

type Case = {
  createdAt: any;
  _id: string;
  caseManager: string;
  status: any;
  serviceLevel: string;
  received: string;
  caseId: {
    _id: string;
    applications: [];
    caseNo: string;
    caseInfo: {
      caseManager: {};
      serviceLevel: {
        serviceLevel: string;
      };
      serviceType: {
        serviceType: string;
      };
    };
  };
  fromCountry: string;
  toCountry: string;
  transactionId: string;
  amount: number;
  additionalShippingOptions?: { price: number }[];
  transactionType: "refund" | "casepayment" | "extracharge";
};

const AllTransactions = () => {
  const [transactions, SetTransactions] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const getAllTransactions = async () => {
    setLoading(true);
    const response = await transactionFetchApi.getAllTransactionById();
    setLoading(false);
    const sortedTransactions: any = response?.data.sort((a: any, b: any) => {
      return (
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      );
    });

    SetTransactions(sortedTransactions);
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  const calculateTotalAmount = (transaction: Case) => {
    const baseAmount = transaction.amount;
    const additionalShippingTotal = transaction.additionalShippingOptions
      ? transaction.additionalShippingOptions.reduce(
          (total, shipping) => total + shipping.price,
          0
        )
      : 0;
    return baseAmount + additionalShippingTotal;
  };

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => (
        <CopyText
          className="!capitalize"
          text={row?.original?.transactionId?.toUpperCase() || ""}
        />
      ),
    },
    {
      accessorKey: "caseNo",
      header: "Case Number",
      cell: ({ row }) => {
        return (
          <CopyText
            className="!capitalize"
            text={row?.original?.caseId?.caseNo || ""}
          />
        );
      },
    },
    {
      accessorKey: "transactionType",
      header: "Transaction Type",
      cell: ({ row }) => {
        const transactionType = row.original.transactionType;

        switch (transactionType) {
          case "refund":
            return "Refund";
          case "casepayment":
            return "Case";
          case "extracharge":
            return "Extra Service";
          default:
            return "--";
        }
      },
    },
    {
      accessorKey: "serviceType",
      header: "Service Type",
      cell: ({ row }) =>
        row.original.caseId?.caseInfo?.serviceType?.serviceType,
    },
    {
      accessorKey: "serviceLevel",
      header: "Speed of Service",
      cell: ({ row }) =>
        row.original.caseId?.caseInfo?.serviceLevel?.serviceLevel,
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        return (
          <span className={"whitespace-nowrap"}>
            {new Date(row.original.createdAt).toDateString()}
          </span>
        );
      },
    },

    {
      accessorKey: "amount",
      header: "Total Amount",
      cell: ({ row }) => `$${calculateTotalAmount(row?.original).toFixed(2)}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`invoices/${row?.original?.caseId?._id}`}>
          <EyeIcon className="size-5 text-gray-500 hover:text-gray-700" />
        </Link>
      ),
    },
  ];

  return (
    <>
      {transactions && transactions?.length > 0 ? (
        <Card className="w-full">
          <h1 className="text-xl text-slate-600 font-semibold m-4 mb-2 ml-6">
            Invoices
          </h1>

          <CardContent>
            {/* <CaseTable data={cases} /> */}
            <CustomTable
              showSearchBar
              searchKeys={[
                "caseId.caseNo",
                "type",
                "transactionId",
                "transactionType",
              ]}
              columns={columns}
              data={transactions}
              paginate={false}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {loading ? (
            <LoadingPage />
          ) : (
            <div className="flex size-full items-center justify-center text-2xl font-bold text-dark-blue">
              No Invoices !!!
            </div>
          )}
        </>
      )}
    </>
    // <div className="bg-red-100">
    // </div>
  );
};

export default AllTransactions;
