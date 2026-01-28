"use client";
import React, { useEffect, useState } from "react";
import { PersonalInfoForm } from "@/components/pages/my-applications/passport-forms/personal-info-form";
import { ContactInfoForm } from "@/components/pages/my-applications/passport-forms/contact-info-form";
import { EmergencyContactForm } from "@/components/pages/my-applications/passport-forms/emergency-contact-form";
import { ParentAndMarriageInfoForm } from "@/components/pages/my-applications/passport-forms/parent-and-marriage-info-form";
import { ProductInfoForm } from "@/components/pages/my-applications/passport-forms/product-info-form";
import { PassportHistoryForm } from "@/components/pages/my-applications/passport-forms/passport-history-form";
// import { PhysicalDescriptionForm } from "@/components/pages/my-applications/passport-forms/physical-description-form";
import { TravelPlansForm } from "@/components/pages/my-applications/passport-forms/travel-plans-form";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import purpleCheckIcon from "../../../../../../../public/assets/images/3d-green-check-icon.png";
import { Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import LoadingPage from "@/components/globals/loading/loading-page";
import DynamicUserDetail from "@/components/globals/dynamic-user-detail";
import DetailsPreview from "@/components/pages/my-applications/passport-forms/details-preview";
import { IPassportFormData } from "@/lib/types/passport-form.type";
import {
  calculateAge,
  getCurrentDateInDC,
  isMoreThanYearsAgo,
  parseMDYDate,
} from "@/lib/date";
import { LostPassportForm } from "@/components/pages/my-applications/passport-forms/lost-info-form";
import { NameChangeInfoForm } from "@/components/pages/my-applications/passport-forms/name-change-form";
import { determineQuestions } from "@/components/pages/my-applications/passport-forms/details-preview";
import { BreadCrumbComponent } from "@/components/globals";
import { RecordUserAction } from "@/lib/endpoints/endpoint";
import { areObjectsEqual } from "@/lib/utils/object";
import CaseBlocked from "../case-blocked";
import { IMGS } from "@/lib/constants";
import {
  PassportFormData,
  usePassportApplicationStore,
} from "@/store/use-passport-application-store";
import { downloadFileFromS3 } from "@/lib/download";
// Define the possible keys for the form steps
export type IPassportFormKeys = keyof (IPassportFormData & {
  detailsPreview: any;
  lostInfo: any;
});

const formSteps: {
  component: React.FC<any>;
  key: IPassportFormKeys | "lostInfo" | "detailsPreview" | "nameChangeInfo";
}[] = [
  { component: PersonalInfoForm, key: "personalInfo" },
  { component: ContactInfoForm, key: "contactInfo" },
  { component: TravelPlansForm, key: "travelPlans" },
  { component: EmergencyContactForm, key: "emergencyContact" },
  { component: PassportHistoryForm, key: "passportHistory" },
  { component: NameChangeInfoForm, key: "nameChangeInfo" },
  { component: LostPassportForm, key: "lostInfo" },
  { component: ParentAndMarriageInfoForm, key: "parentAndMarriageInfo" },
  { component: DetailsPreview, key: "detailsPreview" },
  { component: ProductInfoForm, key: "productInfo" },
];

type PageProps = {
  params: {
    caseId: string;
  };
};
const Page: React.FC<PageProps> = ({ params }) => {
  const [customBreadcrumbs, setBreadCrumbs] = useState<
    { label: string; link: string | null }[]
  >([{ label: "My Cases", link: null }]);
  const [navAction, setNavAction] = useState<"front" | "back">("front");
  const [formFillSuccess, setFormFillSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [passportForm, setPassportForm] = useState<IPassportFormData | null>(
    null
  );
  const [initialised, setInitialised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [redirectedInitially, setRedirectedInitially] = useState(false);
  const router = useRouter();
  const [process, setProcess] = useState<
    "" | "submission" | "generation" | "success" | "failed"
  >("");
  const [downloading, setDownloading] = useState(false);
  const { storeCaseId, resetStore } = usePassportApplicationStore((state) => ({
    storeCaseId: state.caseId,
    resetStore: state.resetStore,
  }));

  const incompleteIndex = localStorage.getItem("incompleteIndex");
  useEffect(() => {
    setCurrentStep(Number(incompleteIndex));
  }, [incompleteIndex]);

  const getPassportFormData = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/passport-form/${params?.caseId}`,
        {
          cache: false,
        }
      );
      if (response?.data?.success) {
        setPassportForm(response?.data?.data || {});
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCaseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/user/case/${params?.caseId}`, {
        cache: false,
      });
      if (response.status === 200) {
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
    getPassportFormData();
  }, [params?.caseId]);

  useEffect(() => {
    if (
      (params?.caseId && storeCaseId && storeCaseId !== params?.caseId) ||
      !storeCaseId
    ) {
      console.log("cleared the store");
      resetStore(params?.caseId);
    }
  }, [params?.caseId, storeCaseId]);

  useEffect(() => {
    if (formFillSuccess) {
      fetchCaseDetails();
    }
  }, [formFillSuccess]);
  useEffect(() => {
    if (passportForm && Object.keys(passportForm).length) {
      //@ts-ignore
      const reviewStatus = passportForm.caseId?.applicationReviewStatus;
      if (
        reviewStatus &&
        reviewStatus !== "pending" &&
        reviewStatus !== "rejected" &&
        reviewStatus !== "upload"
      ) {
        router.replace("/dashboard/my-applications");
      }
    }
  }, [passportForm]);

  const fetchFormFillStatus = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/user/passport-form/${params?.caseId}/form-fill-status`,
        {
          cache: false,
        }
      );
      if (data?.data?.status === "failed") {
        setProcess("failed");
      } else if (data?.data?.status === "pending") {
        if (process !== "generation") {
          setProcess("generation");
          setCurrentStep(9);
        }
        startFrequentFormFillCheck();
      } else if (data?.data?.status === "success") {
        setFormFillSuccess(true);
        setProcess("success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (!initialised) setInitialised(true);
    }
  };

  const storeFormData = async (formData: Partial<IPassportFormData>) => {
    const token = localStorage.getItem("user_token");
    try {
      const { data } = await axiosInstance.post(
        `/user/passport-form/${params?.caseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return setPassportForm(data.data);
    } catch (error) {
      console.error("Error storing form data", error);
      throw error;
    }
  };

  const startFrequentFormFillCheck = () => {
    setTimeout(async () => {
      await fetchFormFillStatus();
    }, 3000);
  };
  const handleSubmit = async (values: any, key: IPassportFormKeys) => {
    setNavAction("front");
    setLoading(true);
    try {
      let stepData: Partial<IPassportFormData> = { [key]: values };
      let isDataDifferent = true;
      if (passportForm?.[key as keyof IPassportFormData]) {
        const { isComplete, ...restPassportForm } =
          passportForm?.[key as keyof IPassportFormData] || {};
        isDataDifferent = !areObjectsEqual(restPassportForm, values);
      }
      if (isDataDifferent) {
        await storeFormData(stepData);
      }
      if (currentStep === formSteps.length - 1) {
        setProcess("submission");
        // await generatePDFFill(updatedFormData);
        setProcess("generation");
        const { data } = await axiosInstance.post(
          `/user/passport-form/${params.caseId}/fill-gov-form`
        );
        if (data?.success) {
          toast.success(data?.message);
          startFrequentFormFillCheck();
        } else {
          throw new Error(data.message);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
        localStorage.removeItem("incompleteIndex");
      }
    } catch (error) {
      setProcess("");
      console.error("Error during form submission", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderComponent = (
    Comp: React.FC<{
      onSubmit: (values: any) => void;
      goBack: () => void;
      defaultValues: any;
      isLoading?: boolean;
      applicantDOB?: Date;
      mailingAddress?: any;
      skip?: () => void;
      cardIssueDate?: Date;
      bookIssueDate?: Date;
      isCardLost?: boolean;
      isBookLost?: boolean;
      passportType?: "card" | "book" | "both";
      showQuestionCount?: number;
      showFileSearch?: boolean;
    }>,
    key: IPassportFormKeys | "detailsPreview" | "lostInfo" | "nameChangeInfo"
  ) => {
    const isLastStep = currentStep === formSteps.length - 1;
    if (key === "parentAndMarriageInfo") {
      const bookDetails = passportForm?.passportHistory?.passportBookDetails;
      const cardDetails = passportForm?.passportHistory?.passportCardDetails;
      let skipStep = true;
      if (passportForm?.passportHistory?.hasPassportCardOrBook !== "none") {
        const ageOnIssue = Math.max(
          calculateAge(
            parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!,
            parseMDYDate(bookDetails?.issueDate!)!
          ),
          calculateAge(
            parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!,
            parseMDYDate(cardDetails?.issueDate!)!
          )
        );

        let isBothExpired = true;

        if (bookDetails?.issueDate) {
          isBothExpired = isMoreThanYearsAgo(
            parseMDYDate(bookDetails?.issueDate!)!,
            15,
            getCurrentDateInDC()
          )!;
        }
        if (cardDetails?.issueDate && isBothExpired) {
          isBothExpired = isMoreThanYearsAgo(
            parseMDYDate(cardDetails?.issueDate!)!,
            15,
            getCurrentDateInDC()
          )!;
        }
        if (
          ageOnIssue < 16 ||
          (bookDetails?.status &&
            bookDetails?.status !== "yes" &&
            bookDetails?.status !== "damaged") ||
          (cardDetails?.status &&
            cardDetails?.status !== "yes" &&
            cardDetails?.status !== "damaged") ||
          (ageOnIssue >= 16 &&
            (isBothExpired ||
              bookDetails?.status === "damaged" ||
              cardDetails?.status === "damaged"))
        ) {
          skipStep = false;
        }
      } else {
        skipStep = false;
      }
      if (skipStep) {
        storeFormData({
          parentAndMarriageInfo: {
            isParent1Unknown: true,
            isParent2Unknown: true,
            isMarried: false,
            isComplete: true,
          },
        });
        setCurrentStep((prev) => (navAction === "front" ? prev + 1 : prev - 1));
      }
      return (
        <Comp
          defaultValues={passportForm?.[key] ?? {}}
          onSubmit={(values) => {
            handleSubmit(values, key);
          }}
          goBack={() => {
            setNavAction("back");
            setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
          }}
          isLoading={loading}
          applicantDOB={parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!}
        />
      );
    } else if (key === "passportHistory") {
      return (
        <Comp
          defaultValues={passportForm?.[key] ?? {}}
          onSubmit={(values) => {
            handleSubmit(values, key);
          }}
          goBack={() => {
            setNavAction("back");
            setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
          }}
          applicantDOB={parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!}
          isLoading={loading}
        />
      );
    } else if (key === "nameChangeInfo") {
      const bookDetails = passportForm?.passportHistory?.passportBookDetails;
      const cardDetails = passportForm?.passportHistory?.passportCardDetails;
      let passportType: "card" | "book" | "both" | null = null;
      let showQuestionCount = 0;
      const applicantDOB = parseMDYDate(
        passportForm?.personalInfo?.dateOfBirth ?? ""
      )!;
      const bookExpiryYears = isMoreThanYearsAgo(
        applicantDOB,
        16,
        parseMDYDate(bookDetails?.issueDate!)!
      )
        ? 15
        : 5;

      const cardExpiryYears = isMoreThanYearsAgo(
        applicantDOB,
        16,
        parseMDYDate(cardDetails?.issueDate!)!
      )
        ? 15
        : 5;
      if (cardDetails?.status === "yes" || bookDetails?.status === "yes") {
        if (cardDetails?.status === "yes") {
          const cardIssueDate = parseMDYDate(cardDetails?.issueDate ?? "")!;
          if (
            !isMoreThanYearsAgo(
              cardIssueDate,
              cardExpiryYears,
              getCurrentDateInDC()
            )
          ) {
            passportType = "card";
            showQuestionCount = determineQuestions(
              passportForm?.personalInfo?.dateOfBirth!,
              cardDetails?.issueDate as string,
              false
            );
          }
        }
        if (bookDetails?.status === "yes") {
          const bookIssueDate = parseMDYDate(bookDetails?.issueDate ?? "")!;
          if (
            !isMoreThanYearsAgo(
              bookIssueDate,
              bookExpiryYears,
              getCurrentDateInDC()
            )
          ) {
            passportType = passportType ? "both" : "book";
            showQuestionCount = Math.max(
              determineQuestions(
                passportForm?.personalInfo?.dateOfBirth!,
                bookDetails?.issueDate as string,
                true
              ),
              showQuestionCount
            );
          }
        }
      }

      if (showQuestionCount === 0 || !passportType) {
        setCurrentStep((prev) => (navAction === "front" ? prev + 1 : prev - 1));
        return <></>;
      }

      return (
        <Comp
          defaultValues={passportForm?.[key] ?? {}}
          onSubmit={(values) => {
            handleSubmit(values, key);
          }}
          goBack={() => {
            setNavAction("back");
            setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
          }}
          applicantDOB={parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!}
          passportType={passportType}
          showQuestionCount={showQuestionCount}
          isLoading={loading}
        />
      );
    } else if (key === "detailsPreview") {
      return (
        <Comp
          //@ts-ignore
          passportForm={passportForm}
          goBack={() => {
            setNavAction("back");
            setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
          }}
          onSubmit={() => {
            setNavAction("front");
            setCurrentStep((prev) => (prev > 0 ? prev + 1 : prev));
          }}
          moveToStep={(step: string) => {
            let stepIndex = 0;
            formSteps.forEach((stepObj, index) => {
              if (stepObj.key === step) {
                stepIndex = index;
              }
            });
            setCurrentStep(stepIndex);
          }}
        />
      );
    } else if (key === "lostInfo") {
      const bookDetails = passportForm?.passportHistory?.passportBookDetails;
      const cardDetails = passportForm?.passportHistory?.passportCardDetails;
      const isBookLost =
        (bookDetails?.status === "lost" || bookDetails?.status === "stolen") &&
        ((!bookDetails.issueDate &&
          bookDetails?.isOlderThan15Years !== "yes") ||
          isMoreThanYearsAgo(
            parseMDYDate(bookDetails?.issueDate!)!,
            15,
            getCurrentDateInDC()
          ) === false) &&
        bookDetails?.hasReportedLostOrStolen === false;
      const isCardLost =
        (cardDetails?.status === "lost" || cardDetails?.status === "stolen") &&
        cardDetails?.hasReportedLostOrStolen === false;
      if (!isBookLost && !isCardLost) {
        setCurrentStep((prev) => (navAction === "front" ? prev + 1 : prev - 1));
        return <></>;
      }
      return (
        <LostPassportForm
          defaultValues={passportForm?.[key] ?? {}}
          onSubmit={(values) => handleSubmit(values, key)}
          goBack={() => {
            setNavAction("back");
            setCurrentStep((prev) => prev - 1);
          }}
          applicantDOB={parseMDYDate(passportForm?.personalInfo?.dateOfBirth!)!}
          bookIssueDate={parseMDYDate(bookDetails?.issueDate!)}
          cardIssueDate={parseMDYDate(cardDetails?.issueDate!)}
          // check if issue date is less than 15 years from today
          isBookLost={isBookLost}
          isCardLost={isCardLost}
          isLoading={loading}
        />
      );
    }
    return (
      <Comp
        defaultValues={passportForm?.[key] ?? {}}
        onSubmit={(values) => {
          handleSubmit(values, key);
        }}
        goBack={() => {
          setNavAction("back");
          setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
        }}
        showFileSearch={
          !(
            passportForm?.passportHistory?.passportBookDetails?.status ===
              "yes" ||
            passportForm?.passportHistory?.passportCardDetails?.status === "yes"
          )
        }
        isLoading={
          loading ||
          (isLastStep &&
            (process === "submission" ||
              process === "generation" ||
              process === "success"))
        }
      />
    );
  };
  const refreshCompletionPercentage = () => {
    let totalForms = 7;
    let completedForms = 0;
    for (const key in passportForm) {
      if (typeof passportForm[key as keyof IPassportFormData] !== "object")
        continue;
      if (passportForm[key as keyof IPassportFormData]?.isComplete) {
        completedForms++;
      }
    }
    if (!redirectedInitially) {
      setCurrentStep(
        completedForms < totalForms ? completedForms : totalForms - 1
      );
      RecordUserAction("Opened passport application form", params?.caseId);
      setRedirectedInitially(true);
    }
    setCompletionPercentage(Math.round((completedForms / totalForms) * 100));
  };

  const downloadForm = async () => {
    setDownloading(true);
    try {
      await downloadFileFromS3(
        caseDetails?.passportFormUrl,
        `${passportForm?.personalInfo?.firstName}_${passportForm?.personalInfo?.lastName}_Passport_Application`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDownloading(false);
    }
  };
  useEffect(() => {
    document
      .getElementById("passport-form-heading-message")
      ?.scrollIntoView({ behavior: "smooth", inline: "start" });
  }, [currentStep]);
  useEffect(() => {
    if (passportForm && Object.keys(passportForm).length > 0) {
      refreshCompletionPercentage();
    }
  }, [passportForm]);
  useEffect(() => {
    fetchFormFillStatus();
  }, []);

  if (!initialised) {
    return <LoadingPage />;
  }
  if (caseDetails?.isAccessible === false) {
    return <CaseBlocked caseNo={caseDetails?.caseNo} />;
  }
  if (
    process === "failed" ||
    caseDetails?.applicationReviewStatus === "upload"
  ) {
    return (
      <Card className="flex flex-col gap-4 items-center my-[20vh] w-fit p-8 mx-auto">
        <Image
          alt="technical-issue"
          src={IMGS.TechnicalIssue}
          height={400}
          width={400}
          className="object-cover size-40"
        />
        <p className="text-center text-primary font-semibold text-lg md:w-[30vw] w-[80vw] break-words">
          SORRY! We are facing technical issues.
        </p>
        <p className="text-center text-slate-500 font-medium text-base md:w-[30vw] w-[80vw] break-words">
          We were not able to automatically generate your passport application.
          Don&apos;t worry, your Visa specialist is working on assisting you
          manually with your process.
        </p>
        {/* //link to dashboard  */}
        <Link
          href="/dashboard/my-applications"
          className="text-blue-400 font-medium text-base underline"
        >
          Go to Dashboard
        </Link>
      </Card>
    );
  }
  if (passportForm && caseDetails) {
    if (
      caseDetails?.applicationReviewStatus !== "pending" &&
      caseDetails?.applicationReviewStatus !== "rejected" &&
      process !== "success"
    ) {
      return (
        <div className="flex flex-col items-center gap-4 my-[30vh]">
          <XCircle size={"7rem"} className="text-primary" />
          <span className="font-semibold text-base text-slate-500 text-center">
            Application already submitted
          </span>
        </div>
      );
    } else {
      return (
        <div className="">
          {caseDetails?.applicationReviewStatus === "ongoing" ? (
            <div className="flex flex-col gap-4 items-center my-[20vh]">
              <Image
                alt="success-icon"
                height={400}
                width={400}
                src={purpleCheckIcon}
                className="size-[13rem] -my-8"
              />
              <p className="text-center text-primary font-semibold text-lg md:w-[30vw] w-[80vw] break-words">
                CONGRATULATIONS!
              </p>
              <p className="text-center text-primary font-semibold text-base md:w-[30vw] w-[80vw] break-words">
                Your passport application has been generated and it’s ready for
                your preview. Please click below to preview your passport
                application.
              </p>
              <p className="text-center text-base md:w-[30vw] w-[80vw] break-words">
                Our team is now reviewing your application details.
              </p>
              <div
                id="preview-a-tag"
                onClick={downloadForm}
                className="bg-primary flex items-center justify-center text-center hover:bg-blue-900 w-56 text-white font-bold p-4 rounded"
              >
                {downloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "View Passport Form Preview"
                )}
              </div>
              <span className="md:w-1/3 break-words text-slate-600 text-[1.2rem] text-center">
                After reviewing your application form,{" "}
                <Link
                  replace={true}
                  href={`/dashboard/my-applications/${params?.caseId}`}
                  className="text-blue-500 whitespace-nowrap"
                >
                  Click here
                </Link>{" "}
                to return to your dashboard to complete the upcoming steps.
              </span>
            </div>
          ) : (
            <>
              <div className="my-3 md:-ml-10 flex justify-start">
                <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
              </div>
              <Card className="md:w-3/4 w-full px-4 py-6 flex flex-col items-center justify-center mx-auto">
                <span
                  className="text-xs md:text-base w-3/4 text-wrap text-slate-500 text-center mb-2"
                  id="passport-form-heading-message"
                >
                  <DynamicUserDetail
                    property="firstName"
                    className="text-deep-blue font-bold"
                  />
                  , please complete each page of this Government Passport
                  Application Form. The form will auto-generate at the end with
                  a barcode assigned to your name by the Department of State,
                  Passport Agency.
                </span>
                <div className="flex gap-2 items-center flex-col md:flex-row w-full md:w-[70%] mb-4">
                  <Progress value={completionPercentage} />
                  <span className="hidden md:block text-base whitespace-nowrap font-semibold">
                    {completionPercentage}% completed
                  </span>
                </div>
                {renderComponent(
                  formSteps[currentStep].component,
                  formSteps[currentStep].key
                )}
                <div className="flex flex-col items-center">
                  <Link
                    href={"/dashboard/my-applications"}
                    className="text-blue-500 text-base font-medium"
                  >
                    Return to dashboard?
                  </Link>
                  <span className="text-slate-500">
                    Your progress upto now will be saved
                  </span>
                </div>
              </Card>
            </>
          )}
        </div>
      );
    }
  } else {
    return <LoadingPage />;
  }
};

export default Page;
