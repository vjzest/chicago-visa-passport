import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DynamicForm from "@/components/pages/apply-step1/dynamic-form";
import { useCaseStore } from "@/store/use-case-store";
import useHydration from "@/hooks/use-hydration";
import ServiceLevelCards from "../apply/service-level-cards";
import AdditionalServicesCards from "../apply/additional-services-cards";
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
import { ServiceTypeSelect } from "./service-type-select";
import OrderFormSideInfo from "../apply-step1/order-form-side-info";
import DepartureDateField from "./departure-date-field";

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
}: {
  forms: IForm[];
  setCurrentStep: (step: IApplySteps) => void;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
  triggerSubmit: null | number;
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
      document.getElementById("serviceLevelSelectCard")?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "center",
      });
      setMovingToNextStep(false);
      return toast.error("Please Select a Speed of Service", {
        position: "top-center",
      });
    }

    if (isDepartureDateRequired && !generalFormData?.departureDate) {
      document.getElementById("departureDateField")?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "center",
      });
      setMovingToNextStep(false);
      return toast.error("Please enter your Departure Date", {
        position: "top-center",
      });
    }

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
          setServiceTypes(
            storeServiceTypes?.map((service: any) => {
              return {
                value: service._id,
                label: service.serviceType,
                name: service.serviceType,
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
      // Show all service levels to allow user selection regardless of backend mapping
      let _serviceLevels = serviceLevels;
      // let _serviceLevels = serviceLevels?.filter((serviceLevel) =>
      //   serviceLevel?.serviceTypes?.some(
      //     (serviceType: any) => serviceType === generalFormData?.serviceType
      //   )
      // );

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

  return (
    <div className=" flex w-full flex-col justify-center ">
      {serviceTypes.length > 0 ? (
        <ServiceTypeSelect serviceTypes={serviceTypes} />
      ) : (
        <Skeleton className="w-full md:w-2/3 h-32" />
      )}

      <div className="flex w-full gap-4 md:gap-6 flex-col md:flex-row md:items-stretch">
        <div className="md:w-2/3 w-full">
          {
            <ServiceLevelCards
              disabled={!generalFormData?.serviceType}
              govFee={govFee}
              services={filteredServiceLevels}
            />
          }
          {/* <span className="font-medium text-slate-400">
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
          </span> */}
          {/* Departure Date field */}
          <DepartureDateField />
          {generalFormData?.serviceType &&
            filteredAdditionalServices.length > 0 && (
              <AdditionalServicesCards services={filteredAdditionalServices} />
            )}
          <section className="h-fit w-full" id="applicant-tab">
            <Card className="mt-3   !shadow">
              <div className="space-y-1">
                <div key={"applicantInfoForm"} className="my-5 px-2 md:px-5">
                  <h2
                    id="applicationInfoDiv"
                    className=" scroll-mt-10 text-xl font-semibold text-primary"
                  >
                    Applicant Information
                  </h2>
                  {!applicantInfoForm && <FormSkeleton rows={[2, 2]} />}
                  {applicantInfoForm && (
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
                  )}
                </div>
                <div key={"contactInfoForm"} className="mb-5 mt-3 px-2 md:px-5">
                  <h2 className="mb-2 text-xl font-semibold text-primary">
                    Contact Information
                  </h2>
                  {!contactInfoForm && <FormSkeleton rows={[2, 2]} />}
                  {contactInfoForm && (
                    <>
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
                      {!isLoggedIn && (
                        <p className=" w-fit text-gray-600 text-sm mb-2">
                          {
                            "Note: This email is used to give access to your Client Portal and to send updates regarding your Visa application. "
                          }
                        </p>
                      )}
                      <div className="mb-3 flex items-center space-x-2">
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
                          className="md:w-[40vw]T  text-sm font-medium leading-none text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Yes, please keep me updated on my order via automated
                          text message and email. Message and data rates may
                          apply.
                        </label>
                      </div>
                    </>
                  )}
                </div>
                <TravelPlansOrderForm form={travelPlansForm} />
              </div>

              <CardFooter className="mt-5 flex justify-center md:justify-end">
                <Button
                  disabled={movingToNextStep}
                  onClick={handleContinue}
                  className="!px-16"
                >
                  {movingToNextStep ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Next"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
        <div className="relative mt-10 w-full md:w-1/3">
          <div className="sticky top-36 flex flex-col-reverse gap-5">
            <div className="flex w-full justify-center">
              <OrderFormSideInfo />
            </div>
          </div>
        </div>
      </div>
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
