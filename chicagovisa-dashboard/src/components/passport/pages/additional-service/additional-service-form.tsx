"use client";
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import CustomBtn from "@/components/passport/globals/custom-button";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MultiSelect } from "@/components/ui/multi-select";
import { serviceTypeApi } from "@/services/end-points/pass-end-points";
import { formatName } from "@/lib/utils";

interface ReceivedData {
  title: string;
  description: string;
  description2: string;
  price: number;
  serviceTypes: string[];
  addons: { subTitle: string; price: number }[];
  isActive: boolean;
  isDeleted: boolean;
}

const CustomServiceTypeSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(4, "Description should be atleast 4 characters"),
  description2: z
    .string()
    .min(1, "Description 2 is required")
    .min(4, "Description 2 should be atleast 4 characters"),
  price: z.number().min(1, "Price must be a positive number minimum 1"),
  serviceTypes: z
    .array(z.string())
    .min(1, "At least one Service Type is required"),
  addons: z.array(
    z.object({
      subTitle: z.string().min(1, "Subtitle is required"),
      price: z.number().min(1, "Price must be a positive number minimum 1"),
    })
  ),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
});

type AdditionalServiceFormData = z.infer<typeof CustomServiceTypeSchema>;

interface IServiceType {
  _id: string;
  serviceTypes: string;
  originCountries: string[];
}

interface AdditionalServiceFormProps {
  data?: ReceivedData;
  onSubmit: (values: AdditionalServiceFormData) => void;
}

export function AdditionalServiceForm({
  data,
  onSubmit,
}: AdditionalServiceFormProps) {
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);

  const form = useForm<AdditionalServiceFormData>({
    resolver: zodResolver(CustomServiceTypeSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      description2: data?.description2 || "",
      price: data?.price || 1,
      serviceTypes: data?.serviceTypes.map((item: any) => item._id) || [],
      addons: data?.addons || [],
      isActive: data?.isActive ?? true,
      isDeleted: data?.isDeleted ?? false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addons",
  });

  useEffect(() => {
    const fetchData = async () => {
      const serviceTypeResponse = await serviceTypeApi.getAll();
      if (serviceTypeResponse.success)
        setServiceTypes(serviceTypeResponse.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: AdditionalServiceFormData) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="">
        <h1 className="text-center text-lg font-semibold">
          {data ? "Update Additional Service" : "Add Additional Service"}
        </h1>
        <ScrollArea className="mt-2 flex h-[calc(100vh-200px)] flex-col rounded-md bg-gray-100 px-3 py-1">
          <div className="flex flex-col gap-4 space-y-6 py-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedName = formatName(value, {
                          allowNonConsecutiveSpaces: true,
                          allowUppercaseInBetween: true,
                          allowNumbers: true,
                          allowSpecialCharacters: true,
                        });
                        field.onChange(formattedName);
                        form.setValue("title", formattedName);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedName = formatName(value, {
                          allowNonConsecutiveSpaces: true,
                          allowUppercaseInBetween: true,
                          allowNumbers: true,
                          makeLettersAfterSpaceCapital: false,
                          allowSpecialCharacters: true,
                        });
                        field.onChange(formattedName);
                        form.setValue("description", formattedName);
                      }}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description 2</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>service Types</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={serviceTypes?.map((type: any) => ({
                        title: type.serviceType,
                        value: type._id,
                      }))}
                      defaultValue={field.value}
                      onValueChange={(selectedValues) => {
                        field.onChange(selectedValues);
                      }}
                      placeholder="Select service types"
                      variant="inverted"
                      // maxCount={serviceTypes.length}
                      maxCount={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Addons</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-4 flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`addons.${index}.subTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Subtitle"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              const formattedName = formatName(value, {
                                allowNonConsecutiveSpaces: true,
                                allowUppercaseInBetween: true,
                              });
                              field.onChange(formattedName);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`addons.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ subTitle: "", price: 1 })}
              className="w-fit"
            >
              <PlusCircle className="mr-2 size-4" />
              Add Addon
            </Button>
          </div>
        </ScrollArea>

        <div className="mt-4 flex w-full items-center justify-center">
          <CustomBtn
            type="submit"
            className="w-full"
            text={data ? "Update" : "Add New"}
            loading={form.formState.isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
