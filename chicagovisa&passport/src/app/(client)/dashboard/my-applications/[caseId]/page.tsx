"use client";

import axiosInstance from "@/lib/config/axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadCrumbComponent } from "@/components/globals";
import { AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
// import ChatModal from "@/components/pages/my-applications/chat-modal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import DocUploadSection from "@/components/pages/my-applications/application/doc-upload-section";
import Link from "next/link";
import ProgressGuide from "@/components/pages/my-applications/application/progress-guide";
import DocUploadMessage from "@/components/pages/my-applications/application/doc-upload-message";
import TrackingForm from "@/components/pages/my-applications/application/tracking-form";
import LoadingPage from "@/components/globals/loading/loading-page";
import CaseDetailsAccordion from "@/components/pages/my-applications/application/case-details-accordion";
import { RecordUserAction } from "@/lib/endpoints/endpoint";
import CaseBlocked from "./case-blocked";

type PageProps = {
  params: {
    caseId: string;
  };
};

const Page: React.FC<PageProps> = ({ params: { caseId } }) => {
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [passportFormPercentage, setPassportFormPercentage] = useState<
    number | null
  >(null);
  const [customBreadcrumbs, setBreadCrumbs] = useState([
    { label: "Dashboard", link: "/dashboard/my-applications" },
    { label: "My Cases", link: null },
  ]);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancellationNote, setCancellationNote] = useState("");
  const fetchCaseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/user/case/${caseId}`, {
        cache: false,
      });
      if (response.status === 200) {
        RecordUserAction("Viewed Case Details", caseId);
        setCaseDetails(response?.data?.data?.caseData);
        setBreadCrumbs([
          { label: "My Cases", link: "/dashboard/my-applications" },
          {
            label: response?.data?.data?.caseData?.caseNo?.toUpperCase(),
            link: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };
  useEffect(() => {
    fetchCaseDetails();
    getPassportFormPercentage();
  }, [caseId]);

  const undoCancellationRequest = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/user/case/undo-cancellation-request/${caseId}`,
        {
          note: cancellationNote,
        }
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(data?.message);
      fetchCaseDetails();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const submitCancellationRequest = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/user/case/make-cancellation-request/${caseId}`,
        {
          note: cancellationNote,
        }
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(data?.message);
      fetchCaseDetails();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // to get percentage of passport form

  const getPassportFormPercentage = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/passport-form/percentage/${caseId}`
      );
      if (response.status === 200 && response?.data?.success) {
        setPassportFormPercentage(response?.data?.data?.completionPercentage);
      }
    } catch (error) {
      console.error("Error fetching passport form percentage:", error);
    }
  };

  // Extract refund-related details
  const isRefunded = caseDetails?.refund?.isRefunded;
  const refundNote = caseDetails?.refund?.refundNote;

  const isCanceled = caseDetails?.isCanceled;
  const cancellationReason = caseDetails?.cancellationReason;
  const cancellationStatus = caseDetails?.cancellation?.status;

  if (caseDetails?.isAccessible === false) {
    return <CaseBlocked caseNo={caseDetails?.caseNo} />;
  }

  return caseDetails ? (
    <>
      {/* cancellation dialog */}
      <Dialog
        open={openCancelDialog}
        onOpenChange={(bool) => {
          if (!bool) setCancellationNote("");
          setOpenCancelDialog(bool);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request for cancellation</DialogTitle>
            <DialogDescription>
              {cancellationStatus === "none" ||
              cancellationStatus === "rejected"
                ? "Are you sure you want to request to cancel this application? If yes, please include your reason."
                : cancellationStatus === "requested" &&
                  "Are you sure you want to undo your cancellation request?"}
            </DialogDescription>
          </DialogHeader>
          {(cancellationStatus === "none" ||
            cancellationStatus === "rejected") && (
            <div className="flex flex-col gap-2">
              <label htmlFor="cancellation-note" className="font-semibold">
                Cancellation note
              </label>
              <Textarea
                value={cancellationNote}
                onChange={(e) => setCancellationNote(e.target.value)}
                id="cancellation-note"
                placeholder="Enter your reason for cancellation"
                rows={2}
              />
            </div>
          )}
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setOpenCancelDialog(false)}
              variant={"outline"}
            >
              No
            </Button>
            <Button
              disabled={
                (cancellationStatus === "none" ||
                  cancellationStatus === "rejected") &&
                cancellationNote.length < 5
              }
              variant={"destructive"}
              onClick={
                cancellationStatus === "none" ||
                cancellationStatus === "rejected"
                  ? () => {
                      submitCancellationRequest();
                      setOpenCancelDialog(false);
                    }
                  : () => {
                      undoCancellationRequest();
                      setOpenCancelDialog(false);
                    }
              }
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>{" "}
      <div className="my-3 md:-ml-10 flex justify-start">
        <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
      </div>
      <div className="container mx-auto p-2">
        {caseDetails?.applicationReviewStatus === "pending" &&
          passportFormPercentage !== null &&
          passportFormPercentage < 100 && (
            <Card className="mb-4 border-l-4 border-yellow-500 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center justify-center p-0">
                  <FileText className="mr-2 text-yellow-600" />
                  <CardTitle className="text-yellow-600 ">
                    Passport Form Incomplete
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <p className="text-yellow-600">
                  Your passport form is {passportFormPercentage}% complete.
                  Please complete the remaining {100 - passportFormPercentage}%.
                </p>

                <Link href={`${caseId}/passport-application`}>
                  <Button className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600">
                    Complete Passport Form
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        {caseDetails?.applicationReviewStatus === "ongoing" ? (
          <div className="flex items-center gap-2">
            <Link
              className="mx-auto w-fit"
              href={`/dashboard/my-applications/${caseId}/passport-application-preview`}
            >
              <DocUploadMessage
                status="ongoing"
                title="Your application details are under review"
                messages={[
                  "We'll let you know once the review is over. Click to preview.",
                ]}
              />
            </Link>
          </div>
        ) : caseDetails?.applicationReviewStatus === "rejected" ? (
          <DocUploadMessage
            status="rejected"
            title="Your application details were rejected. Please re-submit again with proper details"
            messages={caseDetails?.applicationReviewMessage}
          />
        ) : (
          <></>
        )}
        {caseDetails?.reviewStage === "documents" &&
          (caseDetails?.docReviewStatus === "ongoing" ? (
            <DocUploadMessage
              status="ongoing"
              title="Your documents are under review"
              messages={["We'll let you know once the review is over"]}
            />
          ) : caseDetails?.docReviewStatus === "rejected" ? (
            <DocUploadMessage
              status="rejected"
              title="Your documents were rejected"
              messages={caseDetails?.docReviewMessage
                .split(",")
                .map((reason: string) => reason?.trim())}
            />
          ) : caseDetails?.docReviewStatus === "expert" ? (
            <DocUploadMessage
              status="expert Review"
              title="Your documents are Expert Review"
              messages={["We'll let you know once the review is over"]}
            />
          ) : caseDetails?.docReviewStatus === "pending" ? (
            <DocUploadMessage
              status="pending"
              title="Your document verification is pending"
              messages={[
                "Upload all documents and click on 'Submit for review' from below",
              ]}
            />
          ) : (
            ""
          ))}
        {caseDetails && (
          <>
            {/* Display refund message if refunded */}
            {isCanceled && (
              <Card className="mb-4 border-l-4 border-red-500 bg-red-50">
                <CardHeader>
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 text-red-600" />
                    <CardTitle className="text-red-600">
                      Case Canceled
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-red-600">This case has been canceled.</p>
                  {cancellationReason && (
                    <p className="mt-2 text-red-600">
                      <strong>Cancellation Reason:</strong> {cancellationReason}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {isRefunded && (
              <Card className="mb-4 border-l-4 border-green-500 bg-green-50">
                <CardHeader>
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 text-green-700" />
                    <CardTitle className="text-green-700">
                      Refund Processed
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">
                    A refund has been successfully processed for this case.
                  </p>
                  {refundNote && (
                    <p className="mt-2 text-green-700">
                      <strong>Refund Note:</strong> {refundNote}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {/* <ChatModal
              caseId={caseId}
              open={openChatModal}
              setOpen={setOpenChatModal}
            /> */}
            <CaseDetailsAccordion
              caseDetails={caseDetails}
              isCanceled={isCanceled}
              isRefunded={isRefunded}
            />
          </>
        )}
        <ProgressGuide
          steps={[
            {
              title: "Visa details review",
              description:
                "Complete your visa application, and your visa specialist will review and approve it.",
              isCompleted: caseDetails?.applicationReviewStatus === "approved",
            },
            {
              title: "Documents review",
              description:
                "Upload the required documents listed below and await review and approval. After approval, please ship your documents to us using the FedEx label which you can generate from below.",
              isCompleted: caseDetails?.docReviewStatus === "approved",
            },
            {
              title: "Final processing",
              description:
                "Your Visa will be processed and shipped to your address.",
              isCompleted:
                caseDetails?.caseInfo?.status?.key === "passport-processed",
            },
          ]}
        />

        {/* {(caseDetails?.reviewStage === "documents" ||
          caseDetails?.reviewStage === "done") && (
          <DocUploadSection
            refetchDetails={fetchCaseDetails}
            caseDetails={caseDetails}
          />
        )} */}
        <DocUploadSection
          refetchDetails={fetchCaseDetails}
          caseDetails={caseDetails}
        />

        <TrackingForm
          enabled={caseDetails?.reviewStage === "done"}
          refetchCase={fetchCaseDetails}
          applicationId={caseDetails?._id}
          fromCountryCode={caseDetails?.caseInfo?.fromCountryCode}
          toCountryCode={caseDetails?.caseInfo?.toCountryCode}
          stateOfResidency={caseDetails?.caseInfo?.stateOfResidency}
          inBoundStatus={caseDetails?.inboundStatus}
          additionalShippingOptions={caseDetails?.additionalShippingOptions}
          trackingId={
            caseDetails?.additionalShippingOptions?.inboundTrackingId || null
          }
        />
      </div>
    </>
  ) : (
    <LoadingPage />
  );
};

export default Page;
