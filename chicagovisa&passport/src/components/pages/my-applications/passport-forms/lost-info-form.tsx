"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Props interface
interface LostPassportFormProps {
  goBack: () => void;
  onSubmit: (values: any) => void;
  cardIssueDate: Date | null;
  bookIssueDate: Date | null;
  applicantDOB: Date;
  isCardLost: boolean;
  isBookLost: boolean;
  defaultValues?: any;
  isLoading?: boolean;
}

import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import CustomDateInput from "@/components/globals/date-text-input";

// Create a schema factory function
const createLostInfoSchema = (
  isCardLost: boolean,
  isBookLost: boolean,
  cardIssueDate: Date,
  bookIssueDate: Date
) => {
  return z
    .object({
      isOwnPassport: z.boolean(),
      reporterFirstName: z.string().optional(),
      reporterMiddleName: z.string().optional(),
      reporterLastName: z.string().optional(),
      reporterRelationship: z.string().optional(),
      policeReport: z.boolean(),
      lostAtSameTime: z.boolean().optional(),
      cardLostDetails: z.string().optional(),
      cardLostLocation: z.string().optional(),
      cardLostDate: z.string().optional().nullable(),
      bookLostDetails: z.string().optional(),
      bookLostLocation: z.string().optional(),
      bookLostDate: z.string().optional().nullable(),
      hadPreviousLost: z.boolean(),
      previousLostCount: z.enum(["1", "2"]).optional(),
      previousLostDates: z.array(z.string()).optional(),
      previousPoliceReport: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      // Existing validations
      if (data.isOwnPassport === false) {
        if (!data.reporterFirstName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reporter's first name is required",
            path: ["reporterFirstName"],
          });
        }
        if (!data.reporterLastName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reporter's last name is required",
            path: ["reporterLastName"],
          });
        }
        if (!data.reporterRelationship) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reporter's relationship is required",
            path: ["reporterRelationship"],
          });
        }
      }

      if (data.hadPreviousLost === true) {
        if (!data.previousLostCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select how many passports were lost",
            path: ["previousLostCount"],
          });
        }
        if (
          data.previousPoliceReport === null ||
          data.previousPoliceReport === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please indicate if you filed a police report",
            path: ["previousPoliceReport"],
          });
        }
      }

      // New validations
      const today = getCurrentDateInDC();

      // Card validations
      if (isCardLost) {
        if (!data.cardLostDetails) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please provide details about how the ${isBookLost ? "book/card" : "card"} was lost`,
            path: ["cardLostDetails"],
          });
        }
        if (!data.cardLostLocation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please provide the location where the ${isBookLost ? "book/card" : "card"} was lost`,
            path: ["cardLostLocation"],
          });
        }
        if (!data.cardLostDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please provide the date when the ${isBookLost ? "book/card" : "card"} was lost`,
            path: ["cardLostDate"],
          });
        } else {
          const lostDate = parseMDYDate(data.cardLostDate)!;
          if (lostDate < cardIssueDate || lostDate > today) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Lost date must be between the issue date and today",
              path: ["cardLostDate"],
            });
          }
        }
      }

      // Book validations
      if (isBookLost) {
        if (!data.bookLostDetails) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide details about how the book was lost",
            path: ["bookLostDetails"],
          });
        }
        if (!data.bookLostLocation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide the location where the book was lost",
            path: ["bookLostLocation"],
          });
        }
        if (!data.bookLostDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide the date when the book was lost",
            path: ["bookLostDate"],
          });
        } else {
          const lostDate = parseMDYDate(data.bookLostDate)!;
          if (lostDate < bookIssueDate || lostDate > today) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Lost date must be between the issue date and ${today.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })}`,
              path: ["bookLostDate"],
            });
          }
        }
      }
    });
};

