"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import FieldTooltip from "./field-tooltip";

const ProductInfoSchema = z.object({
  passportOption: z.enum(["card", "book", "both"], {
    required_error: "Please select a passport option",
  }),
  largeBook: z.boolean().default(false),
  processingMethod: z
    // .enum(["routine", "expedited", "agency"], {
    .enum(["expedited"], {
      required_error: "Please select a processing method",
    })
    .default("expedited"),
  deliveryMethod: z.object({
    book: z
      .enum(["one-two-day"], {
        required_error: "Please select a delivery method for book",
      })
      .optional()
      .nullable(),
  }),
  additionalFees: z.object({
    fileSearch: z.boolean().default(false),
  }),
});

type ProductInfoFormData = z.infer<typeof ProductInfoSchema>;

// Constants for pricing
const PRICES = {
  book: 130,
  card: 30,
  both: 160,
  expedited: 60,
  agency: 60,
  oneTwoDay: 21.36,
  fileSearch: 150,
} as const;

interface ProductInfoFormProps {
  onSubmit: (values: ProductInfoFormData) => void;
  defaultValues?: Partial<ProductInfoFormData>;
  goBack: () => void;
  isLoading: boolean;
  showFileSearch: boolean;
}

export function ProductInfoForm({
  onSubmit,
  defaultValues,
  goBack,
  isLoading,
  showFileSearch,
}: ProductInfoFormProps) {
  const form = useForm<ProductInfoFormData>({
    resolver: zodResolver(ProductInfoSchema),
    defaultValues: {
      passportOption: defaultValues?.passportOption || "book",
      largeBook: defaultValues?.largeBook || false,
      processingMethod: defaultValues?.processingMethod || "expedited",
      deliveryMethod: defaultValues?.deliveryMethod || { book: "one-two-day" },
      additionalFees: defaultValues?.additionalFees || { fileSearch: false },
    },
  });

  const passportOption = form.watch("passportOption");
  const processingMethod = form.watch("processingMethod");
  const deliveryMethod = form.watch("deliveryMethod");
  const fileSearch = form.watch("additionalFees.fileSearch");

  // Calculate total price
  const calculateTotal = () => {
    let stateDepFee = 0;

    // Base price for passport option
    switch (passportOption) {
      case "book":
        stateDepFee += PRICES.book;
        break;
      case "card":
        stateDepFee += PRICES.card;
        break;
      case "both":
        stateDepFee += PRICES.both;
        break;
    }

    // Processing method fee
    if (processingMethod === "expedited") stateDepFee += PRICES.expedited;
    // if (processingMethod === "agency") stateDepFee += PRICES.agency;

    // Delivery method fee
    if (
      ["book", "both"].includes(passportOption) &&
      deliveryMethod.book === "one-two-day"
    )
      stateDepFee += PRICES.oneTwoDay;

    // Additional fees
    if (fileSearch) stateDepFee += PRICES.fileSearch;
    // const acceptanceFee = 35;
    const total = stateDepFee;
    return { stateDepFee, total };
  };

  const { total, stateDepFee } = calculateTotal();
  useEffect(() => {
    form.setValue("additionalFees.fileSearch", false);
  }, [showFileSearch]);

  return isLoading ? (
    <div className="flex flex-col items-center justify-center gap-4 my-[9rem]">
      <Loader2 className=" h-16 w-16 animate-spin text-light-blue" />
      <p className="text-lg font-medium text-slate-500 text-center w-[90%] md:w-[60%]">
        Submitting your details and generating your application form with a
        government generated 2D barcode.
      </p>
      <p className="text-center text-base md:w-[60%]">
        Please wait. This process can take upto 1 or 2 minutes. Do not click on
        anything, press ESC or go back.
      </p>
    </div>
  ) : (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-50 md:px-8 p-4 flex flex-col gap-4">
              {/* Passport Options */}
              <FormField
                control={form.control}
                name="passportOption"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base text-blue-800 font-semibold">
                      Passport Options
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          if (value === "card") {
                            form.setValue("deliveryMethod.book", "one-two-day");
                          }
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                        className="flex items-center justify-between"
                      >
                        <>
                          <div className="flex flex-col gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="size-6"
                                  value="book"
                                />
                              </FormControl>
                              <FormLabel className="text-base font-medium flex gap-2">
                                Passport Book (${PRICES.book})
                                <FieldTooltip message="Passport Books are valid for all international travel" />
                              </FormLabel>
                            </FormItem>
                            {/* Large Book Option */}
                            {passportOption === "book" && (
                              <FormField
                                control={form.control}
                                name="largeBook"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:w-3/4 ml-6">
                                    <FormControl>
                                      <Checkbox
                                        className="size-5"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        Large Book (Non-Standard)
                                      </FormLabel>
                                      <FormDescription>
                                        This large book is only for frequent
                                        international travelers who need more
                                        visa pages.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            )}
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="size-6"
                                  value="card"
                                />
                              </FormControl>
                              <FormLabel className="text-base font-medium flex gap-2">
                                Passport Card (${PRICES.card})
                                <FieldTooltip message="Passport Cards are valid only for return to the U.S. by land or sea from Canada, Mexico, Bermuda, and the Caribbean" />
                              </FormLabel>
                            </FormItem>
                            <span className="text-sm">
                              <span className="font-semibold">
                                The U.S. Passport Card CANNOT be used for
                                international air travel.
                              </span>{" "}
                              This travel document can be used to enter the
                              United States from Canada, Mexico, the Caribbean,
                              and Bermuda at land border crossings or sea
                              ports-of-entry.
                            </span>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="size-6"
                                  value="both"
                                />
                              </FormControl>
                              <FormLabel className="text-base font-medium flex gap-2">
                                Passport Book & Card (${PRICES.both})
                                <FieldTooltip message="Apply for both documents at the same time" />
                              </FormLabel>
                            </FormItem>
                            {/* Large Book Option */}
                            {passportOption === "both" && (
                              <FormField
                                control={form.control}
                                name="largeBook"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:w-3/4 ml-6">
                                    <FormControl>
                                      <Checkbox
                                        className="size-5"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        Large Book (Non-Standard)
                                      </FormLabel>
                                      <FormDescription>
                                        This large book is only for frequent
                                        international travelers who need more
                                        visa pages.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                          <span className="text-base font-medium">
                            ${PRICES[passportOption] ?? 0}
                          </span>
                        </>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-gray-50 md:px-8 p-4 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="processingMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base text-blue-800 font-semibold">
                      Processing Methods
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center justify-between space-y-1"
                      >
                        <div className="flex flex-col gap-4">
                          {/* <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="size-5"
                                value="routine"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-base flex gap-2">
                              Routine Service ($0)
                              <FieldTooltip message="Routine service can take 4-6 weeks. Our processing times begin the day we receive your application at a passport agency or center, not the day you mail your application or apply at a local acceptance facility." />
                            </FormLabel>
                          </FormItem> */}
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="size-5"
                                value="expedited"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-base flex gap-2">
                              Expedited Service (${PRICES.expedited})
                              <FieldTooltip message="Expedited service can take 2-3 weeks. Our processing times begin the day we receive your application at a passport agency or center, not the day you mail your application or apply at a local acceptance facility." />
                            </FormLabel>
                          </FormItem>
                          {/* <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                className="size-5"
                                value="agency"
                              />
                            </FormControl>
                            <FormLabel className="font-medium text-base flex gap-2">
                              Expedited at Agency Service (${PRICES.agency})
                              <FieldTooltip message="Must have an appointment and international travel in the next 14 calendar days to apply at an agency or center." />
                            </FormLabel>
                          </FormItem> */}
                        </div>
                        <span className="text-base font-medium">
                          ${PRICES[processingMethod] ?? 0}
                        </span>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Delivery Methods */}
            <div className="bg-gray-50 md:px-8 p-4 flex flex-col gap-4">
              <span className="text-base text-blue-800 font-semibold">
                Delivery methods
              </span>
              {(passportOption === "book" || passportOption === "both") && (
                <FormField
                  control={form.control}
                  name="deliveryMethod.book"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base text-slate-600">
                        Passport Book
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ""}
                          className="flex items-center justify-between space-y-1"
                        >
                          <div className="flex flex-col gap-4">
                            {/* <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="size-5"
                                  value="standard"
                                />
                              </FormControl>
                              <FormLabel className="font-medium text-base flex gap-2">
                                Standard Delivery ($0)
                                <FieldTooltip message="Your passport and your supporting documents will be mailed back separately. Your documents may come up to 4 weeks after receiving your passport." />
                              </FormLabel>
                            </FormItem> */}
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="size-5"
                                  value="one-two-day"
                                />
                              </FormControl>
                              <FormLabel className="font-medium text-base flex gap-2">
                                1-2 Day Delivery
                                <FieldTooltip message="Your passport and your supporting documents will be mailed back separately. Your documents may come up to 4 weeks after receiving your passport." />
                              </FormLabel>
                            </FormItem>
                          </div>
                          {/* <span className="text-base font-medium">
                            $
                            {PRICES["oneTwoDay"]}
                          </span> */}
                        </RadioGroup>
                      </FormControl>
                      {/* <FormDescription>
                        1-2 Day Delivery is not available outside the United
                        States.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {(passportOption === "card" || passportOption === "both") && (
                <div className="space-y-3">
                  <FormLabel className="text-base text-slate-600">
                    Passport Card
                  </FormLabel>
                  <RadioGroup
                    value="standard"
                    className="flex items-center justify-between space-y-1"
                  >
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem className="size-5" value="standard" />
                      <FormLabel className="font-medium text-base flex gap-2 items-center">
                        Standard Delivery
                        <FieldTooltip message="Delivery by First Class Mail for passport card; documents may be returned separately" />
                      </FormLabel>
                    </div>
                    {/* <span className="text-base font-medium">$0</span> */}
                  </RadioGroup>
                  <FormMessage />
                </div>
              )}
            </div>
            {showFileSearch && (
              <div className="w-full flex  items-center justify-between md:px-8 mx-4">
                {/* Additional Fees */}
                <FormField
                  control={form.control}
                  name="additionalFees.fileSearch"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          className="size-5"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 flex gap-2 items-center leading-none">
                        <FormLabel className="text-base">
                          File Search (+${PRICES.fileSearch})
                        </FormLabel>
                        <FieldTooltip message="This is an optional fee for new passport book or card applications without proof of citizenship." />
                      </div>
                    </FormItem>
                  )}
                />
                {fileSearch && (
                  <span className="text-base font-medium">
                    ${PRICES["fileSearch"]}
                  </span>
                )}
              </div>
            )}
            {/* <div className="text-base mx-4 md:px-8 w-full flex justify-between items-center">
              <span className="flex gap-2">
                Execution (Acceptance) Fee:{" "}
                <FieldTooltip message="This is a mandatory fee when applying for a new passport book or card." />
              </span>
              <span className="font-medium">${acceptanceFee}</span>
            </div> */}
            {/* Order Summary */}
            <div className="rounded-lg bg-slate-100 md:px-8 p-4 text-base">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Total Payable to &#34;Department of State&#34;</span>
                  <span>${stateDepFee.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Payable to your acceptance facility</span>
                  <span>${acceptanceFee.toFixed(2)}</span>
                </div> */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                className="mr-auto text-primary"
                variant={"outline"}
                size={"sm"}
                onClick={goBack}
              >
                <ArrowLeft />
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
