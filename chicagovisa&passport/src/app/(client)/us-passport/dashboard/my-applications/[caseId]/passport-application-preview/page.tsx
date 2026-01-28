"use client";
import LoadingPage from "@/components/globals/loading/loading-page";
import DocUploadMessage from "@/components/pages/my-applications/application/doc-upload-message";
import PassportFormPreview from "@/components/pages/my-applications/passport-forms/details-preview";
import { Button } from "@/components/ui/button";
import Tooltip2 from "@/components/ui/tooltip-2";
import axiosInstance from "@/lib/config/axios";
import { RecordUserAction } from "@/lib/endpoints/endpoint";
import { ArrowLeftCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CaseBlocked from "../case-blocked";
import { downloadFileFromS3 } from "@/lib/download";

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const [passportForm, setPassportForm] = useState<any | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchPassportApplication = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/user/case/passport-application/${caseId}`
      );
      if (!data.success) throw new Error(data.message);
      setPassportForm(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching passport application");
    }
  };
  const downloadForm = async () => {
    setDownloading(true);
    try {
      await downloadFileFromS3(
        passportForm.caseId?.passportFormUrl,
        `${passportForm?.personalInfo?.firstName}_${passportForm?.personalInfo?.lastName}_Passport_Application`
      );
      RecordUserAction(
        "Viewed/Downloaded Government generated passport form",
        caseId
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDownloading(false);
    }
  };
  useEffect(() => {
    fetchPassportApplication();
    RecordUserAction("Previewed details of passport application", caseId);
  }, []);
  const reviewStatus = passportForm?.caseId?.applicationReviewStatus;
  if (passportForm?.caseId?.isAccessible === false) {
    return <CaseBlocked caseNo={passportForm?.caseId?.caseNo} />;
  }
  return passportForm ? (
    <>
      <h2 className="text-xl flex gap-4 items-center font-semibold mb-2">
        {" "}
        <Link href={`/dashboard/my-applications/${caseId}`}>
          <ArrowLeftCircle className="text-primary" size={"2rem"} />
        </Link>{" "}
        Passport application
      </h2>
      {reviewStatus === "ongoing" ? (
        <DocUploadMessage
          status="ongoing"
          title="Your application details are under review"
          messages={["We'll let you know once the review is over"]}
        />
      ) : reviewStatus === "rejected" ? (
        <div className="flex flex-col">
          <DocUploadMessage
            status="rejected"
            title="Your application details were rejected. Please re-submit again with proper details"
            messages={passportForm.caseId?.applicationReviewMessage}
          />
          <Link
            className="mb-2 self-center"
            href={`/dashboard/my-applications/${caseId}/passport-application`}
          >
            <Button className=" w-fit ">Edit and re-submit</Button>
          </Link>
        </div>
      ) : reviewStatus === "approved" ? (
        <span className="flex items-center text-green-600 justify-center my-4 gap-2 text-base mx-auto w-full">
          <CheckCircle size={"2rem"} />
          Application details approved{" "}
        </span>
      ) : (
        ""
      )}
      {passportForm.caseId?.passportFormUrl && (
        <div className="flex flex-col items-end mb-3 ml-auto gap-2 sticky top-16 md:top-12 w-[80vw] md:w-[30rem] text-wrap">
          <Button
            disabled={downloading}
            onClick={() => {
              downloadForm();
            }}
            variant={"outline"}
            className="ml-auto"
          >
            {downloading ? (
              <Loader2 className="animate-spin" />
            ) : (
              " Government form preview"
            )}
          </Button>
          <span className="text-right text-slate-600 ">
            {" "}
            Click above to see how your government passport form will look like
            with the details you submitted.
          </span>
        </div>
      )}
      <PassportFormPreview
        passportForm={passportForm}
        onSubmit={() => {}}
        goBack={() => {}}
        moveToStep={() => {}}
        hideActions={true}
      />
    </>
  ) : (
    <LoadingPage />
  );
};

export default Page;