// In your component:
export const LostPassportForm = ({
  goBack,
  onSubmit,
  cardIssueDate,
  bookIssueDate,
  applicantDOB,
  isCardLost,
  isBookLost,
  defaultValues,
  isLoading,
}: LostPassportFormProps) => {
  const lostInfoSchema = createLostInfoSchema(
    isCardLost,
    isBookLost,
    cardIssueDate!,
    bookIssueDate!
  );

  type LostPassportInfo = z.infer<typeof lostInfoSchema>;
  const form = useForm<LostPassportInfo>({
    resolver: zodResolver(lostInfoSchema),
    defaultValues:
      Object.keys(defaultValues).length !== 0
        ? defaultValues
        : {
            isOwnPassport: true,
            hadPreviousLost: false,
            previousLostDates: [],
            policeReport: false,
            previousPoliceReport: false,
            lostAtSameTime: false,
          },
  });

  const isOwnPassport = form.watch("isOwnPassport");
  const hadPreviousLost = form.watch("hadPreviousLost");
  const previousLostCount = form.watch("previousLostCount");
  const lostAtSameTime = form.watch("lostAtSameTime");
  // Clear reporter fields when switching to own passport
  useEffect(() => {
    if (isOwnPassport === true) {
      form.setValue("reporterFirstName", undefined);
      form.setValue("reporterMiddleName", undefined);
      form.setValue("reporterLastName", undefined);
      form.setValue("reporterRelationship", undefined);
    }
  }, [isOwnPassport, form]);

  // Handle date validation

  useEffect(() => {
    if (!isBookLost) {
      form.setValue("bookLostDetails", "");
      form.setValue("bookLostLocation", "");
      form.setValue("bookLostDate", "");
    }
    if (!isCardLost) {
      form.setValue("cardLostDetails", "");
      form.setValue("cardLostLocation", "");
      form.setValue("cardLostDate", "");
    }
  }, [defaultValues]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-4/5">
        <FormField
          control={form.control}
          name="isOwnPassport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are you reporting your own valid lost or stolen U.S. passport?
              </FormLabel>
              <br />
              <span className="text-red-400 break-words md:w-3/4 font-medium">
                If you are not reporting your own passport as lost or stolen,
                you will NOT be able to submit a report online. However, you
                will be able to print a completed DS-64 Statement Regarding
                Valid Lost or Stolen U.S. Passport. The passport holder must
                carefully review the printed instructions, sign it, submit a
                photocopy of a government-issued photo identification (such as a
                driver’s license or a state-issued identification card), AND
                mail it to the address provided on the form.{" "}
              </span>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "yes")}
                  value={field.value ? "yes" : "no"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOwnPassport === false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reporterFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reporter First Name{" "}
                    <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reporterMiddleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporter Middle Name</FormLabel>
                  <FormControl>
                    <Input className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reporterLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reporter Last Name{" "}
                    <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reporterRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What is the reporter&#39;s relationship to the owner of the
                    passport? <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="policeReport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Did you file a police report?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "yes")}
                  value={field.value ? "yes" : "no"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCardLost && isBookLost && (
          <FormField
            control={form.control}
            name="lostAtSameTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Did you lose your valid U.S. passport book and card at the
                  same time and place?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "yes")}
                    value={field.value ? "yes" : "no"}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Lost Details Section */}
        {(isCardLost || isBookLost) && (
          <div className="space-y-6">
            {/* Combined loss case */}
            {isCardLost && isBookLost && lostAtSameTime === true && (
              <>
                <FormField
                  control={form.control}
                  name="cardLostDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Explain in detail how your valid U.S. passport book/card
                        was lost or stolen. Include a photocopy of the valid
                        passport book and card if available.{" "}
                        {`(${form.getValues("cardLostDetails")?.length || 0}/115)`}{" "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          maxLength={111}
                          {...field}
                          onChange={(e) => {
                            form.setValue("bookLostDetails", e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardLostLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Explain where the loss or theft occurred. Provide the
                        address, if known (City and State, if in the U.S., or
                        City and Country as it is presently known){" "}
                        {`(${form.getValues("cardLostLocation")?.length || 0}/115)`}{" "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          maxLength={111}
                          {...field}
                          onChange={(e) => {
                            form.setValue("bookLostLocation", e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardLostDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        On what date were your valid U.S. passport book and card
                        lost or stolen? If unknown, when was the last time you
                        remember them in your possession? (MM/DD/YYYY)
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <CustomDateInput
                          className="uppercase md:w-1/2"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            form.setValue("bookLostDate", e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Separate loss cases */}
            {((isCardLost && isBookLost && lostAtSameTime === false) ||
              (isCardLost && !isBookLost) ||
              (!isCardLost && isBookLost)) && (
              <>
                {isCardLost && (
                  <>
                    <h2 className="text-slate-500 font-medium text-lg">
                      Passport Card
                    </h2>
                    <FormField
                      control={form.control}
                      name="cardLostDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Explain in detail how your valid U.S. passport card
                            was lost or stolen. Include a photocopy of the valid
                            passport card if available.
                            {`(${form.getValues("cardLostDetails")?.length || 0}/115)`}{" "}
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={3} maxLength={111} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardLostLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Explain where the loss or theft occurred. Provide
                            the address, if known (City and State, if in the
                            U.S., or City and Country as it is presently known)
                            {`(${form.getValues("cardLostLocation")?.length || 0}/115)`}{" "}
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={3} maxLength={111} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardLostDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            On what date was your valid U.S. passport card lost
                            or stolen? If unknown, when was the last time you
                            remember it in your possession? (MM/DD/YYYY)
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomDateInput
                              className="uppercase md:w-1/2"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {isBookLost && (
                  <>
                    <h2 className="text-slate-500 font-medium text-lg">
                      Passport Book
                    </h2>
                    <FormField
                      control={form.control}
                      name="bookLostDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Explain in detail how your valid U.S. passport book
                            was lost or stolen. Include a photocopy of the valid
                            passport book if available.{" "}
                            {`(${form.getValues("bookLostDetails")?.length || 0}/115)`}{" "}
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={3} maxLength={111} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bookLostLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Explain where the loss or theft occurred. Provide
                            the address, if known (City and State, if in the
                            U.S., or City and Country as it is presently known)
                            {`(${form.getValues("bookLostLocation")?.length || 0}/115)`}{" "}
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea rows={3} maxLength={111} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bookLostDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            On what date was your valid U.S. passport book lost
                            or stolen ? If unknown, when was the last time you
                            remember it in your possession? (MM/DD/YYYY)
                            <span className="text-lg text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomDateInput
                              className="uppercase md:w-1/2"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Previous Lost Passports Section */}
        <FormField
          control={form.control}
          name="hadPreviousLost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Have you had any other valid U.S. passport book/card lost or
                stolen?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "yes")}
                  value={field.value ? "yes" : "no"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hadPreviousLost === true && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="previousLostCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If yes, how many valid U.S. passports?</FormLabel>
                  <FormControl>
                    <select
                      className="styled-select w-[5rem] ml-2"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <option selected value="" disabled>
                        --
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previousLostCount && (
              <div className="space-y-4">
                {Array.from({ length: parseInt(previousLostCount) }).map(
                  (_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`previousLostDates.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Approximate date {index + 1} (MM/DD/YYYY)
                          </FormLabel>
                          <FormControl>
                            <CustomDateInput
                              className="uppercase md:w-1/2"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="previousPoliceReport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Did you file a police report?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between">
          <Button
            className="mr-auto text-primary"
            variant={"outline"}
            size={"sm"}
            onClick={goBack}
          >
            <ArrowLeft />
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
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
  );
};
