"use client";
import React from "react";
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
import { formatName, getCurrentDateInDC } from "@/lib/utils";

const promoCodeSchema = z
  .object({
    _id: z.string(),
    codeType: z.string().min(1, "Promotion type is required"),
    code: z
      .string()
      .min(1, "Code is required")
      .max(20, "Maximum 20 characters allowed"),
    min: z.coerce.number().min(1, "minimum amount required"),
    max: z.coerce.number().min(1, "maximum amount required"),
    discount: z.string().min(1, "Discount is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
  })
  .refine((data) => Number(data.min) <= Number(data.max), {
    message: "Minimum amount must be less than maximum amount",
    path: ["min"],
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate).setHours(0, 0, 0, 0);
      const today = getCurrentDateInDC().setHours(0, 0, 0, 0);
      return startDate >= today;
    },
    { message: "Cannot be in the past", path: ["startDate"] }
  )
  .refine(
    (data) => {
      const endDate = new Date(data.endDate).setHours(0, 0, 0, 0);
      const today = getCurrentDateInDC().setHours(0, 0, 0, 0);
      return endDate >= today;
    },
    { message: "Cannot be in the past", path: ["endDate"] }
  )
  .refine(
    (data) => {
      const endDate = new Date(data.endDate).setHours(0, 0, 0, 0);
      const startDate = new Date(data.startDate).setHours(0, 0, 0, 0);
      return endDate >= startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

interface IData {
  _id: string;
  code: string;
  codeType: string;
  discount: string;
  isActive: boolean;
  min: number;
  max: number;
  startDate: string;
  isDeleted: boolean;
  endDate: string;
}

interface PromoCodeFormProps {
  submitFunction: (data: PromoCodeFormValues) => Promise<void>;
  initialData?: IData;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;

const PromoCodeForm: React.FC<PromoCodeFormProps> = React.memo(
  ({ submitFunction, initialData }) => {
    const form = useForm<PromoCodeFormValues>({
      resolver: zodResolver(promoCodeSchema),
      defaultValues: initialData
        ? {
            ...initialData,
            discount: initialData.discount.toString(),
            startDate: formatDate(initialData.startDate),
            endDate: formatDate(initialData.endDate),
            min: initialData.min,
            max: initialData.max,
          }
        : {
            _id: "",
            codeType: "",
            code: "",
            isDeleted: false,
            isActive: false,
            discount: "",
            min: 0,
            max: 0,
            startDate: "",
            endDate: "",
          },
    });

    const {
      handleSubmit,
      formState: { errors, isSubmitting },
      control,
      setValue,
      watch,
    } = form;

    const onSubmit: SubmitHandler<PromoCodeFormValues> = async (
      data: PromoCodeFormValues
    ) => {
      try {
        const submissionData = {
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        };

        ({ submissionData });
        await submitFunction(submissionData);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    const generateCode = () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setValue("code", code);
    };

    return (
      <div className="mx-auto flex flex-col gap-2 rounded-md p-4 text-start w-[40vw]">
        <h2 className="mb-4 w-full py-1 text-center text-2xl font-semibold">
          Add Promo Code
        </h2>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="codeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Code type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="off">Percentage off</SelectItem>
                          <SelectItem value="flat">Amount discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errors.codeType && (
                      <FormMessage>{errors.codeType.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    {watch("codeType") === "off" ? (
                      <>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <Input
                            disabled={watch("codeType") !== "off"}
                            className={`${
                              !watch("codeType")
                                ? "disabled:cursor-not-allowed"
                                : "cursor-default"
                            }`}
                            placeholder="Ex:10"
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length >= 3) return;
                              field.onChange(value);
                            }}
                            aria-label="Discount percentage"
                          />
                        </FormControl>
                      </>
                    ) : (
                      <>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            className={`${
                              !watch("codeType")
                                ? "disabled:cursor-not-allowed"
                                : "cursor-default"
                            }`}
                            placeholder="Ex:10"
                            type="number"
                            min={0}
                            disabled={watch("codeType") !== "flat"}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length > 4) return;
                              field.onChange(value);
                            }}
                            aria-label="Discount amount"
                          />
                        </FormControl>
                      </>
                    )}
                    {errors.discount && (
                      <FormMessage>{errors.discount.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" aria-label="Start date" />
                    </FormControl>
                    {errors.startDate && (
                      <FormMessage>{errors.startDate.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" aria-label="End date" />
                    </FormControl>
                    {errors.endDate && (
                      <FormMessage>{errors.endDate.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length > 4) return;
                          field.onChange(value);
                        }}
                        min={1}
                        placeholder="Ex:100"
                        aria-label="min"
                      />
                    </FormControl>
                    {errors.min && (
                      <FormMessage>{errors.min.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length > 6) return;
                          field.onChange(value);
                        }}
                        type="number"
                        min={2}
                        placeholder="Ex:200"
                        aria-label="max"
                      />
                    </FormControl>
                    {errors.max && (
                      <FormMessage>{errors.max.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Code</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-4">
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={20}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formattedName = formatName(value, {
                              allowNumbers: true,
                            });
                            field.onChange(formattedName);
                            form.setValue("code", formattedName.toUpperCase());
                          }}
                          aria-label="Promo code"
                          placeholder="Enter promo code"
                        />
                      </FormControl>
                      {errors.code && (
                        <FormMessage>{errors.code.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generate Code
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={
                  isSubmitting || Object.keys(form.formState.errors).length > 0
                }
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
);

PromoCodeForm.displayName = "PromoCodeForm";

export default PromoCodeForm;
