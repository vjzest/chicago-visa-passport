"use client";
import axiosInstance from "@/services/axios/axios";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";

interface Email {
  _id: string;
  subject: string;
  content: string;
  recipientEmail: string;
  createdAt: string;
  trackingId: string;
}

const EmailDetails: React.FC<{ email: Email }> = ({ email }) => {
  return (
    <div className="bg-white break-inside-avoid border-b-4 overflow-hidden border-b-slate-500 mx-6">
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
          </div>
        </div>

        <div
          className="leading-8 p-4 shadow-md border-y border-deep-blue "
          dangerouslySetInnerHTML={{
            __html: email.content,
          }}
        />
      </div>
    </div>
  );
};

const CaseEmails = ({ caseId }: { caseId: string }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const fetchEmails = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/cases/case-emails/${caseId}`
      );
      if (!data.success) throw new Error(data.message);
      const sortedArr = (data.data as Email[]).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setEmails(sortedArr);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmails();
  }, []);
  return (
    <div className="space-y-8 page-break">
      <h1 className="!text-xl pl-6 pt-6">Emails Sent To The Client:</h1>
      {emails.map((email) => (
        <EmailDetails key={email._id} email={email} />
      ))}
    </div>
  );
};

export default CaseEmails;
