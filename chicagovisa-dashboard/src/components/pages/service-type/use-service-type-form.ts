"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { removeHtmlTags } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { serviceTypeApi } from "@/services/end-points/pass-end-points";
import { useRouter } from "next/navigation";
import { countryAccessApi } from "@/services/end-points/pass-end-points";

export const ServiceTypeSchema = z.object({
  serviceType: z.string().min(1, "Service Type is required"),
  description: z.string().min(1, "Description is required"),
  shortHand: z.string().min(1, "Abbreviation is required"),
  processingTime: z.string().min(1, "Processing time is required"),
  sortOrder: z.number().min(1, "Sort order is required"),
  countryPair: z.string().min(1, "Country Pair is required"),
  isEvisa: z.boolean().default(false),
});

export type ServiceTypeFormData = z.infer<typeof ServiceTypeSchema>;

export interface ICountryPair {
  _id: string;
  fromCountryCode: string;
  fromCountryName: string;
  toCountryCode: string;
  toCountryName: string;
  isJurisdictional: boolean;
  isActive: boolean;
}

export type IRequiredDoc = {
  _id: string;
  title: string;
  key: string;
  instruction: string;
  sampleImage: File | string | null;
  attachment: File | string | null;
  isRequired: boolean;
};

export interface IShippingAddress {
  _id: string;
  locationName: string;
  company: string;
  isActive: boolean;
  isDeleted: boolean;
}

type UseServiceTypeFormProps = {
  serviceTypeId?: string;
};

