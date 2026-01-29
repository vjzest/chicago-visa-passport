import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/services/axios/axios";
import DocumentCard from "./document-card"; // Assuming DocumentCard is in the same directory

interface IDocument {
  document: string;
  title: string;
  isVerified: boolean;
  urls: string[];
}

interface VerificationState {
  [key: string]: boolean;
}
interface DocumentVerificationSectionProps {
  application: {
    _id: string;
    applicationReviewStatus: "pending" | "ongoing" | "approved" | "rejected";
    docReviewStatus: "pending" | "ongoing" | "expert" | "approved" | "rejected";
    documents: IDocument[];
  };
  refetch: () => void;
  allowEdit: boolean;
}

const DocumentVerificationSection: React.FC<
  DocumentVerificationSectionProps
> = ({ application, refetch, allowEdit }) => {
  const [openDialog, setOpenDialog] = useState<
    "" | "approve" | "reject" | "expert"
  >("");
  const [verification, setVerification] = useState<VerificationState>({});
  const [rejectionMessage, setRejectionMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeState();
  }, [application]);

  const initializeState = () => {
    const verificationState: VerificationState = {};
    application.documents.forEach((document) => {
      verificationState[document.document] = document.isVerified;
    });
    setVerification(verificationState);
  };

  const handleVerification = (documentId: string) => {
    setVerification((prev) => ({ ...prev, [documentId]: !prev[documentId] }));
  };
  const [docTitles, setDocTitles] = useState<{ [key: string]: string }>({});
  const allDocumentsVerified = Object.values(verification).every(Boolean);

  const fetchRequiredDocs = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases/required-documents/${application._id}`
      );
      if (!data?.success) throw new Error(data?.message);
      const obj = {};
      data?.data?.forEach(
        (elem: {
          _id: string;
          title: string;
          instructions: string[];
          sampleImage: string;
          silentKey: string;
        }) => {
          if (
            ["ppt-form", "Passport Application"].includes(elem.silentKey!) &&
            !["passport-name-change", "passport-renewal"].includes(
              (application as any).caseInfo?.serviceType?.silentKey
            )
          ) {
            return;
          }
          (obj as any)[elem._id] = elem.title;
        }
      );
      setDocTitles(obj);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };

  const approveDocuments = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(
        `/admin/cases/approve-documents/${application._id}`,
        { verification }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Documents approved successfully");
      refetch();
      setOpenDialog("");
    } catch (error) {
      console.error(error);
      toast.error("Error while approving documents");
    } finally {
      setLoading(false);
    }
  };

  const sendForExpertReview = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(
        `/admin/cases/expert-review/${application._id}`,
        { verification }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Documents sent to expert review");
      refetch();
      setOpenDialog("");
    } catch (error) {
      console.error(error);
      toast.error("Error while sending to expert review");
    } finally {
      setLoading(false);
    }
  };

  const rejectDocuments = async () => {
    setLoading(true);
    try {
      const rejectedDocs = Object.entries(verification).filter(
        ([_, isVerified]) => !isVerified
      );
      if (rejectedDocs.length === 0) return;

      const { data } = await axiosInstance.put(
        `/admin/cases/reject-documents/${application._id}`,
        { message: rejectionMessage, verification }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Documents reviewed successfully");
      refetch();
      setOpenDialog("");
    } catch (error) {
      console.error(error);
      toast.error("Error while reviewing documents");
    } finally {
      setLoading(false);
    }
  };

  const verifyAllDocs = () => {
    setVerification((prev) => {
      const updatedVerification: VerificationState = {};
      Object.keys(prev).forEach((key) => {
        updatedVerification[key] = true;
      });
      return updatedVerification;
    });
  };

  const renderDocumentCards = () => (
    <>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {application.documents.map((document) => (
          <DocumentCard
            key={document.document}
            document={{ ...document, title: docTitles[document.document] }}
            onVerifyClick={() => handleVerification(document.document)}
            isVerified={verification[document.document]}
            isEditable={
              allowEdit &&
              application.docReviewStatus !== "approved" &&
              application.docReviewStatus !== "rejected"
            }
          />
        ))}
      </div>
    </>
  );

  const renderActionButtons = () => (
    <div className="mt-6 flex justify-end space-x-4">
      {application.docReviewStatus === "ongoing" && (
        <>
          {allDocumentsVerified ? (
            <Button
              onClick={() => setOpenDialog("expert")}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!allowEdit || loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send to Expert Review"
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={verifyAllDocs}
                variant={"ghost"}
                className="text-sky-600 font-semibold"
              >
                Mark all as approved
              </Button>
              <Button
                disabled={!allowEdit}
                onClick={() => setOpenDialog("reject")}
                className="bg-red-500"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Reject documents"
                )}
              </Button>
            </>
          )}
        </>
      )}

      {application.docReviewStatus === "expert" && (
        <div className="flex gap-2">
          {allDocumentsVerified ? (
            <Button
              disabled={!allowEdit || loading}
              onClick={() => setOpenDialog("approve")}
              className="bg-green-500"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Approve All"}
            </Button>
          ) : (
            <Button
              disabled={!allowEdit}
              onClick={() => setOpenDialog("reject")}
              className="bg-red-500"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reject documents"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchRequiredDocs();
  }, [application]);

  const colorAndTextForStatus = {
    pending: ["bg-gray-400", "Pending : customer needs to upload docs"],
    ongoing: ["bg-yellow-500", "Ongoing : Please take necessary actions"],
    expert: ["bg-yellow-500", "On expert review"],
    approved: ["bg-green-500", "Verified and approved"],
    rejected: ["bg-red-400", "Rejected: Waiting for resubmission"],
  };

  return (
    <div className="container mx-auto p-2 md:p-6">
      <h1 className="mb-4 text-center text-xl font-semibold">
        Document Verification{" "}
      </h1>
      <p
        className={`mx-auto w-fit ${colorAndTextForStatus[application?.docReviewStatus]?.[0]} rounded-md p-2 text-center text-base font-medium  text-white`}
      >
        {colorAndTextForStatus[application?.docReviewStatus]?.[1]}
      </p>

      {renderDocumentCards()}
      {renderActionButtons()}

      <Dialog open={openDialog !== ""} onOpenChange={() => setOpenDialog("")}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {openDialog === "approve"
                ? "Approve Documents"
                : openDialog === "expert"
                  ? "Send to Expert Review"
                  : "Review Documents"}
            </DialogTitle>
            <DialogDescription>
              {openDialog === "approve"
                ? "Confirm to approve these documents?"
                : openDialog === "expert"
                  ? "Confirm to send these documents for expert review?"
                  : "Please provide a reason for each rejected document."}
            </DialogDescription>
          </DialogHeader>
          {openDialog === "reject" && (
            <div className="my-4 space-y-4">
              <label htmlFor={`rejection-message`} className="font-semibold">
                Rejection message
              </label>
              <Textarea
                id="rejection-message"
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
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenDialog("")}>
              Cancel
            </Button>
            <Button
              disabled={
                loading ||
                (openDialog === "reject" && rejectionMessage?.length < 15)
              }
              onClick={
                openDialog === "approve"
                  ? approveDocuments
                  : openDialog === "expert"
                    ? sendForExpertReview
                    : rejectDocuments
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentVerificationSection;
