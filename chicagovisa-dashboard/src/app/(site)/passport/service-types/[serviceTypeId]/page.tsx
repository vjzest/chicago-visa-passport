"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { GetShippingAddresses } from "@/services/end-points/end-point";
import CustomBtn from "@/components/passport/globals/custom-button";
import { formatName } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { serviceTypeApi } from "@/services/end-points/pass-end-points";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import RequiredDocsKanban from "@/components/passport/pages/service-type/required-docs-kanban";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import { SortOrderInput } from "@/components/passport/pages/service-type/service-sort-order";

const ServiceTypeSchema = z.object({
  serviceType: z.string().min(1, "Service Type is required"),
  shippingAddress: z.string().min(1, "Processing location is required"),
  description: z.string().min(1, "Description is required"),
  shortHand: z.string().min(1, "Abbreviation is required"),
  processingTime: z.string().min(1, "Processing time is required"),
  sortOrder: z.number().min(1, "Sort order is required"),
});

type ServiceTypeFormData = z.infer<typeof ServiceTypeSchema>;

type IRequiredDoc = {
  _id: string;
  title: string;
  key: string;
  instruction: string;
  sampleImage: File | string | null;
  attachment: File | string | null;
  isRequired: boolean;
};

type ServiceTypeFormProps = {
  params: { serviceTypeId: string };
};

export default function ServiceTypeForm({
  params: { serviceTypeId },
}: ServiceTypeFormProps) {
  const [serviceType, setServiceType] = useState<IServiceType | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<
    IShippingAddress[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState<IRequiredDoc[]>([]);
  const [requiredDocs2, setRequiredDocs2] = useState<IRequiredDoc[]>([]);
  const [sortOrders, setSortOrders] = useState<
    { serviceType: string; sortOrder: number }[]
  >([]);
  const navigate = useRouter();

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

  const addDocument = () => {
    setRequiredDocs([
      ...requiredDocs,
      {
        _id: "",
        title: "",
        key: "",
        instruction: "",
        sampleImage: "",
        attachment: "",
        isRequired: true,
      },
    ]);
  };

  const addDocument2 = () => {
    setRequiredDocs2([
      ...requiredDocs2,
      {
        _id: "",
        title: "",
        key: "",
        instruction: "",
        sampleImage: "",
        attachment: "",
        isRequired: true,
      },
    ]);
  };

  const handleUpdate = async (
    values: z.infer<typeof ServiceTypeSchema>,
    requiredDocs: IRequiredDoc[],
    requiredDocs2: IRequiredDoc[]
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceType", values?.serviceType);
      formData.append("description", values?.description || "");
      formData.append("shortHand", values?.shortHand);
      formData.append("processingTime", values?.processingTime);
      formData.append("shippingAddress", values?.shippingAddress);
      formData.append("sortOrder", values?.sortOrder.toString() || "");

      // Handle first set of required documents
      const _requiredDocs = requiredDocs.map((doc) => {
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
        return doc;
      });
      formData.append("requiredDocs", JSON.stringify(_requiredDocs));

      // Handle second set of required documents
      const _requiredDocs2 = requiredDocs2.map((doc) => {
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
        return doc;
      });
      formData.append("requiredDocs2", JSON.stringify(_requiredDocs2));

      await axiosInstance.put(
        `/admin/service-types/${serviceTypeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate.push("/service-types");
    } catch (error) {
      console.log("Error ", error);
      toast.error("Something went wrong. please try again!");
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

  const form = useForm<ServiceTypeFormData>({
    resolver: zodResolver(ServiceTypeSchema),
    defaultValues: {
      serviceType: "",
      shippingAddress: "",
      description: "",
      shortHand: "",
      processingTime: "",
    },
  });

  const fetchServiceType = async () => {
    try {
      const data = await serviceTypeApi.getOne(serviceTypeId);
      if (data.data) {
        setServiceType(data.data);
        setRequiredDocs(data.data.requiredDocuments || []);
        setRequiredDocs2(data.data.requiredDocuments2 || []);

        // Reset form with all values including shippingAddress
        form.reset({
          serviceType: data.data.serviceType,
          shippingAddress: data.data.shippingAddress,
          description: data.data.description,
          shortHand: data.data.shortHand,
          processingTime: data.data.processingTime,
          sortOrder: data.data.sortOrder,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const fetchShippingAddress = async () => {
    try {
      const response: { success: boolean; data: IShippingAddress[] } =
        await GetShippingAddresses();
      if (response?.success) {
        setShippingAddresses(response?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching shipping addresses");
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

  useEffect(() => {
    // Fetch both data in parallel
    fetchServiceType();
    fetchShippingAddress();
    fetchSortOrders();
  }, []);

  if (!serviceType) {
    return <LoadingPage />;
  }

  const documentTitles = getDocumentTitles();

  return (
    <>
      <BreadCrumbComponent
        customBreadcrumbs={[
          { label: "Service Types", link: "/service-types" },
          { label: serviceType.serviceType, link: null },
        ]}
      />
      <h1 className="text-xl md:text-2xl font-semibold">
        Edit service type : {serviceType?.serviceType}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleUpdate(values, requiredDocs, requiredDocs2)
          )}
        >
          <div className="flex flex-col gap-0 space-y-6 py-5">
            <div className="pt-2 max-w-xl">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter service type"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("serviceType", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <ReactQuill
                      placeholder="Write description here"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue("description", value);
                      }}
                      className="w-[95%]"
                    />{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="shortHand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abbreviation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Abbreviation"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = value.toUpperCase();
                          field.onChange(formattedName);
                          form.setValue("shortHand", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg : 2 Weeks"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNumbers: true,
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowSpecialCharacters: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("processingTime", formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <SortOrderInput
                        value={field.value}
                        onChange={field.onChange}
                        sortOrders={sortOrders}
                        max={sortOrders.length}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-xl">
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing location</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an address" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingAddresses
                            .filter(
                              (address) =>
                                address.isActive && !address.isDeleted
                            )
                            .map((address) => (
                              <SelectItem key={address._id} value={address._id}>
                                {`${address.locationName} - ${address.company}`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* First set of required documents */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {shouldShowTwoSets()
                  ? documentTitles.first
                  : "Required Documents"}
              </h2>
              <RequiredDocsKanban
                addDocument={addDocument}
                handleSampleImageChange={handleSampleImageChange}
                removeDocument={removeDocument}
                reorderDocuments={reorderDocuments}
                requiredDocs={requiredDocs}
                updateIsRequired={updateIsRequired}
                updateTitle={updateTitle}
                updateInstruction={updateInstruction}
              />
            </div>

            {/* Second set of required documents - only show for specific silentKeys */}
            {shouldShowTwoSets() && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {documentTitles.second}
                </h2>
                <RequiredDocsKanban
                  addDocument={addDocument2}
                  handleSampleImageChange={handleSampleImageChange2}
                  removeDocument={removeDocument2}
                  reorderDocuments={reorderDocuments2}
                  requiredDocs={requiredDocs2}
                  updateIsRequired={updateIsRequired2}
                  updateTitle={updateTitle2}
                  updateInstruction={updateInstruction2}
                />
              </div>
            )}
          </div>

          <div className="mt-2 flex w-full items-center justify-center">
            <CustomBtn
              type="submit"
              text={"Update Service Type"}
              loading={loading}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
