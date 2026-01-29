"use client";
import { RestrictedAccessRoute } from "@/components/globals/Auth/restricted-access-route";
import BreadCrumbComponent from "@/components/globals/breadcrumb";
import CustomAlert from "@/components/globals/custom-alert";
import LoadingPage from "@/components/globals/LoadingPage";
import NotesList2 from "@/components/pages/cases/note-list2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import axiosInstance from "@/services/axios/axios";
import { useAdminStore } from "@/store/use-admin-store";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface ITransaction {
  account: string;
  caseId: string;
  orderId: string;
  serviceFee?: number;
  processingFee?: number;
  govtFee?: number;
  onlineProcessingFee?: string;
  nonVoidableFee?: number;
  amount: number;
  returnedAmount: number;
  refundOrVoidStatus: "none" | "void" | "refund";
  discount?: number;
  status?: "pending" | "success" | "failed";
  transactionId: string;
  transactionId2?: string;
  doubleCharge?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  transactionType:
    | "void"
    | "casepayment"
    | "extracharge"
    | "serviceLevel-void"
    | "serviceLevel-payment";
  description: string;
  paymentProcessor: string;
  authMethod?: any;
}

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [voidNote, setVoidNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const refreshStatuses = useAdminStore((state) => state.refreshStatuses);
  const customBreadcrumbs = [
    { label: "Case Details", link: "/cases/" + caseId },
    { label: "Void", link: null },
  ];

  const fetchCaseDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/cases/caseId/" + caseId);
      if (!data.success) throw new Error(data.message);

      setCaseDetails(data.data?.caseData);
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/admin/transactions/payments/${caseId}`
      );
      if (!data.success) throw new Error(data.message);

      setTransactions(data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
    fetchTransactions();
    scrollTo(0, 0);
  }, []);

  const onConfirmVoid = async (
    transactionId: string,
    isWithoutNRF: boolean
  ) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/admin/payment/void", {
        transactionId,
        voidNote,
        isWithoutNRF,
      });
      fetchCaseDetails();
      fetchTransactions();
      toast.success("Void Processed successfully.");
      refreshStatuses();
    } catch (error: any) {
      toast.error("Failed to process void", {
        description: error?.response?.data?.message ?? "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!caseDetails) {
    return <LoadingPage />;
  }

  const { firstName, middleName, lastName } = caseDetails?.account ?? {};
  let onlineProcessingFee = 0;
  let nonVoidableFee = 0;
  const totalAmount = caseDetails?.caseInfo.invoiceInformation.reduce(
    (acc: number, curr: { service: string; price: number }) => {
      if (curr.service === "Online processing fee") {
        onlineProcessingFee = curr.price;
      }
      if (curr.service === "Non voidable fee") {
        nonVoidableFee = curr.price;
      }
      return (acc += curr.price);
    },
    0
  );

  const casePaymentTransaction = transactions.find(
    (t) => t.transactionType === "casepayment"
  );
  const addonTransactions = transactions.filter(
    (t) =>
      t.transactionType === "extracharge" ||
      t.transactionType === "serviceLevel-payment"
  );

  return (
    <RestrictedAccessRoute section="editCaseDetails" action={"refundAndVoid"}>
      <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
      <h2 className="mb-4 text-2xl font-semibold">Void client</h2>
      <div className="flex flex-col gap-10 rounded border p-5 sm:flex-row">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          {/* Account Info */}
          <div>
            <h2 className="mb-2 text-xl font-semibold tracking-wider">
              Account Details
            </h2>{" "}
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Full name: </span>
                {[firstName, middleName, lastName].filter(Boolean).join(" ")}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {caseDetails?.account?.email1}
              </p>
              <p>
                <span className="font-semibold">Phone: </span>
                {caseDetails?.account?.phone1}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="mb-2 text-xl font-semibold tracking-wider">
              Payment Information
            </h2>

            <p>
              <span className="font-semibold">{`Card Holder's Name : `}</span>{" "}
              {caseDetails?.billingInfo?.cardHolderName}
            </p>
            <p>
              <span className="font-semibold">
                Last 4 Digits of Credit Card :
              </span>{" "}
              {caseDetails?.billingInfo?.cardNumber.slice(-4)}
            </p>
            <p>
              <span className="font-semibold">
                Expiration Date of Credit Card :
              </span>{" "}
              {`${caseDetails?.billingInfo?.expirationDate.slice(0, 2)}/${caseDetails?.billingInfo?.expirationDate.slice(2)}`}
            </p>
          </div>

          {/* Invoice */}
          <Card className="space-y-2 p-4 md:w-3/4 mt-4">
            <h3 className="mb-2 text-center text-base font-semibold">
              Invoice
            </h3>
            {caseDetails.caseInfo.invoiceInformation?.map(
              (service: { service: string; price: number; _id: string }) => (
                <React.Fragment key={service._id}>
                  <div className="grid grid-cols-2">
                    <span className="p-2 tracking-wider">
                      {service.service}
                    </span>
                    <span className="p-2 text-right tracking-wider">
                      {service.price < 0
                        ? "-$" + Math.abs(service.price).toFixed(2)
                        : "$" + service.price.toFixed(2)}{" "}
                    </span>
                  </div>
                </React.Fragment>
              )
            )}
            <Separator />
            <div className="flex justify-between text-sm px-2">
              <span>Total Charged Amount:</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4">
          {/* Case Payment Transaction */}
          {casePaymentTransaction && (
            <Card className="p-4">
              <h3 className="mb-2 text-lg font-semibold">Case Payment</h3>
              <div className="grid grid-cols-2 gap-2">
                <span>Amount charged:</span>
                <span className="text-right">
                  ${casePaymentTransaction.amount.toFixed(2)}
                </span>
                {caseDetails.void.isVoid ? (
                  <>
                    <span>Voided amount</span>
                    <strong className="text-right">
                      ${caseDetails.void.voidAmount?.toFixed(2)}
                    </strong>
                  </>
                ) : (
                  <>
                    <span>Voidable:</span>
                    <span className="text-right">
                      $
                      {Math.max(
                        casePaymentTransaction.amount -
                          casePaymentTransaction.returnedAmount -
                          onlineProcessingFee -
                          nonVoidableFee,
                        0
                      ).toFixed(2)}
                    </span>
                    <span>Status:</span>
                    <span
                      className={cn("text-right", {
                        "text-red-500":
                          casePaymentTransaction.refundOrVoidStatus !== "none",
                      })}
                    >
                      {casePaymentTransaction.refundOrVoidStatus === "none"
                        ? "Not Voided"
                        : casePaymentTransaction.refundOrVoidStatus}
                    </span>
                  </>
                )}
              </div>
              {casePaymentTransaction.refundOrVoidStatus === "none" && (
                <>
                  <textarea
                    value={voidNote}
                    onChange={(e) => setVoidNote(e.target.value)}
                    placeholder="Enter void note here (minimum 5 characters)"
                    className="w-full rounded border p-2 text-sm mt-2"
                    maxLength={500}
                    rows={3}
                    disabled={isLoading}
                  />
                  <div className="w-full flex gap-4 text-right mt-2">
                    <CustomAlert
                      confirmText="Proceed"
                      alertMessage="Are you sure you want to void the case payment? This action cannot be undone."
                      TriggerComponent={
                        <Button
                          className="w-full px-4 py-2 text-sm"
                          disabled={voidNote.length < 5 || isLoading}
                        >
                          Void Completely
                        </Button>
                      }
                      onConfirm={() =>
                        onConfirmVoid(
                          casePaymentTransaction.transactionId,
                          false
                        )
                      }
                    />
                    <CustomAlert
                      confirmText="Proceed"
                      alertMessage="Are you sure you want to void the case payment? This action cannot be undone."
                      TriggerComponent={
                        <Button
                          className="w-full px-4 py-2 text-sm"
                          disabled={voidNote.length < 5 || isLoading}
                        >
                          Void w/o NRF
                        </Button>
                      }
                      onConfirm={() =>
                        onConfirmVoid(
                          casePaymentTransaction.transactionId,
                          true
                        )
                      }
                    />
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Addon Transactions */}
          {addonTransactions.length > 0 && (
            <Card className="p-4">
              <h3 className="mb-2 text-lg font-semibold">Addon Transactions</h3>
              {addonTransactions.map((transaction) => (
                <Card
                  key={transaction.transactionId}
                  className="mb-4 flex justify-around p-2 items-center"
                >
                  <div className="grid grid-cols-2 gap-2 w-3/4 px-4 border-r-2">
                    <p className="text-base font-medium text-blue-600 mb-1 col-span-2">
                      {transaction.description}
                    </p>
                    <span>Date:</span>
                    <span className="text-right">
                      {new Date(transaction.createdAt!).toLocaleString(
                        "en-us",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "America/New_York",
                        }
                      )}
                    </span>
                    <span className="text-base">Amount:</span>
                    <strong className="text-right text-base">
                      ${transaction.amount.toFixed(2)}
                    </strong>
                  </div>
                  {transaction.refundOrVoidStatus === "none" ? (
                    <div className="w-fit text-right mt-2">
                      <CustomAlert
                        alertTitle="Confirm void"
                        confirmText="Proceed to void"
                        alertMessage={`Are you sure you want to void this addon payment '${transaction.description}' $(${transaction.amount})? This action cannot be undone.`}
                        TriggerComponent={
                          <Button
                            size={"sm"}
                            className="w-fit px-4 py-2 text-sm"
                            disabled={isLoading}
                          >
                            Void
                          </Button>
                        }
                        onConfirm={() =>
                          onConfirmVoid(transaction.transactionId, false)
                        }
                      />
                    </div>
                  ) : transaction.refundOrVoidStatus === "void" ? (
                    <span className="text-red-400 text-base font-medium">
                      Voided
                    </span>
                  ) : (
                    <span className="text-red-400 text-base font-medium">
                      Refunded
                    </span>
                  )}
                </Card>
              ))}
            </Card>
          )}

          {/* Notes */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Notes</h3>
            <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
              {caseDetails && <NotesList2 notes={caseDetails?.notes} />}
            </div>
          </div>
        </div>
      </div>
    </RestrictedAccessRoute>
  );
};

export default Page;
