import { Button } from "@/components/ui/button";
import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DynamicForm from "@/components/pages/apply-step1/dynamic-form";
import { useCaseStore } from "@/store/use-case-store";
import useHydration from "@/hooks/use-hydration";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { isValidEmail, isValidPhoneNumber } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/use-auth-store";
import TravelPlansOrderForm from "./travel-plans-order-form";
import FormSkeleton from "@/components/globals/skeleton/form-input-skeleton";
import { useDataStore } from "@/store/use-data-store";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays, addYears, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";
import PassportTypeSelection from "../apply-v2/PassportTypeSelection";
import ImportantNotice from "./important-notice";
import { countries } from "@/data/countries";
import { generalFetchApi } from "@/lib/endpoints/endpoint";

const tomorrow = startOfDay(addDays(new Date(), 1));
const maxDate = startOfDay(addYears(new Date(), 1));

const travelFormSchema = z
  .object({
    hasPlans: z.boolean(),
    destination: z.string().min(1, "Destination is required").optional(),
    travelPurpose: z.string().min(1, "Travel purpose is required").optional(),
    travelDate: z
      .string()
      .refine((val) => {
        if (!val) return true; // Handled by the superRefine
        const date = new Date(val);
        return date >= tomorrow && date <= maxDate;
      }, "Date must be between tomorrow and 1 year from now")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasPlans) {
      if (!data.destination) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["destination"],
          message: "Destination is required",
        });
      }
      if (!data.travelPurpose) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["travelPurpose"],
          message: "Travel purpose is required",
        });
      }
      if (!data.travelDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["travelDate"],
          message: "Travel date is required",
        });
      }
    }
  });

export type TravelPlansFormData = z.infer<typeof travelFormSchema>;

