"use client";
import type React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import "./email.css";
import { extractPlainText, toRegularCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { usePDF } from "react-to-pdf";

interface Email {
  _id: string;
  subject: string;
  content: string;
  recipientEmail: string;
  createdAt: string;
  trackingId: string;
}

const CaseEmailsPage = ({
  params: { caseId },
}: {
  params: { caseId: string };
}) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const breadCrumbs = [
    { label: "Case Details", link: "/cases/" + caseId },
    { label: "Email history", link: null },
  ];
  const [loading, setLoading] = useState(true);
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases/case-emails/${caseId}`
      );
      if (!data.success) throw new Error(data.message);
      setEmails(data.data);
    } catch (error) {
      toast.error("Error fetching emails");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchEmails();
    }
  }, [caseId]);

  const handleEmailClick = async (emailId: string) => {
    setSelectedEmail(emails.find((elem) => elem._id === emailId)!);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <BreadCrumbComponent customBreadcrumbs={breadCrumbs} />
      <h1 className="mb-6 text-xl md:text-2xl font-semibold">
        Case Emails ({emails.length})
      </h1>
      {selectedEmail ? (
        <div>
          <button
            onClick={handleBackToList}
            className="mb-4 text-blue-500 hover:text-blue-600"
          >
            &larr; Back to list
          </button>
          <EmailDetails email={selectedEmail} />
        </div>
      ) : (
        <EmailList emails={emails} onEmailClick={handleEmailClick} />
      )}
    </div>
  );
};

const EmailList: React.FC<{
  emails: Email[];
  onEmailClick: (emailId: string) => void;
}> = ({ emails, onEmailClick }) => {
  return (
    <div className="bg-white">
      {emails.length > 0 ? (
        emails.map((email) => (
          <div
            key={email._id}
            className="px-6 py-4 border border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
            onClick={() => onEmailClick(email._id)}
          >
            <div className="grid grid-cols-[1fr_1.5fr_0.3fr] items-center">
              <h3 className="text-base font-semibold text-gray-700">
                {email.subject}
              </h3>
              <span className="text-slate-600">
                {extractPlainText(email.content, 150)}
              </span>
              <span className="text-sm text-end font-medium text-blue-800">
                {new Date(email.createdAt).toLocaleDateString("en-us", {
                  dateStyle: "medium",
                  timeZone: "America/New_York",
                })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-base text-slate-600 text-center my-[30vh]">
          No emails sent yet
        </p>
      )}
    </div>
  );
};

const EmailDetails: React.FC<{ email: Email }> = ({ email }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `${email.recipientEmail}_${email.subject}.pdf`,
  });
  const [emailEvents, setEmailEvents] = useState<
    { date: string; event: string; description: string }[]
  >([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const fetchEmailEvents = async () => {
    try {
      setEventsLoading(true);
      const { data } = await axiosInstance.get(
        `/admin/cases/case-emails/track-email-events`,
        {
          params: {
            trackingId: email.trackingId,
          },
        }
      );
      if (!data.success) throw new Error(data.message);
      setEmailEvents(data.data);
    } catch (error) {
      toast.error("Error fetching email events");
      console.log(error);
    } finally {
      setEventsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmailEvents();
  }, [email.trackingId]);
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-medium text-gray-700 mb-2">
              {email.subject}
            </h2>
            <div className="flex gap-2 mb-2">
              <span>Sent to:</span>
              <span className="font-medium">{email.recipientEmail}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-500 mb-2">
              {new Date(email.createdAt).toLocaleString("en-us", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "America/New_York",
              })}
            </p>
            {eventsLoading ? (
              <Loader2 className="text-sky-600 animate-spin mx-auto" />
            ) : (
              <Dialog>
                <DialogTrigger>
                  <Button
                    className="font-semibold text-sky-600"
                    variant={"ghost"}
                  >
                    View Email Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Email Status Logs</DialogTitle>
                  <div className="relative p-4 border-gray-300 space-y-6 max-h-[60vh] overflow-y-auto">
                    {emailEvents.map((event, index) => (
                      <div
                        key={index}
                        className="relative flex items-center gap-4 pl-8"
                      >
                        {/* Timeline Indicator */}
                        <div className="-left-3 top-2 w-4 h-4 bg-deep-blue rounded-full border-2 border-white"></div>

                        {/* Event Details */}
                        <div className="flex flex-col">
                          <span className="text-lg font-bold">
                            {toRegularCase(event.event)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {event.description}
                          </span>
                        </div>

                        {/* Date */}
                        <span className="ml-auto mb-auto text-base font-medium text-deep-blue">
                          {new Date(event.date).toLocaleString("en-us", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "America/New_York",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button
              onClick={() => toPDF()}
              className="font-semibold text-sky-600"
              variant={"ghost"}
            >
              Download as PDF
            </Button>
          </div>
        </div>

        <div
          ref={targetRef}
          className="leading-8 p-4 shadow-md border-y border-deep-blue shadow-deep-blue"
          dangerouslySetInnerHTML={{
            __html: email.content,
          }}
        />
      </div>
    </div>
  );
};

export default CaseEmailsPage;
