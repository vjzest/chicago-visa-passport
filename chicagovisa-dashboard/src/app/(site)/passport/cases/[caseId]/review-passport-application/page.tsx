"use client";
import { RestrictedAccessRoute } from "@/components/passport/globals/Auth/restricted-access-route";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import PassportFormPreview from "@/components/passport/pages/cases/passport-form/details-preview";
import PPTFormUpload from "@/components/passport/pages/cases/passport-form/upload-ppt-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAccess } from "@/hooks/use-access";
import axiosInstance from "@/services/axios/axios";
import { ArrowLeft, CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const access = useAccess();
  const [openDialog, setOpenDialog] = useState<
    "" | "approve" | "reject" | "revert"
  >("");
  const [loading, setLoading] = useState(false);
  const [customBreadcrumbs, setBreadCrumbs] = useState([
    { label: "Dashboard", link: "/search" },
    { label: "Cases", link: null },
  ]);

  const [rejectionMessage, setRejectionMessage] = useState("");
  const [passportForm, setPassportForm] = useState<any | null>(null);
  const fetchPassportApplication = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases/passport-application/${caseId}`,
        {
          cache: false,
        }
      );
      setBreadCrumbs([
        {
          label: "Cases",
          link: "/cases/status/" + data?.data?.caseId?.caseInfo?.status,
        },
        {
          label: data?.data?.caseId?.caseNo,
          link: `/cases/${data?.data?.caseId?._id}`,
        },
        {
          label: "Review Passport Application",
          link: null,
        },
      ]);
      if (!data.success) throw new Error(data.message);
      setPassportForm(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching passport application");
    }
  };
  const approvePassportApplication = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(
        `/admin/cases/approve-passport-application/${caseId}`
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Passport application approved successfully");
      setOpenDialog("");
      fetchPassportApplication();
    } catch (error) {
      console.error(error);
      toast.error("Error while approving passport application");
    } finally {
      setLoading(false);
    }
  };
  const rejectPassportApplication = async () => {
    setLoading(true);
    try {
      if (rejectionMessage.trim().length < 15) {
        toast.error(
          "Please provide a message of at least 15 characters for rejection"
        );
        return;
      }

      const { data } = await axiosInstance.put(
        `/admin/cases/reject-passport-application/${caseId}`,
        { message: rejectionMessage.trim() }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Passport application reviewed successfully");
      setOpenDialog("");
      fetchPassportApplication();
    } catch (error) {
      console.error(error);
      toast.error("Error while reviewing passport application");
    } finally {
      setLoading(false);
    }
  };
  const revertToOngoing = async () => {
    setLoading(true);
    try {
      const status = "ongoing";
      const { data } = await axiosInstance.put(
        `/admin/cases/revert-passport-application/${caseId}`,
        { status }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Passport application reverted to ongoing status");
      setOpenDialog("");
      fetchPassportApplication();
    } catch (error) {
      console.error(error);
      toast.error("Error while reverting passport application");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPassportApplication();
  }, []);
  if (!passportForm) return <LoadingPage />;
  const reviewStatus = passportForm.caseId?.applicationReviewStatus;
  return (
    <RestrictedAccessRoute
      section="viewCaseDetails"
      action={"passportApplicationInformation"}
    >
      <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />

      <Dialog open={openDialog !== ""} onOpenChange={() => setOpenDialog("")}>
        <DialogContent className="break-words w-full md:w-1/2">
          <DialogHeader>
            <DialogDescription className="w-[90%]">
              {openDialog === "approve"
                ? "Confirm to approve this passport application?. On confirming, applicant will be asked to complete their document upload."
                : openDialog === "reject"
                  ? "Please provide a reason for rejecting the application"
                  : "Revert this application back to review?"}
            </DialogDescription>
          </DialogHeader>
          {openDialog === "reject" && (
            <div className="my-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor={`rejection-message-input`}
                  className="font-semibold"
                >
                  Reason for application rejection
                </label>
                <Textarea
                  id={`rejection-message-input`}
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  placeholder={`Enter rejection reason`}
                />
                {rejectionMessage?.length < 15 && (
                  <p className="text-sm text-red-500">
                    Message should be at least 15 characters long
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row justify-end gap-6 whitespace-nowrap">
            <Button
              className="w-fit"
              variant="outline"
              onClick={() => setOpenDialog("")}
            >
              Cancel
            </Button>
            <Button
              className="w-fit"
              disabled={loading}
              onClick={
                openDialog === "approve"
                  ? approvePassportApplication
                  : openDialog === "reject"
                    ? rejectPassportApplication
                    : revertToOngoing
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Link
        href={`/cases/${caseId}`}
        className="mb-2 flex items-center gap-2 font-semibold text-primary "
      >
        <ArrowLeft size={"1rem"} /> Go Back
      </Link>
      <h2 className="text-xl font-semibold">Passport application</h2>
      <div className="w-full sticky flex justify-between items-center top-20">
        <div className="flex flex-col items-center gap-4 py-2">
          <PPTFormUpload
            refetchData={fetchPassportApplication}
            caseId={caseId}
            formExists={!!passportForm.caseId?.passportFormUrl}
          />
          <Link
            className="font-medium text-sky-600"
            href={`/cases/${caseId}/passport-form-history`}
          >
            View passport form history
          </Link>
          {/* <Button size={"sm"}>Edit and resubmit</Button> */}
        </div>
        <div className="flex w-fit flex-col gap-2 my-2">
          {passportForm.caseId?.passportFormUrl && (
            <Link
              href={passportForm.caseId?.passportFormUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={"outline"} className="ml-auto">
                Government form preview
              </Button>
            </Link>
          )}
          {access?.editCaseDetails.passportApplicationAndForm && (
            <>
              <div className="flex justify-around gap-4 py-2">
                {reviewStatus === "ongoing" ? (
                  <>
                    <Button
                      onClick={() => setOpenDialog("reject")}
                      size={"sm"}
                      variant={"destructive"}
                      className="w-fit"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => setOpenDialog("approve")}
                      size={"sm"}
                      className="w-fit bg-green-600"
                    >
                      Approve
                    </Button>{" "}
                  </>
                ) : reviewStatus !== "pending" && reviewStatus !== "upload" ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-2 font-medium ${reviewStatus === "approved" ? "text-green-600" : "text-red-600"}`}
                    >
                      {reviewStatus === "approved" && (
                        <>
                          <CheckCircle size={"1rem"} />
                          Approved
                        </>
                      )}
                      {reviewStatus === "rejected" && (
                        <>
                          <XCircle size={"1rem"} />
                          Rejected
                        </>
                      )}
                    </span>
                    <Button
                      onClick={() => setOpenDialog("revert")}
                      size={"sm"}
                      className="w-fit"
                    >
                      Revert
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <PassportFormPreview
        passportForm={passportForm}
        hideActions={true}
        onSubmit={() => {}}
        goBack={() => {}}
        moveToStep={() => {}}
      />
    </RestrictedAccessRoute>
  );
};

export default Page;