export function useServiceTypeForm({ serviceTypeId }: UseServiceTypeFormProps) {
  const [serviceType, setServiceType] = useState<IServiceType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(!!serviceTypeId);
  const [requiredDocs, setRequiredDocs] = useState<IRequiredDoc[]>([]);
  const [requiredDocs2, setRequiredDocs2] = useState<IRequiredDoc[]>([]);
  const [sortOrders, setSortOrders] = useState<
    { serviceType: string; sortOrder: number }[]
  >([]);
  const [countryPairs, setCountryPairs] = useState<ICountryPair[]>([]);
  const router = useRouter();
  const isEditMode = !!serviceTypeId;

  const form = useForm<ServiceTypeFormData>({
    resolver: zodResolver(ServiceTypeSchema),
    defaultValues: {
      serviceType: "",
      description: "",
      shortHand: "",
      processingTime: "",
      sortOrder: 1,
      countryPair: "",
      isEvisa: false,
    },
  });

  // Helper function to determine if we should show two sets of documents
  const shouldShowTwoSets = () => {
    const silentKey = serviceType?.silentKey;
    return (
      silentKey === "child-passport" ||
      silentKey === "passport-renewal" ||
      silentKey === "passport-name-change"
    );
  };

  // Helper function to get titles for the document sets
  const getDocumentTitles = () => {
    const silentKey = serviceType?.silentKey;
    if (silentKey === "child-passport") {
      return {
        first: "Required Documents for Under 16Y/O",
        second: "Required Documents for 16Y/O and Above",
      };
    } else if (
      silentKey === "passport-renewal" ||
      silentKey === "passport-name-change"
    ) {
      return {
        first: "Required Docs for Slow Services",
        second: "Required Documents for Faster Services",
      };
    }
    return {
      first: "Required Documents",
      second: "Required Documents Set 2",
    };
  };

  const createEmptyDocument = (): IRequiredDoc => ({
    _id: "",
    title: "",
    key: "",
    instruction: "",
    sampleImage: "",
    attachment: "",
    isRequired: true,
  });

  const addDocument = () => {
    const lastRequiredDoc = requiredDocs[requiredDocs.length - 1];
    if (
      requiredDocs.length >= 1 &&
      (!lastRequiredDoc.title.trim() ||
        !removeHtmlTags(lastRequiredDoc.instruction).trim())
    ) {
      return toast.error("Enter all fields for the previous document");
    }
    setRequiredDocs([...requiredDocs, createEmptyDocument()]);
  };

  const addDocument2 = () => {
    const lastRequiredDoc = requiredDocs2[requiredDocs2.length - 1];
    if (
      requiredDocs2.length >= 1 &&
      (!lastRequiredDoc.title.trim() ||
        !removeHtmlTags(lastRequiredDoc.instruction).trim())
    ) {
      return toast.error("Enter all fields for the previous document");
    }
    setRequiredDocs2([...requiredDocs2, createEmptyDocument()]);
  };

  const handleSubmit = async (
    values: z.infer<typeof ServiceTypeSchema>,
    docs: IRequiredDoc[],
    docs2: IRequiredDoc[]
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceType", values?.serviceType);
      formData.append("description", values?.description || "");
      formData.append("shortHand", values?.shortHand);
      formData.append("processingTime", values?.processingTime);
      formData.append("sortOrder", values?.sortOrder.toString() || "");
      formData.append("countryPair", values?.countryPair || "");
      formData.append("isEvisa", values?.isEvisa?.toString() || "false");

      // Handle first set of required documents
      const _requiredDocs = docs.map((doc) => {
        if (typeof doc.sampleImage !== "string") {
          const { sampleImage, ...rest } = doc;
          formData.append(doc.title + "sampleImage", sampleImage || "");
          return rest;
        }
        if (typeof doc.attachment !== "string") {
          const { attachment, ...rest } = doc;
          formData.append(doc.title + "attachment", attachment || "");
          return rest;
        }
        const { _id, ...rest } = doc;
        return rest;
      });
      formData.append("requiredDocs", JSON.stringify(_requiredDocs));

      // Handle second set of required documents
      const _requiredDocs2 = docs2.map((doc) => {
        if (typeof doc.sampleImage !== "string") {
          const { sampleImage, ...rest } = doc;
          formData.append(doc.title + "sampleImage2", sampleImage || "");
          return rest;
        }
        if (typeof doc.attachment !== "string") {
          const { attachment, ...rest } = doc;
          formData.append(doc.title + "attachment2", attachment || "");
          return rest;
        }
        const { _id, ...rest } = doc;
        return rest;
      });
      formData.append("requiredDocs2", JSON.stringify(_requiredDocs2));

      if (isEditMode) {
        await axiosInstance.put(
          `/admin/service-types/${serviceTypeId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Service type updated successfully");
      } else {
        await serviceTypeApi.create(formData);
        toast.success("Service type created successfully");
      }

      router.push("/service-types");
    } catch (error: any) {
      console.log("Error ", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const reorderDocuments = (oldIndex: number, newIndex: number) => {
    const newRequiredDocs = [...requiredDocs];
    const temp = newRequiredDocs[oldIndex];
    newRequiredDocs[oldIndex] = newRequiredDocs[newIndex];
    newRequiredDocs[newIndex] = temp;
    setRequiredDocs(newRequiredDocs);
  };

  const reorderDocuments2 = (oldIndex: number, newIndex: number) => {
    const newRequiredDocs2 = [...requiredDocs2];
    const temp = newRequiredDocs2[oldIndex];
    newRequiredDocs2[oldIndex] = newRequiredDocs2[newIndex];
    newRequiredDocs2[newIndex] = temp;
    setRequiredDocs2(newRequiredDocs2);
  };

  const updateTitle = (index: number, title: string) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs[index].title = title;
    newRequiredDocs[index].key = title;
    setRequiredDocs(newRequiredDocs);
  };

  const updateTitle2 = (index: number, title: string) => {
    const newRequiredDocs2 = [...requiredDocs2];
    newRequiredDocs2[index].title = title;
    newRequiredDocs2[index].key = title;
    setRequiredDocs2(newRequiredDocs2);
  };

  const updateInstruction = (index: number, instruction: string) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs[index].instruction = instruction;
    setRequiredDocs(newRequiredDocs);
  };

  const updateInstruction2 = (index: number, instruction: string) => {
    const newRequiredDocs2 = [...requiredDocs2];
    newRequiredDocs2[index].instruction = instruction;
    setRequiredDocs2(newRequiredDocs2);
  };

  const updateIsRequired = (index: number, bool: boolean) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs[index].isRequired = bool;
    setRequiredDocs(newRequiredDocs);
  };

  const updateIsRequired2 = (index: number, bool: boolean) => {
    const newRequiredDocs2 = [...requiredDocs2];
    newRequiredDocs2[index].isRequired = bool;
    setRequiredDocs2(newRequiredDocs2);
  };

  const removeDocument = (index: number) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs.splice(index, 1);
    setRequiredDocs(newRequiredDocs);
  };

  const removeDocument2 = (index: number) => {
    const newRequiredDocs2 = [...requiredDocs2];
    newRequiredDocs2.splice(index, 1);
    setRequiredDocs2(newRequiredDocs2);
  };

  const handleSampleImageChange = (index: number, file: File | null) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs[index].sampleImage = file;
    setRequiredDocs(newRequiredDocs);
  };

  const handleSampleImageChange2 = (index: number, file: File | null) => {
    const newRequiredDocs2 = [...requiredDocs2];
    newRequiredDocs2[index].sampleImage = file;
    setRequiredDocs2(newRequiredDocs2);
  };

  const fetchServiceType = async () => {
    if (!serviceTypeId) return;

    try {
      const data = await serviceTypeApi.getOne(serviceTypeId);
      if (data.data) {
        setServiceType(data.data);
        setRequiredDocs(data.data.requiredDocuments || []);
        setRequiredDocs2(data.data.requiredDocuments2 || []);

        const countryPairValue =
          typeof data.data.countryPair === "object"
            ? data.data.countryPair?._id
            : data.data.countryPair;

        form.reset({
          serviceType: data.data.serviceType,
          description: data.data.description,
          shortHand: data.data.shortHand,
          processingTime: data.data.processingTime,
          sortOrder: data.data.sortOrder || 1,
          countryPair: countryPairValue || "",
          isEvisa: data.data.isEvisa || false,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSortOrders = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/service-types/sort-orders"
      );
      if (!data?.success) throw new Error("Error fetching sort orders");
      setSortOrders(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching sort orders");
    }
  };

  const fetchCountryPairs = async () => {
    try {
      const response = await countryAccessApi.getAllCountryPairs();

      if (response?.success) {
        setCountryPairs(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching country pairs");
    }
  };

  useEffect(() => {
    Promise.all([fetchServiceType(), fetchSortOrders(), fetchCountryPairs()]);
  }, [serviceTypeId]);

  return {
    // State
    serviceType,
    loading,
    isLoading,
    requiredDocs,
    requiredDocs2,
    sortOrders,
    countryPairs,
    isEditMode,
    form,

    // Helpers
    shouldShowTwoSets,
    getDocumentTitles,

    // Document actions - Set 1
    addDocument,
    reorderDocuments,
    updateTitle,
    updateInstruction,
    updateIsRequired,
    removeDocument,
    handleSampleImageChange,

    // Document actions - Set 2
    addDocument2,
    reorderDocuments2,
    updateTitle2,
    updateInstruction2,
    updateIsRequired2,
    removeDocument2,
    handleSampleImageChange2,

    // Form submission
    handleSubmit,
  };
}
