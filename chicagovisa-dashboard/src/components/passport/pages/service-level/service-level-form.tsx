"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import axiosInstance from "@/services/axios/axios";
import { formatName } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const serviceLevelSchema = z.object({
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
  loa: z.string().min(1, "LOA is required"),
  doubleCharge: z.string().min(1, "Double charge type is required"),
  serviceTypes: z
    .array(z.string())
    .min(1, "At least one service type must be selected"),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

interface ServiceLevelFormProps {
  submitFunction: (data: any) => Promise<void>;
  initialData?: IServiceLevel;
}

type ServiceLevelFormValues = z.infer<typeof serviceLevelSchema>;

const ServiceLevelForm: React.FC<ServiceLevelFormProps> = React.memo(
  ({ submitFunction, initialData }) => {
    const form = useForm<ServiceLevelFormValues>({
      resolver: zodResolver(serviceLevelSchema),
      defaultValues: initialData
        ? {
          ...initialData,
          paymentGateway: initialData.paymentGateway
            ? typeof initialData.paymentGateway === "string"
              ? initialData.paymentGateway
              : (initialData.paymentGateway as any)._id
            : "none",
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
          loa: "",
          isActive: true,
          isDeleted: false,
          serviceTypes: [],
          amex: true,
        },
    });
    const [merchantAccounts, setMerchantAccounts] = useState<
      { processorName: string; _id: string }[]
    >([]);
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [loaFiles, setLoaFiles] = useState<
      { _id: string; name: string; url: string }[]
    >([]);

    const {
      handleSubmit,
      formState: { errors, isSubmitting },
      control,
    } = form;

    const onSubmit: SubmitHandler<ServiceLevelFormValues> = async (data) => {
      try {
        await submitFunction(data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    const getServiceTypes = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/service-types`);
        if (data) {
          setServiceTypes(data?.data);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    const getMerchantAccounts = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/processors");
        if (data?.success) {
          setMerchantAccounts(data?.data);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    const getLoaFiles = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/loa`);
        if (data) {
          setLoaFiles(data?.data);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    useEffect(() => {
      getServiceTypes();
      getLoaFiles();
      getMerchantAccounts();
    }, []);

    return (
      <div className="mx-auto rounded-md p-2">
        <h2 className="mb-3 text-center text-2xl font-semibold">
          Service Level Form
        </h2>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
            className="space-y-6"
          >
            <div className="h-96 w-full overflow-scroll px-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={control}
                  name="serviceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Level</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formattedName = formatName(value, {
                              allowNonConsecutiveSpaces: true,
                              allowUppercaseInBetween: true,
                              allowSpecialCharacters: true,
                              allowNumbers: true,
                            });
                            field.onChange(formattedName);
                            form.setValue("serviceLevel", formattedName);
                          }}
                          aria-label="Service Level"
                        />
                      </FormControl>
                      <FormMessage>{errors.serviceLevel?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (For Display)</FormLabel>
                      <FormControl>
                        <Input
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
                            form.setValue("time", formattedName);
                          }}
                          aria-label="Time"
                        />
                      </FormControl>
                      <FormMessage>{errors.time?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="speedInWeeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speed in Weeks</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-label="Speed in Weeks"
                        />
                      </FormControl>
                      <FormMessage>{errors.speedInWeeks?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-label="Price"
                        />
                      </FormControl>
                      <FormMessage>{errors.price?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="nonRefundableFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non-Refundable Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-label="Non-Refundable Fee"
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.nonRefundableFee?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="inboundFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inbound Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-label="Inbound Fee"
                        />
                      </FormControl>
                      <FormMessage>{errors.inboundFee?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="outboundFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outbound Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          aria-label="Outbound Fee"
                        />
                      </FormControl>
                      <FormMessage>{errors.outboundFee?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="paymentGateway"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant Account</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"none"}>
                              LOAD BALANCER
                            </SelectItem>
                            {merchantAccounts?.map((account) => (
                              <SelectItem key={account._id} value={account._id}>
                                {account.processorName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="authOnlyFrontend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auth Only Frontend</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[20rem]">
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="authorize_nrf_capture_service">
                              AUTHORIZE (NRF) CAPTURE(SERVICE FEE)
                            </SelectItem>
                            <SelectItem value="capture_both">
                              CAPTURE BOTH (NRF & SERVICE FEE)
                            </SelectItem>
                            <SelectItem value="authorize_both">
                              AUTHORIZE BOTH (NRF & SERVICE FEE)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>
                        {errors.authOnlyFrontend?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="amex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AMEX</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Button
                            size={"xsm"}
                            type="button"
                            onClick={() => field.onChange(true)}
                            variant={field?.value ? "primary" : "outline"}
                          >
                            Yes
                          </Button>
                          <Button
                            size={"xsm"}
                            type="button"
                            onClick={() => field.onChange(false)}
                            variant={!field?.value ? "primary" : "outline"}
                          >
                            No
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage>{errors.amex?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="doubleCharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Double Charge</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="double">Double</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.doubleCharge?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="loa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LOA</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[20rem]">
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            {loaFiles?.map((file) => (
                              <SelectItem key={file?.name} value={file?._id}>
                                {file?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.loa?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-5">
                <FormField
                  control={control}
                  name="serviceTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Types</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {serviceTypes?.map((type) => (
                            <div
                              className="flex items-center space-x-2"
                              key={type?._id}
                            >
                              <Checkbox
                                id={type?._id}
                                checked={field.value?.includes(type?._id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field?.value ?? []),
                                      type?._id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      (field?.value ?? []).filter(
                                        (id) => id !== type?._id
                                      )
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={type?._id}>
                                {type?.serviceType}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage>{errors.serviceTypes?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
);

ServiceLevelForm.displayName = "ServiceLevelForm";

export default ServiceLevelForm;