const ApplicationFormSection = ({
  forms,
  setCurrentStep,
  setTriggerSubmit,
  triggerSubmit,
  isOfflineLink = false,
}: {
  forms: IForm[];
  setCurrentStep: (step: IApplySteps) => void;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
  triggerSubmit: null | number;
  isOfflineLink?: boolean;
}) => {
  const { storeServiceTypes, storeServiceLevels, storeAdditionalServices } =
    useDataStore((state) => state);
  const [movingToNextStep, setMovingToNextStep] = useState(false);
  const isHydrated = useHydration();
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [serviceLevels, setServiceLevels] = useState<any[]>([]);
  const [filteredServiceLevels, setFilteredServiceLevels] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<
    IAdditionalService[]
  >([]);
  const [filteredAdditionalServices, setFilteredAdditionalServices] = useState<
    IAdditionalService[]
  >([]);
  const [govFee, setGovFee] = useState<number | "">("");
  const fetchGovFee = async () => {
    try {
      const { data } = await axiosInstance.get("/common/gov-fee");
      setGovFee(data?.data);
    } catch (error) {
      console.error("Error fetching government fee:", error);
    }
  };
  useEffect(() => {
    fetchGovFee();
  }, []);
  const { userData } = useCaseStore((state) => state);
  const { isLoggedIn } = useAuthStore((state) => state);

  const [formError, setFormError] = useState(false);
  const {
    generalFormData,
    travelPlansOrderFormData,
    setTravelPlansOrderFormData,
    setGeneralFormData,
    accountDetails,
    setAccountDetails,
    isDepartureDateRequired,
  } = useCaseStore((state) => state);
  const travelPlansForm = useForm<TravelPlansFormData>({
    resolver: zodResolver(travelFormSchema),
    defaultValues: travelPlansOrderFormData || {
      hasPlans: false,
      destination: "",
      travelDate: "",
      travelPurpose: "",
    },
  });
  const { formData, setFormData, sourceInfoData, setSourceInfoData } =
    useCaseStore((state) => state);
  // const [triggerSubmit, setTriggerSubmit] = useState<null | number>(null);
  const formRefs = useRef<{ [key: string]: React.RefObject<HTMLFormElement> }>(
    {}
  );

  useEffect(() => {
    forms?.forEach((form) => {
      formRefs.current[form.id] = React.createRef();
    });
  }, [forms]);

  const handleFormSubmit = async (formId: string, data: any) => {
    // console.log(`Form ${formId} submitted:`, data);
  };

  const checkEmailExists = async () => {
    if (!allowEmailCheck) {
      return setWaitingCheck(true);
    }
    setWaitingCheck(false);
    setAllowEmailCheck(false);
    try {
      const { data } = await axiosInstance.post("/common/check-email-used", {
        email: typedEmail1,
        token: localStorage.getItem("user_token"),
      });
    } catch (error: any) {
      if (error?.status === 409) {
        setShowEmailLoginPrompt(true);
      }
      console.log(error);
    }
  };
  const [showEmailLoginPrompt, setShowEmailLoginPrompt] = useState(false);
  const [allowEmailCheck, setAllowEmailCheck] = useState(true);
  const [waitingCheck, setWaitingCheck] = useState(false);
  const typedEmail1 = formData?.contactInformation?.email1;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    if (isLoggedIn) return;
    if (emailRegex.test(typedEmail1)) {
      setShowEmailLoginPrompt(false);
      checkEmailExists();
    } else {
      setShowEmailLoginPrompt(false);
      setAllowEmailCheck(true);
    }
  }, [typedEmail1]);
  useEffect(() => {
    if (!allowEmailCheck) {
      setTimeout(() => {
        setAllowEmailCheck(true);
      }, 1500);
    } else if (waitingCheck) {
      checkEmailExists();
    }
  }, [allowEmailCheck]);

  const hasTravelPlans = travelPlansForm.watch("hasPlans");

  const handleContinue = async () => {
    setMovingToNextStep(true);
    setTriggerSubmit(0);

    if (!generalFormData?.serviceType) {
      document.getElementById("serviceTypeSelectCard")?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "center",
      });
      setMovingToNextStep(false);
      return toast.error("Please Select a Service Type", {
        position: "top-center",
      });
    }

    if (!generalFormData?.serviceLevel) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setMovingToNextStep(false);
      return toast.error("Please Select a Speed of Service", {
        position: "top-center",
      });
    }

    // NOTE: departure date is not required for now
    // if (isDepartureDateRequired && !generalFormData?.departureDate) {
    //   document.getElementById("departureDateField")?.scrollIntoView({
    //     behavior: "smooth",
    //     inline: "start",
    //     block: "center",
    //   });
    //   setMovingToNextStep(false);
    //   return toast.error("Please enter your Departure Date", {
    //     position: "top-center",
    //   });
    // }

    //validate the generalFormData.departureDate field to make sure it exits, is in MM/DD/YYYY and it is a date in the past
    if (generalFormData?.departureDate) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!dateRegex.test(generalFormData.departureDate)) {
        document.getElementById("departureDateField")?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "center",
        });
        setMovingToNextStep(false);
        return toast.error("Departure Date must be in MM/DD/YYYY format", {
          position: "top-center",
        });
      }

      const date = new Date(generalFormData?.departureDate);
      const today = new Date();
      const maxYear = new Date("2100-01-01");
      if (date < today) {
        document.getElementById("departureDateField")?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "center",
        });
        setMovingToNextStep(false);
        return toast.error("Departure Date must be in the future", {
          position: "top-center",
        });
      }
      if (date > maxYear) {
        document.getElementById("departureDateField")?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "center",
        });
        setMovingToNextStep(false);
        return toast.error("Invalid Departure Date", {
          position: "top-center",
        });
      }
    }

    const validation = validateData(forms, formData, 1);
    if (hasTravelPlans) {
      const success = await travelPlansForm.trigger();
      travelPlansForm.handleSubmit(() => {
        return null;
      })();
      if (!success) {
        setMovingToNextStep(false);
        if (validation) {
          document.getElementById("applicationInfoDiv")?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
          return toast.error(
            "Please fill all required fields related to your application and travel plans",
            {
              position: "top-center",
            }
          );
        } else {
          document.getElementById("travelPlansForm")?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
          return toast.error(
            "Please fill all required fields related to your travel plans",
            {
              position: "top-center",
            }
          );
        }
      }
      const submitTravelPlans = travelPlansForm.handleSubmit((values) => {
        setTravelPlansOrderFormData(values);
      });
      submitTravelPlans();
    } else {
      setTravelPlansOrderFormData({ hasPlans: false });
    }
    if (validation) {
      setMovingToNextStep(false);
      document.getElementById("applicationInfoDiv")?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
      return toast.error(
        typeof validation === "string"
          ? validation
          : "Please fill all required fields related to your application",
        {
          position: "top-center",
        }
      );
      console.log("Errors forund in form");
    }
    try {
      const { data } = await axiosInstance.post("/common/check-email-used", {
        email: formData?.contactInformation?.email1,
        token: localStorage.getItem("user_token"),
      });

      if (validation === 0) {
        setCurrentStep("shipping");
        document.getElementById("steps-guide-header")?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
        });
      }
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error("This primary email is already registered.", {
          description:
            "Please login to continue or use a different email address.",
          position: "top-center",
        });
      } else {
        if (validation === 0) {
          document.getElementById("steps-guide-header")?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
          });
          setCurrentStep("shipping");
        }
      }
    }
    setMovingToNextStep(false);
  };
  useEffect(() => {
    try {
      (async () => {
        try {
          setAdditionalServices(storeAdditionalServices);
          setServiceLevels(
            storeServiceLevels?.map((service: any) => {
              return {
                value: service?._id,
                title: service?.serviceLevel,
                price: service?.price,
                description: service?.serviceLevel,
                time: service?.time,
                serviceTypes: service?.serviceTypes,
                nonRefundableFee: service?.nonRefundableFee,
              };
            })
          );
          console.log({ storeServiceTypes });
          setServiceTypes(
            storeServiceTypes?.map((service: any) => {
              return {
                value: service._id,
                label: service.serviceType,
                name: service.serviceType,
                silentKey: service.silentKey,
                description: service?.description,
              };
            })
          );
        } catch (error) { }
      })();
    } catch (error) { }
  }, [storeServiceTypes, storeAdditionalServices, storeServiceLevels]);

  const applicantInfoForm = forms?.find((form) => form?.id === "applicantInfo");
  const contactInfoForm = forms?.find(
    (form) => form?.id === "contactInformation"
  );

  useEffect(() => {
    if (isLoggedIn && userData) {
      // Initialize contactInformation if it doesn't exist
      if (!formData.contactInformation) {
        formData.contactInformation = {};
        formData.contactInformation.email1 = userData.email;
        formData.contactInformation.email2 = userData.email2;
        formData.contactInformation.phone1 = userData.phone;
        formData.contactInformation.phone2 = userData.phone2;
      }
    }
  }, [isLoggedIn, userData, formData]);
  const [isAdditionalsFiltered, setIsAdditionalsFiltered] = useState(false);
  //remove additinal service if it is not in current list
  useEffect(() => {
    if (
      generalFormData?.additionalServices?.length > 0 &&
      storeAdditionalServices?.length > 0 &&
      !isAdditionalsFiltered
    ) {
      const filteredServices = generalFormData?.additionalServices.filter(
        (service: any) => {
          return storeAdditionalServices?.some((storeService: any) => {
            return storeService?._id === service?._id;
          });
        }
      );
      setIsAdditionalsFiltered(true);
      setGeneralFormData({
        ...generalFormData,
        additionalServices: filteredServices,
      });
    }
  }, [storeAdditionalServices, generalFormData, isAdditionalsFiltered]);

  useEffect(() => {
    setIsAdditionalsFiltered(false);
  }, [generalFormData?.additionalServices?.length]);

  useEffect(() => {
    if (generalFormData.serviceType) {
      // Relaxed filtering to show all service levels regardless of mapping
      let _serviceLevels = serviceLevels;

      let _additionalServices = additionalServices?.filter((service) =>
        service?.serviceTypes?.some(
          (type) => type?._id === generalFormData?.serviceType
        )
      );

      setFilteredAdditionalServices(_additionalServices);
      setFilteredServiceLevels(_serviceLevels);
    } else {
      setFilteredAdditionalServices(additionalServices);
      setFilteredServiceLevels(serviceLevels);
    }
  }, [serviceLevels, serviceTypes, generalFormData?.serviceType]);

  const selectedServiceType = useMemo(() => {
    return storeServiceTypes?.find(
      (el) => el?._id === generalFormData?.serviceType
    );
  }, [generalFormData?.serviceType, storeServiceTypes]);

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.code === code);
    return country?.name || code;
  };

  const citizenOfName = useMemo(
    () => getCountryName(generalFormData?.citizenOf),
    [generalFormData?.citizenOf]
  );
  // const residingInName = useMemo(
  //   () => getCountryName(generalFormData?.residingIn),
  //   [generalFormData?.residingIn]
  // );
  const travelingToName = useMemo(
    () => getCountryName(generalFormData?.travelingTo),
    [generalFormData?.travelingTo]
  );

  // Consular fees state and logic
  const [consularFees, setConsularFees] = useState<any[]>([]);
  const [isLoadingConsularFees, setIsLoadingConsularFees] = useState(false);

  // Fetch consular fees when country pair changes
  useEffect(() => {
    const fetchConsularFees = async () => {
      const fromCountry = generalFormData?.citizenOf;
      const toCountry = generalFormData?.travelingTo;

      if (!fromCountry || !toCountry) {
        setConsularFees([]);
        return;
      }

      setIsLoadingConsularFees(true);
      try {
        const response = await generalFetchApi.getConsularFees({
          fromCountryCode: fromCountry,
          toCountryCode: toCountry,
        });

        if (response?.success && response?.data) {
          setConsularFees(response.data);
        } else {
          setConsularFees([]);
        }
      } catch (error) {
        console.error("Error fetching consular fees:", error);
        setConsularFees([]);
      } finally {
        setIsLoadingConsularFees(false);
      }
    };

    fetchConsularFees();
  }, [generalFormData?.citizenOf, generalFormData?.travelingTo]);

  // Create a map of consular fees for easy lookup
  const consularFeeMap = useMemo(() => {
    const map = new Map<string, number>();
    consularFees.forEach((fee: any) => {
      const serviceLevelId = typeof fee.serviceLevelId === 'object'
        ? fee.serviceLevelId._id
        : fee.serviceLevelId;
      const serviceTypeId = typeof fee.serviceTypeId === 'object'
        ? fee.serviceTypeId._id
        : fee.serviceTypeId;
      const key = `${serviceLevelId}-${serviceTypeId}`;
      map.set(key, fee.fee);
    });
    return map;
  }, [consularFees]);

  // Get consular fee for a specific service level
  const getConsularFee = (serviceLevelId: string): number | null => {
    const serviceTypeId = generalFormData?.serviceType;
    if (!serviceTypeId) return null;

    const key = `${serviceLevelId}-${serviceTypeId}`;
    return consularFeeMap.get(key) ?? null;
  };

  return (
    <div className="pr-10 pl-10 lg:pl-0 pb-10 w-full">
      <div className="mt-5 mb-4 text-base text-gray-600 flex gap-5">
        <div className="flex items-center gap-1">
          Citizen Of:{" "}
          <span className="font-semibold text-primary">{citizenOfName}</span>
        </div>
        {/* <div className="flex items-center gap-1">
          Residing In:{" "}
          <span className="font-semibold text-primary">{residingInName}</span>
        </div> */}
        <div className="flex items-center gap-1">
          Traveling To:{" "}
          <span className="font-semibold text-primary">{travelingToName}</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-primary mb-4">
        Visa type, Applicant and Contact information
      </h2>
      {/* {console.log({ first: serviceTypes.length })} */}
      <div className=" flex w-full flex-col justify-center !mr-10 mt-5 bg-white rounded-md p-10">
        {serviceTypes.length > 0 ? (
          <PassportTypeSelection serviceTypes={serviceTypes} />
        ) : (
          <Skeleton className="w-full md:w-2/3 h-32" />
        )}

        {/* Service Selection Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Speed of Service:
            </h3>
            {/* <p className="text-sm text-gray-600 mb-4">
              {generalFormData?.serviceType ? (
                <>
                  Visa type selected:{" "}
                  <span className="font-medium text-primary">
                    {selectedServiceType?.serviceType}
                  </span>
                </>
              ) : (
                <span className="font-medium text-xl text-primary/40">
                  * Please select a visa type
                </span>
              )}
            </p> */}
          </div>

          {generalFormData?.serviceType && filteredServiceLevels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredServiceLevels.map((service, index) => {
                const isSelected =
                  generalFormData?.serviceLevel === service.value;
                const isPopular = index === 0; // Make first service "Most Popular"

                return (
                  <div key={service.value} className="relative  ">
                    {/* Most Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-purple-500 whitespace-nowrap text-white text-xs font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        setGeneralFormData({
                          ...generalFormData,
                          serviceLevel: service.value,
                        });
                      }}
                      className={`relative p-4 h-full rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Service Details */}
                      <div className="text-center  flex flex-col justify-between h-full">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                            {service.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {service.time}
                          </p>

                          <div className="text-lg font-bold text-gray-900 mb-1">
                            ${service.price}
                            <span className="text-xs font-normal text-gray-500">
                              {" "}
                              Service Fee
                            </span>
                          </div>

                          {/* Consular Fee */}
                          <div className="text-sm text-gray-700 mb-2">
                            {isLoadingConsularFees ? (
                              <span className="text-gray-400">Loading...</span>
                            ) : getConsularFee(service.value) !== null ? (
                              <>
                                <span className="font-semibold">${getConsularFee(service.value)}</span>
                                <span className="text-xs text-gray-500"> Consular Fee</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">Consular Fee: N/A</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        {/* <Button
                          className={`w-full self-end  py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-green-500 text-white"
                              : "bg-primary text-white hover:bg-primary/80"
                          }`}
                        >
                          {isSelected ? "Selected" : "Choose"}
                        </Button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="font-medium text-base text-primary/40 pl-10 -mt-3">
              Please select a visa type
            </span>
          )}

          {/* Government Fee Note */}
          {/* <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">
              *Government fee of $
              {Number(
                selectedServiceType?.silentKey === "passport-card"
                  ? 111.36
                  : govFee
              ) +
                Number(
                  generalFormData.additionalServices?.some(
                    (el: any) => el?.title === "Passport Card"
                  )
                    ? selectedServiceType?.silentKey === "child-passport"
                      ? 15
                      : 30
                    : 0
                )}{" "}
              to be paid to the U.S Department of State not included
            </span>
          </div> */}
        </div>

        <div className="flex w-full gap-4 md:gap-6 flex-col md:flex-row md:items-stretch">
          <div className=" w-full">
            {/* Departure Date field */}
            {/* <DepartureDateField /> */}
            <section className="h-fit mt-8 w-full" id="applicant-tab">
              <div className="space-y-6">
                {/* Applicant Information Section */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h2
                    id="applicationInfoDiv"
                    className="scroll-mt-10 text-xl font-semibold text-primary mb-4"
                  >
                    Applicant Information
                  </h2>
                  {!applicantInfoForm && <FormSkeleton rows={[2, 2]} />}
                  {applicantInfoForm && (
                    <div className=" gap-4">
                      <DynamicForm
                        setFormError={setFormError}
                        formInfo={applicantInfoForm}
                        tabIndex={0}
                        onSubmit={(data) =>
                          handleFormSubmit(applicantInfoForm?.id, data)
                        }
                        triggerSubmit={triggerSubmit}
                        setTriggerSubmit={setTriggerSubmit}
                        ref={formRefs?.current?.[applicantInfoForm?.id]}
                        fieldsPerRowArray={[2, 2]}
                      />
                    </div>
                  )}
                </div>

                {/* Contact Information Section */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-primary mb-4">
                    Contact Information
                  </h2>
                  {!contactInfoForm && <FormSkeleton rows={[2, 2]} />}
                  {contactInfoForm && (
                    <div className="space-y-4">
                      <div className=" gap-4">
                        <DynamicForm
                          setFormError={setFormError}
                          formInfo={contactInfoForm}
                          tabIndex={0}
                          onSubmit={(data) =>
                            handleFormSubmit(contactInfoForm?.id, data)
                          }
                          triggerSubmit={triggerSubmit}
                          setTriggerSubmit={setTriggerSubmit}
                          ref={formRefs?.current?.[contactInfoForm?.id]}
                          fieldsPerRowArray={[2, 2]}
                          showEmailLoginPrompt={showEmailLoginPrompt}
                        />
                      </div>

                      {!isLoggedIn && (
                        <p className="text-sm text-gray-600">
                          Note: This email is used to give access to your Client
                          Portal and to send updates regarding your Visa
                          application.
                        </p>
                      )}

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="consentToUpdates"
                          className="size-5"
                          defaultChecked={true}
                          checked={accountDetails?.consentToUpdates}
                          onCheckedChange={(checked) =>
                            setAccountDetails({
                              ...accountDetails,
                              consentToUpdates: !!checked,
                            })
                          }
                        />
                        <label
                          htmlFor="consentToUpdates"
                          className="text-sm text-gray-700 cursor-pointer flex-1"
                        >
                          Yes, please keep me updated on my order via automated
                          text message and email. Message and data rates may
                          apply.
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Travel Plans Section */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <TravelPlansOrderForm form={travelPlansForm} />
                  {/* <DepartureDateField /> */}
                </div>

                <ImportantNotice />

                {/* Next Step Button */}
                <div className="flex justify-end">
                  <Button
                    disabled={movingToNextStep}
                    onClick={handleContinue}
                    // size={"xl"}
                    className=" px-5 !h-fit  bg-primary hover:bg-primary/80 text-white font-medium rounded-lg flex items-center"
                  >
                    {movingToNextStep ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <div className="flex flex-col !py-2 items-start">
                        <div className="flex items-center">
                          <span className="text-base">Next Step</span>
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-200 whitespace-pre-wrap text-start">
                          {`Speed of service, Applicant's Shipping Information / Payment For Services`}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* <NeedSupport /> */}
    </div>
  );
};

export default ApplicationFormSection;

// ///////////////////////////
interface Validation {
  value: boolean | number;
  message?: string;
}

interface FieldValidations {
  required?: Validation;
  minLength?: Validation;
  maxLength?: Validation;
}

interface Application {
  [key: string]: {
    [key: string]: string;
  };
}

interface Data {
  applications: Application[];
  [key: string]:
  | Application[]
  | {
    [key: string]: string;
  };
}

export function validateData(
  forms: IForm[],
  // data: Data,
  data: any,
  step?: number
): number | string {
  // Helper function to validate a single field
  function validateField(
    field: IDynamicFormField,
    value: string | undefined
  ): string | null {
    if (field?.key === "phone2") console.log({ field, value });
    if (field?.key === "phone2" && !value) return null;

    if (field?.key === "email2" && value) {
      const email1 = data?.contactInformation?.email1;
      console.log({ email1, value });
      if (value === email1) {
        return "Email2 cannot be the same as Email1";
      }
      if (!isValidEmail(value)) {
        return "Email2 must be a valid email address";
      }
    }

    if (field?.key === "phone2" && value) {
      const phone1 = data?.contactInformation?.phone1;
      console.log({ phone1, value });
      if (value === phone1) {
        return "Phone2 cannot be the same as Phone1";
      }
      if (!isValidPhoneNumber(value)) {
        return "Phone2 must be a valid 10-digit phone number";
      }
    }
    if (field.key === "dateOfBirth") {
      console.log("date of birth : ", value);
    }
    if (field?.validations) {
      if (
        field?.validations?.required?.value &&
        (value === undefined || value === "" || value === null)
      ) {
        return (
          field?.validations?.required?.message || `${field?.title} is required`
        );
      }
      if (value === undefined) return null; // Skip other validations if value is undefined
      if (
        field?.validations?.minLength &&
        typeof value === "string" &&
        value?.length < Number(field?.validations?.minLength?.value)
      ) {
        return (
          field?.validations?.minLength?.message ||
          `${field?.title} is too short`
        );
      }
      if (
        field?.validations?.maxLength &&
        typeof value === "string" &&
        value?.length > Number(field?.validations?.maxLength?.value)
      ) {
        return (
          field?.validations?.maxLength?.message ||
          `${field?.title} is too long`
        );
      }
      if (field.type === "date" && value) {
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!dateRegex.test(value)) {
          return `${field.title} must be a valid date in MM/DD/YYYY format`;
        }

        // Check if it's a valid date (e.g., not 02/31/2023)
        const [month, day, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        if (
          date.getMonth() !== month - 1 ||
          date.getDate() !== day ||
          date.getFullYear() !== year
        ) {
          return `${field.title} is not a valid date`;
        }
      }
      if (
        field?.validations?.restrictPastDates?.value &&
        field.type === "date" &&
        value < new Date().toISOString().split("T")[0]
      ) {
        return (
          field?.validations?.restrictPastDates?.message ||
          `${field?.title} cannot be in the past`
        );
      }
      if (
        field?.validations?.restrictFutureDates?.value &&
        field.type === "date" &&
        value
      ) {
        // Parse the mm/dd/yyyy format to a Date object
        const [month, day, year] = value.split("/").map(Number);
        const inputDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for date comparison

        if (inputDate > today) {
          return (
            field?.validations?.restrictFutureDates?.message ||
            `${field?.title} cannot be in the future`
          );
        }
      }
      if (field.type === "email" && value) {
        if (!isValidEmail(value)) {
          return (
            field?.validations?.pattern?.message ||
            `${field.title} must be a valid email address`
          );
        }
      }
      if (field.type === "tel" && value) {
        if (!isValidPhoneNumber(value)) {
          return (
            field?.validations?.pattern?.message ||
            `${field.title} must be a valid 10-digit phone number`
          );
        }
      }
    }
    return null;
  }
  for (const form of forms) {
    if (step === 1 && form?.id === "shippingInformation") continue;
    // if (form.id !== "shippingInformation") {

    const commonData = data?.[form?.id] as { [key: string]: string };
    for (const field of form?.fields) {
      const value = commonData?.[field?.key];
      const error = validateField(field, value);
      if (error) {
        return error; // Return the error message for common forms
      }
    }
    // }
  }
  if (step === 2 && data.isBillingSameAsShipping === false) {
    const billingData = data?.["billingInformation"] as {
      [key: string]: string;
    };
    const shippingForm = forms.find((f) => f.id === "shippingInformation");
    for (const field of shippingForm?.fields ?? []) {
      const value = billingData?.[field?.key];
      const error = validateField(field, value);
      if (error) {
        return error; // Return the error message for common forms
      }
    }
  }

  return 0; // No errors found
}
