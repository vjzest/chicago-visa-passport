"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import PassportApplicationFormSection from "@/components/pages/step-v2/passport-application-form-section";
import { generalFetchApi } from "@/lib/endpoints/endpoint";
import { useCaseStore } from "@/store/use-case-store";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/config/axios";
import PassportStepsNavigation from "@/components/pages/apply-v2/PassportStepsNavigation";
import ShippingFormSection from "@/components/pages/step-v2/shipping-form-section";
import { cn, isValidEmail, toKebabCase } from "@/lib/utils";
import { areObjectsEqual } from "@/lib/utils/object";
import LoadingPage from "@/components/globals/loading/loading-page";
import { useDataStore } from "@/store/use-data-store";
import OrderSummaryV2 from "@/components/pages/step-v2/order-summary/order-summary-v2";
import useFetchStoreData from "@/hooks/use-fetch-store-data";
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
  const [contingentDataApplied, setContingentDataApplied] = useState(false);
  const serviceTypeFromUrl = searchParams.get("service-type");
  const [storedContingentId, setStoredContingentId] = useState("");
  const [prevData, setPrevData] = useState<object | null>(null);
  const {
    formData,
    setFormData,
    generalFormData,
    setGeneralFormData,
    isDepartureDateRequired,
    setIsDepartureDateRequired,
    isOfflineLink,
    setIsOfflineLink,
    setOfflinePaymentToken,
  } = useCaseStore((state) => state);
  const router = useRouter();
  const { fetchServiceTypes } = useFetchStoreData();
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

  const { storeServiceTypes, storeServiceLevels, setStoreServiceTypes, setStoreServiceLevels } =
    useDataStore((state) => ({
      storeServiceLevels: state.storeServiceLevels,
      storeServiceTypes: state.storeServiceTypes,
      setStoreServiceTypes: state.setStoreServiceTypes,
      setStoreServiceLevels: state.setStoreServiceLevels,
    }));

  // Fetch service types with mandatory country filters
  useEffect(() => {
    // Only fetch if all three country selections are present
    if (
      generalFormData?.citizenOf &&
      generalFormData?.residingIn &&
      generalFormData?.travelingTo
    ) {
      console.log("Fetching service types with country filters:", {
        citizenOf: generalFormData.citizenOf,
        residingIn: generalFormData.residingIn,
        travelingTo: generalFormData.travelingTo,
      });
      fetchServiceTypes({
        citizenOf: generalFormData.citizenOf,
        residingIn: generalFormData.residingIn,
        travelingTo: generalFormData.travelingTo,
      });
    } else {
      console.log(
        "Country selections not complete, fetching with defaults (IN -> US)"
      );
      // Fallback for direct access: Fetch with default values
      fetchServiceTypes({
        citizenOf: "IN",
        residingIn: "IN",
        travelingTo: "US",
      });
    }
  }, [
    generalFormData?.citizenOf,
    generalFormData?.residingIn,
    generalFormData?.travelingTo,
    fetchServiceTypes,
  ]);

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

  // Handle Offline Payment Link Logic
  useEffect(() => {
    const type = searchParams.get("type");
    const token = searchParams.get("token");

    console.log("Offline Link Check:", { type, token });

    if (type === "directLink" && token) {
      console.log("Verifying link...");
      const verifyLink = async () => {
        try {
          const response = await axiosInstance.get(
            `/common/payment-links/${token}`
          );
          if (response?.data?.success) {
            const linkData = response?.data?.data;
            console.log("DEBUG: Raw Link Data:", linkData);
            console.log("DEBUG: Incoming Service Type:", linkData?.serviceType);

            // Push the specific service type from the link into the store
            // This ensures it matches the ID we are about to set, preventing "gray box" UI
            if (linkData?.serviceType) {
              const rawService = linkData.serviceType;
              // START FIX: detect correct name field
              const serviceName =
                rawService.serviceType ||
                rawService.name ||
                rawService.title ||
                rawService.label ||
                linkData?.serviceName ||
                "Visa Service";
              // END FIX

              const injectedService = typeof rawService === 'object'
                ? {
                  ...rawService,
                  serviceType: serviceName, // Ensure label is correct
                  description: rawService.description || `<p>${serviceName}</p>`
                }
                : {
                  serviceType: "Visa Service",
                  description: "<p>Service Details</p>"
                };

              setStoreServiceTypes([injectedService]);
            }

            // Determine correct Service Type ID
            const serviceTypeId = typeof linkData?.serviceType === 'object'
              ? linkData?.serviceType?._id
              : linkData?.serviceType;

            // Inject Service Level from Link Data
            if (linkData?.serviceLevel) {
              console.log("DEBUG: Injecting Service Level:", linkData.serviceLevel);
              // Force-add the current serviceType ID to the level's allow-list to bypass filtering
              const injectedLevel = {
                ...linkData.serviceLevel,
                serviceTypes: [serviceTypeId, ...(linkData.serviceLevel.serviceTypes || [])]
              };
              setStoreServiceLevels([injectedLevel]);
            }

            // Pre-fill form with verified data
            setGeneralFormData({
              ...generalFormData,
              serviceType: serviceTypeId,
              serviceLevel: linkData?.serviceLevel?._id,
              citizenOf:
                linkData?.citizenOf || linkData?.fromCountryCode || "IN",
              travelingTo:
                linkData?.travelingTo || linkData?.toCountryCode || "US",
              residingIn:
                linkData?.residingIn || linkData?.stateOfResidency || "IN",
            });
            setIsOfflineLink(true);
            setOfflinePaymentToken(token);

            // toast.success("Payment Link Verified! Details loaded.");
          } else {
            toast.error("Invalid or Expired Payment Link.");
          }
        } catch (error) {
          console.error("Error verifying payment link:", error);
          toast.error("Error checking payment link.");
        }
      };
      verifyLink();
    } else {
      console.log("Normal Flow Detected. Resetting Offline State.");
      // RESET: If not an offline link flow, ensure we are in normal mode
      setIsOfflineLink(false);
      setOfflinePaymentToken("");
    }
  }, [searchParams]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "application":
        return (
          <PassportApplicationFormSection
            setCurrentStep={setCurrentStep}
            forms={forms}
            setTriggerSubmit={setTriggerSubmit}
            triggerSubmit={triggerSubmit}
            isOfflineLink={isOfflineLink}
          />
        );

      case "shipping":
        return (
          <ShippingFormSection
            triggerSubmit={triggerSubmit}
            setTriggerSubmit={setTriggerSubmit}
            setCurrentStep={setCurrentStep}
            forms={forms}
            isOfflineLink={isOfflineLink}
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
      {/* <h2 className="text-center text-base md:text-xl font-semibold uppercase text-deep-blue w-4/5 mx-auto mb-8">
        Follow these 3 simple steps to start processing your U.S Passport :
      </h2> */}

      <main className="container-2T bg-gray-100">
        <div className="flex gap-8">
          {/* Sidebar - Steps Navigation */}
          <div className="hidden lg:block w-3/12 xl:w-3/12">
            <PassportStepsNavigation
              currentStep={currentStep}
              setCurrentStep={(step) => setCurrentStep(step)}
              forms={forms}
              setTriggerSubmit={setTriggerSubmit}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Steps Navigation */}
            <div className="lg:hidden mb-6">
              <PassportStepsNavigation
                currentStep={currentStep}
                setCurrentStep={(step) => setCurrentStep(step)}
                forms={forms}
                setTriggerSubmit={setTriggerSubmit}
              />
            </div>

            {/* Main Form Content */}
            <div className="flex flex-col lg:flex-row gap-0  lg:gap-6 ">
              <div
                className={cn(
                  currentStep === "application"
                    ? "w-full"
                    : "w-full lg:w-3/4 pb-10"
                )}
              >
                {renderCurrentStep()}
              </div>

              {/* Order Summary for Step 2 */}
              {currentStep === "shipping" && (
                <div className="w-full lg:w-4/12 max-sm:px-5 max-lg:px-10 lg:pr-5">
                  <div className="sticky lg:mt-28 lg:top-32">
                    <OrderSummaryV2 />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const Page = ({ params }: { params: any }) => (
  <Suspense fallback={<LoadingPage />}>
    <ApplyStep params={params} />
  </Suspense>
);
export default Page;
