"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/services/axios/axios";
import { formatName } from "@/lib/utils";

// Types
export interface CountryPair {
  _id: string;
  fromCountryCode: string;
  fromCountryName: string;
  toCountryCode: string;
  toCountryName: string;
  isActive: boolean;
}

export interface ServiceTypeWithCountryPair {
  _id: string;
  serviceType: string;
  countryPair: CountryPair;
}

export interface MerchantAccount {
  processorName: string;
  _id: string;
}

export interface LoaFile {
  _id: string;
  name: string;
  url: string;
}

// Schema
export const serviceLevelSchema = z.object({
  _id: z.string().default(""),
  serviceLevel: z.string().min(1, "Service level is required"),
  time: z.string().min(1, "Time is required"),
  speedInWeeks: z.coerce.number().min(1, "Speed in weeks is required"),
  price: z.coerce.number().min(1, "Price should be more than 0"),
  nonRefundableFee: z.coerce
    .number()
    .min(1, "Non-refundable fee should be more than 0"),
  inboundFee: z.coerce.number().min(0, "Inbound shipping fee is required"),
  outboundFee: z.coerce.number().min(0, "Outbound shipping fee is required"),
  paymentGateway: z.string().optional(),
  authOnlyFrontend: z.string().min(1, "Auth frontend type is required"),
  amex: z.boolean(),
  doubleCharge: z.string().min(1, "Double charge type is required"),
  // countryPairs is removed from schema as it is just a UI filter
  serviceTypes: z
    .array(z.string())
    .min(1, "At least one service type must be selected"),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

export type ServiceLevelFormValues = z.infer<typeof serviceLevelSchema>;

export interface UseServiceLevelFormProps {
  submitFunction: (data: any) => Promise<void>;
  initialData?: IServiceLevel;
}

// Constants
const STEP_1_FIELDS: (keyof ServiceLevelFormValues)[] = [
  "serviceLevel",
  "time",
  "speedInWeeks",
  "price",
  "nonRefundableFee",
  "inboundFee",
  "outboundFee",
  "authOnlyFrontend",
  "doubleCharge",
];

const FORMAT_NAME_OPTIONS = {
  allowNonConsecutiveSpaces: true,
  allowUppercaseInBetween: true,
  allowSpecialCharacters: true,
  allowNumbers: true,
};

export function useServiceLevelForm({
  submitFunction,
  initialData,
}: UseServiceLevelFormProps) {
  // Step navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Data state
  const [merchantAccounts, setMerchantAccounts] = useState<MerchantAccount[]>(
    []
  );
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeWithCountryPair[]>(
    []
  );
  const [countryPairs, setCountryPairs] = useState<CountryPair[]>([]);
  const [loaFiles, setLoaFiles] = useState<LoaFile[]>([]);

  // Extract initial country pairs from service types
  const getInitialCountryPairs = useCallback(() => {
    if (!initialData?.serviceTypes) return [];
    const countryPairIds = new Set<string>();
    initialData.serviceTypes.forEach((type: any) => {
      if (type?.countryPair?._id) {
        countryPairIds.add(type.countryPair._id);
      }
    });
    return Array.from(countryPairIds);
  }, [initialData?.serviceTypes]);

  // Form setup
  const form = useForm<ServiceLevelFormValues>({
    resolver: zodResolver(serviceLevelSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        paymentGateway: initialData.paymentGateway
          ? (typeof initialData.paymentGateway === "object"
              ? initialData.paymentGateway._id
              : initialData.paymentGateway)
          : "none",
        // countryPairs: getInitialCountryPairs(),
        serviceTypes:
          initialData.serviceTypes?.map((type: any) => type._id) || [],
        amex: initialData.amex ?? true,
      }
      : {
        _id: "",
        serviceLevel: "",
        time: "",
        speedInWeeks: 3,
        price: 1,
        nonRefundableFee: 1,
        inboundFee: 0,
        outboundFee: 0,
        paymentGateway: "none",
        authOnlyFrontend: "",
        doubleCharge: "",
        isActive: true,
        isDeleted: false,
        // countryPairs: [],
        serviceTypes: [],
        amex: true,
      },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    trigger,
    setValue,
    getValues,
  } = form;

  // const selectedCountryPairs = watch("countryPairs"); // Removed from form state
  const selectedServiceTypes = watch("serviceTypes");

  // Filtered service types based on selected country pairs
  // Use all service types directly
  const filteredServiceTypes = serviceTypes;

  // Country pair options for MultiSelect
  const countryPairOptions = useMemo(() => {
    return countryPairs.map((cp) => ({
      value: cp._id,
      title: `${cp.fromCountryCode} → ${cp.toCountryCode}`,
    }));
  }, [countryPairs]);

  // Clear invalid service types when country pairs change
  // Removed the effect that clears invalid service types

  // API calls
  const getServiceTypes = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/service-types`);
      if (data) {
        setServiceTypes(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCountryPairs = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/country-pairs`);
      if (data?.success) {
        setCountryPairs(data?.data?.filter((cp: CountryPair) => cp.isActive));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMerchantAccounts = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/admin/processors");
      if (data?.success) {
        setMerchantAccounts(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getLoaFiles = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/loa`);
      if (data) {
        setLoaFiles(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    getServiceTypes();
    getCountryPairs();
    getLoaFiles();
    getMerchantAccounts();
  }, [getServiceTypes, getCountryPairs, getLoaFiles, getMerchantAccounts]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: ServiceLevelFormValues) => {
      try {
        // const { countryPairs: _, ...submitData } = data;
        await submitFunction(data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    [submitFunction]
  );

  // Step navigation
  const handleNext = useCallback(async () => {
    const isValid = await trigger(STEP_1_FIELDS);
    if (isValid) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(2);
        setIsTransitioning(false);
      }, 150);
    }
  }, [trigger]);

  const handleBack = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Input formatting helpers
  const formatServiceLevelInput = useCallback(
    (value: string) => {
      const formattedName = formatName(value, FORMAT_NAME_OPTIONS);
      setValue("serviceLevel", formattedName);
      return formattedName;
    },
    [setValue]
  );

  const formatTimeInput = useCallback(
    (value: string) => {
      const formattedName = formatName(value, FORMAT_NAME_OPTIONS);
      setValue("time", formattedName);
      return formattedName;
    },
    [setValue]
  );

  // Service type label generator
  const getServiceTypeLabel = useCallback(
    (type: ServiceTypeWithCountryPair) => {
      const countryCode = type.countryPair
        ? `(${type.countryPair.fromCountryCode}→${type.countryPair.toCountryCode})`
        : "";
      // return `${type.serviceType} ${countryCode}`;
      return `${countryCode}`;
    },
    []
  );

  // Service type checkbox handler
  const handleServiceTypeChange = useCallback(
    (typeId: string, checked: boolean, currentValues: string[]) => {
      if (checked) {
        return [...(currentValues ?? []), typeId];
      }
      return (currentValues ?? []).filter((id) => id !== typeId);
    },
    []
  );

  return {
    // Form
    form,
    control,
    errors,
    isSubmitting,
    handleSubmit: handleSubmit(onSubmit),

    // Step navigation
    currentStep,
    isTransitioning,
    handleNext,
    handleBack,

    // Data
    merchantAccounts,
    serviceTypes: filteredServiceTypes,
    countryPairs,
    countryPairOptions,
    loaFiles,

    // Watched values
    // selectedCountryPairs,
    selectedServiceTypes,

    // Helpers
    formatServiceLevelInput,
    formatTimeInput,
    getServiceTypeLabel,
    handleServiceTypeChange,
  };
}
