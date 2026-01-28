"use client";
import React, {
  Profiler,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ApplicationFormSection from "@/components/pages/step/application-form-section";
import { generalFetchApi } from "@/lib/endpoints/endpoint";
import OrderSummary from "@/components/pages/apply-step1/order-summary";
import { useCaseStore } from "@/store/use-case-store";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/config/axios";
import StepsGuideHeader from "@/components/pages/apply/steps-guide-header";
import ShippingFormSection from "@/components/pages/step/shipping-form-section";
import { cn, isValidEmail, toKebabCase } from "@/lib/utils";
import { areObjectsEqual } from "@/lib/utils/object";
import LoadingPage from "@/components/globals/loading/loading-page";
import { useDataStore } from "@/store/use-data-store";
import OrderFormSideInfo from "@/components/pages/apply-step1/order-form-side-info";
interface PageProps {
  params: {
    country: string;
  };
}

const ApplyStep: React.FC<PageProps> = ({ params }) => {
  const [currentStep, setCurrentStep] = useState<IApplySteps>("application");
  const searchParams = useSearchParams();
  const [contingentRequestPending, setContingentRequestPending] =
    useState(false);
  const serviceTypeFromUrl = searchParams.get("service-type");
  const [storedContingentId, setStoredContingentId] = useState("");
  const [contingentDataApplied, setContingentDataApplied] = useState(false);
  const [prevData, setPrevData] = useState<object | null>(null);
  const {
    formData,
    setFormData,
    generalFormData,
    setGeneralFormData,
    isDepartureDateRequired,
    setIsDepartureDateRequired,
  } = useCaseStore((state) => state);
  const router = useRouter();
  const [triggerSubmit, setTriggerSubmit] = useState<null | number>(null);
  const currentDataRef = useRef<{
    formData: any;
    generalFormData: any;
    prevData: object | null;
    storedContingentId: string;
  }>({ formData, generalFormData, prevData: null, storedContingentId: "" });

  // const isHydrated = useHydration();
  const [forms, setForms] = useState<IForm[]>([]);

  const saveContingentData = useCallback(async (currentCaseData: any) => {
    if (contingentRequestPending) return;

    try {
      const { storedContingentId } = currentDataRef.current;
      setContingentRequestPending(true);
      const { data } = await axiosInstance.put(
        `/common/contingent?caseId=${storedContingentId && storedContingentId !== "none" ? storedContingentId : localStorage.getItem("contingentcaseid") || ""}`,
        currentCaseData
      );

      if (data.success) {
        setPrevData(currentCaseData);
        const contingentIdFromApi = data?.data?.caseId;
        if (!storedContingentId || storedContingentId !== contingentIdFromApi) {
          setStoredContingentId(contingentIdFromApi);
          localStorage.setItem("contingentcaseid", contingentIdFromApi);
        }
        setContingentRequestPending(false);
      }
    } catch (error) {
      console.error("Error saving contingent data:", error);
    }
  }, []);

  useEffect(() => {
    currentDataRef.current = {
      formData,
      generalFormData,
      prevData,
      storedContingentId,
    };
  }, [formData, generalFormData, prevData, storedContingentId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { formData, generalFormData, prevData } = currentDataRef.current;
      const email = formData?.contactInformation?.email1;

      // Build the current case data object
      const currentCaseData = {
        caseInfo: {
          serviceType: generalFormData?.serviceType || null,
          serviceLevel: generalFormData?.serviceLevel || null,
        },
        applicantInfo: {
          firstName: formData?.applicantInfo?.firstName ?? "",
          middleName: formData?.applicantInfo?.middleName ?? "",
          lastName: formData?.applicantInfo?.lastName ?? "",
          dateOfBirth: formData?.applicantInfo?.dateOfBirth ?? "",
        },
        contactInformation: {
          email1: formData?.contactInformation?.email1 ?? "",
          email2: formData?.contactInformation?.email2 ?? "",
          phone1: formData?.contactInformation?.phone1 ?? "",
          phone2: formData?.contactInformation?.phone2 ?? "",
        },
      };
      const firstName = formData?.applicantInfo?.firstName ?? "";
      const lastName = formData?.applicantInfo?.lastName ?? "";
      const serviceType = generalFormData?.serviceType ?? "";
      // Check if the email is valid and if the data has changed
      if (
        isValidEmail(email) &&
        firstName?.length > 1 &&
        lastName?.length > 1 &&
        serviceType &&
        !areObjectsEqual(prevData, currentCaseData)
      ) {
        saveContingentData(currentCaseData);
      }
    }, 7000); // Save every 7 seconds

    // Cleanup the interval on component unmount or dependency change
    return () => clearInterval(interval);
  }, [saveContingentData]);

  useEffect(() => {
    const urlContingentId = searchParams.get("contingentcaseid");
    const validId = urlContingentId || "none";

    // Set the stored contingent ID
    setStoredContingentId(validId);

    // Sync URL param to localStorage if they differ
    if (urlContingentId) {
      localStorage.setItem("contingentcaseid", urlContingentId);
    }
  }, [searchParams]);

  const { storeServiceTypes, storeServiceLevels } = useDataStore((state) => ({
    storeServiceLevels: state.storeServiceLevels,
    storeServiceTypes: state.storeServiceTypes,
  }));
  // console.log("applicant info now: ", formData?.applicantInfo);
  useEffect(() => {
    if (!(storeServiceLevels.length > 0 && storeServiceTypes.length > 0))
      return;
    // console.log("use effect ran");
    if (
      storedContingentId &&
      storedContingentId !== "none" &&
      !contingentDataApplied
    ) {
      // console.log("contingnet id found");

      const fetchAndSetContingentData = async () => {
        try {
          if (!storedContingentId) return;

          // Fetch contingent case data from the API
          const { data } = await axiosInstance.get(
            `/common/contingent/${storedContingentId}`,
            {
              cache: false,
            }
          );
          const contingentData = data?.data;

          // Update general form data
          setGeneralFormData({
            ...generalFormData,
            serviceType: contingentData?.caseInfo?.serviceType ?? "",
            serviceLevel: contingentData?.caseInfo?.serviceLevel ?? "",
          });
          // console.log("set services");

          // Update form data
          setFormData({
            ...formData,
            applicantInfo: {
              firstName: contingentData?.applicantInfo?.firstName ?? "",
              middleName: contingentData?.applicantInfo?.middleName ?? "",
              lastName: contingentData?.applicantInfo?.lastName ?? "",
              dateOfBirth: contingentData?.applicantInfo?.dateOfBirth ?? "",
            },
            contactInformation: {
              email1: contingentData?.contactInformation?.email1 ?? "",
              email2: contingentData?.contactInformation?.email2 ?? "",
              phone1: contingentData?.contactInformation?.phone1 ?? "",
              phone2: contingentData?.contactInformation?.phone2 ?? "",
            },
          });
          setContingentDataApplied(true);
          router.refresh();
          // console.log("set applicant info");
        } catch (error: any) {
          // Handle 400 errors (invalid or already submitted case)
          if (error?.response?.status === 400) {
            // console.log("remove contingent id");
            localStorage.removeItem("contingentcaseid");
            setStoredContingentId("none");

            // Clean URL param if present
            const params = new URLSearchParams(window.location.search);
            if (params.has("contingentcaseid")) {
              params.delete("contingentcaseid");
              router.replace(`/apply?${params.toString()}`, { scroll: false });
            }
          }
          console.error("Error fetching contingent data:", error);
        }
      };
      fetchAndSetContingentData();
    } else if (serviceTypeFromUrl) {
      const matchingServiceType = storeServiceTypes.find((service) => {
        return (
          toKebabCase(service.serviceType) ===
          toKebabCase(serviceTypeFromUrl ?? "")
        );
      });
      if (!matchingServiceType) return;

      setGeneralFormData({
        ...generalFormData,
        serviceType: matchingServiceType?._id,
        serviceLevel: "",
      });
    }
  }, [
    storedContingentId,
    serviceTypeFromUrl,
    storeServiceTypes,
    storeServiceLevels,
    generalFormData?.serviceType,
  ]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "application":
        return (
          <ApplicationFormSection
            setCurrentStep={setCurrentStep}
            forms={forms}
            setTriggerSubmit={setTriggerSubmit}
            triggerSubmit={triggerSubmit}
          />
        );

      case "shipping":
        return (
          <ShippingFormSection
            triggerSubmit={triggerSubmit}
            setTriggerSubmit={setTriggerSubmit}
            setCurrentStep={setCurrentStep}
            forms={forms}
          />
        );
    }
  };

  const checkDepartureDateRequired = async () => {
    try {
      const { data } = await axiosInstance.get("/common/departure-date-status");
      setIsDepartureDateRequired(!!data.data);
    } catch (error) {
      console.error("Error checking departure date requirement:", error);
    }
  };

  useEffect(() => {
    const getForms = async () => {
      try {
        const response = await generalFetchApi.getForms();
        setForms(response.data || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    getForms();
    checkDepartureDateRequired();
  }, []);

  return (
    <>
      <h2 className="text-center text-base md:text-xl font-semibold uppercase text-deep-blue w-4/5 mx-auto">
        Follow these 3 simple steps to start processing your Visa :
      </h2>
      <StepsGuideHeader
        currentStep={currentStep}
        setCurrentStep={(step) => setCurrentStep(step)}
        forms={forms}
        setTriggerSubmit={setTriggerSubmit}
      />
      <main className="container-2 flex flex-col gap-3">
        <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-stretch ">
          {/* currentStep !== "order-confirmation" */}
          {/* <div className="mt-6 w-3/4 ">{renderCurrentStep()}</div> */}
          <div
            className={cn(
              "mt-6 ",
              currentStep === "application" ? "w-full" : "w-full md:w-3/4"
            )}
          >
            {renderCurrentStep()}
          </div>
          {currentStep === "shipping" && (
            <div className="relative mt-10 w-full md:w-1/3">
              <div className="sticky top-36 flex flex-col-reverse gap-5">
                <div className="flex w-full justify-center">
                  <OrderSummary />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const Page = ({ params }: { params: any }) => (
  <Suspense fallback={<LoadingPage />}>
    <Profiler
      onRender={() => {
        console.log("rendered");
      }}
      id="ApplyPage"
    >
      <ApplyStep params={params} />
    </Profiler>
  </Suspense>
);
export default Page;
