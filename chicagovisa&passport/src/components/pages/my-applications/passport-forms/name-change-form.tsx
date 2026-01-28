"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import CustomDateInput from "@/components/globals/date-text-input";

// Constants for form options
const INCORRECT_FIELDS = [
  { id: "lastName", label: "Last Name" },
  { id: "firstName", label: "First Name" },
  { id: "middleName", label: "Middle Name" },
  { id: "placeOfBirth", label: "Place of Birth" },
  { id: "dateOfBirth", label: "Date of Birth" },
  { id: "gender", label: "Sex" },
] as const;

const NAME_CHANGE_REASONS = [
  { id: "marriage", label: "Marriage" },
  { id: "courtOrder", label: "Court Order" },
] as const;

// Schema for the form
const createDocumentDetailsSchema = (applicantDOB: Date) => {
  return z
    .object({
      dataCorrectness: z.enum(
        ["correct", "incorrectCard", "incorrectBook", "incorrectBoth"],
        {
          required_error: "Please select if the data was printed correctly",
        }
      ),
      incorrectFields: z.array(z.string()).optional(),
      nameChanged: z.enum(
        ["noChange", "changedCard", "changedBook", "changedBoth"],
        {
          required_error: "Please select if your name has changed",
        }
      ),
      nameChangeDetails: z
        .object({
          reason: z.enum(["marriage", "courtOrder"]).optional(),
          date: z.string().optional(),
          place: z.string().max(35, "Maximum 35 characters").optional(),
          canProvideDocumentation: z.boolean().optional(),
        })
        .optional(),
      isLimitedPassport: z.boolean().optional(),
      paidForCard: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.dataCorrectness !== "correct") {
        if (!data.incorrectFields || data.incorrectFields.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select the incorrect fields",
            path: ["incorrectFields"],
          });
        }
      }
      if (data.nameChanged !== "noChange") {
        if (!data.nameChangeDetails?.reason) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select the reason for name change",
            path: ["nameChangeDetails", "reason"],
          });
        }
        if (!data.nameChangeDetails?.date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide the date of name change",
            path: ["nameChangeDetails", "date"],
          });
        }
        const inputDate = parseMDYDate(data.nameChangeDetails?.date!);
        if (!inputDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide a valid date of name change",
            path: ["nameChangeDetails", "date"],
          });
          return;
        }
        const dobDate = applicantDOB;
        const currentDate = getCurrentDateInDC();

        if (
          !(
            inputDate >= dobDate && // Date must be after or equal to DOB
            inputDate <= currentDate
          ) // Date cannot be in the future
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Name change date must be between the applicant's date of birth (${applicantDOB.toLocaleDateString("en-us", { day: "2-digit", month: "2-digit", year: "numeric" })}) and ${currentDate.toLocaleDateString("en-us", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
            path: ["nameChangeDetails", "date"],
          });
        }
        if (!data.nameChangeDetails?.place) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide the place of name change",
            path: ["nameChangeDetails", "place"],
          });
        }
        if (
          data.nameChangeDetails?.canProvideDocumentation === null ||
          data.nameChangeDetails?.canProvideDocumentation === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please indicate if you can provide documentation",
            path: ["nameChangeDetails", "canProvideDocumentation"],
          });
        }
      }
      if (data.isLimitedPassport === true) {
        if (data.paidForCard === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please indicate if you paid for a card",
            path: ["paidForCard"],
          });
        }
      }
    });
};

interface DocumentDetailsFormProps {
  onSubmit: (values: any) => void;
  defaultValues?: any;
  goBack: () => void;
  passportType: "card" | "book" | "both";
  showQuestionCount: 1 | 2 | 3;
  applicantDOB: Date;
  isLoading: boolean;
}

export function NameChangeInfoForm({
  onSubmit,
  defaultValues,
  goBack,
  passportType,
  showQuestionCount,
  applicantDOB,
  isLoading,
}: DocumentDetailsFormProps) {
  const DocumentDetailsSchema = createDocumentDetailsSchema(applicantDOB);
  type DocumentDetailsFormData = z.infer<typeof DocumentDetailsSchema>;
  const form = useForm<DocumentDetailsFormData>({
    resolver: zodResolver(DocumentDetailsSchema),
    defaultValues:
      Object.keys(defaultValues || {}).length !== 0
        ? defaultValues
        : {
            dataCorrectness: "correct",
            incorrectFields: [],
            nameChanged: "noChange",
            nameChangeDetails: {
              canProvideDocumentation: false,
            },
            isLimitedPassport: false,
            paidForCard: false,
          },
  });

  const dataCorrectness = form.watch("dataCorrectness");
  const nameChanged = form.watch("nameChanged");

  const isLimitedPassport = form.watch("isLimitedPassport");

  useEffect(() => {
    const currentValues = form.getValues();
    let updatedValues = { ...currentValues };

    if (showQuestionCount < 2) {
      updatedValues.dataCorrectness = "correct";
      updatedValues.incorrectFields = undefined;
    }

    if (passportType !== "both") {
      if (updatedValues.dataCorrectness?.includes("both")) {
        updatedValues.dataCorrectness =
          `incorrect${passportType.charAt(0).toUpperCase() + passportType.slice(1)}` as DocumentDetailsFormData["dataCorrectness"];
      }
      if (updatedValues.nameChanged?.includes("both")) {
        updatedValues.nameChanged =
          `changed${passportType.charAt(0).toUpperCase() + passportType.slice(1)}` as DocumentDetailsFormData["nameChanged"];
      }
    }

    form.reset(updatedValues);
  }, [passportType, showQuestionCount, form]);

  const getDataCorrectnessOptions = () => {
    if (passportType === "both" && showQuestionCount > 1) {
      return [
        {
          value: "incorrectCard",
          label: "No, it was printed incorrectly on my passport card",
        },
        {
          value: "incorrectBook",
          label: "No, it was printed incorrectly on my passport book",
        },
        {
          value: "incorrectBoth",
          label: "No, it was printed incorrectly on my passport book and card",
        },
        { value: "correct", label: "Yes, it was printed correctly" },
      ];
    }
    return [
      {
        value:
          `incorrect${passportType.charAt(0).toUpperCase() + passportType.slice(1)}` as const,
        label: `No, it was printed incorrectly on my passport ${passportType}`,
      },
      { value: "correct", label: "Yes, it was printed correctly" },
    ];
  };

  const getNameChangeOptions = () => {
    if (passportType === "both" && showQuestionCount >= 1) {
      return [
        {
          value: "changedCard",
          label: "Yes, it has changed since I got my passport card",
        },
        {
          value: "changedBook",
          label: "Yes, it has changed since I got my passport book",
        },
        {
          value: "changedBoth",
          label: "Yes, it has changed since I got my passport book and card",
        },
        {
          value: "noChange",
          label: "No, it has not changed since I was issued a document",
        },
      ];
    }
    return [
      {
        value:
          `changed${passportType.charAt(0).toUpperCase() + passportType.slice(1)}` as const,
        label: `Yes, it has changed since I got my passport ${passportType}`,
      },
      {
        value: "noChange",
        label: "No, it has not changed since I was issued a document",
      },
    ];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              //set unrequired and irrelevant data to null
              onSubmit({
                ...values,
                incorrectFields:
                  values.dataCorrectness === "correct"
                    ? undefined
                    : values.incorrectFields,
                nameChangeDetails:
                  values.nameChanged === "noChange"
                    ? undefined
                    : values.nameChangeDetails,
                paidForCard: isLimitedPassport ? values.paidForCard : undefined,
              });
            })}
            className="space-y-6"
          >
            {/* Data Correctness Section */}
            {showQuestionCount > 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dataCorrectness"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        Was the data printed correctly in your most recent
                        document?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {getDataCorrectnessOptions().map((option) => (
                            <FormItem
                              key={option.value}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Incorrect Fields Section */}
                {dataCorrectness && dataCorrectness !== "correct" && (
                  <FormField
                    control={form.control}
                    name="incorrectFields"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Please select the item(s) that are printed
                            incorrectly
                          </FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {INCORRECT_FIELDS.map((field) => (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name="incorrectFields"
                              render={({ field: { onChange, value } }) => (
                                <FormItem
                                  key={field.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={value?.includes(field.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? onChange([
                                              ...(value || []),
                                              field.id,
                                            ])
                                          : onChange(
                                              value?.filter(
                                                (val) => val !== field.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {field.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Name Change Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nameChanged"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">
                      Has your name changed since your most recent document was
                      issued?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {getNameChangeOptions().map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Change Details */}
              {nameChanged && nameChanged !== "noChange" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name="nameChangeDetails.reason"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Reason for the name change?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {NAME_CHANGE_REASONS.map((reason) => (
                              <FormItem
                                key={reason.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={reason.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {reason.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameChangeDetails.date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of name change (MM/DD/YYYY)</FormLabel>
                        <FormControl>
                          <CustomDateInput
                            className="uppercase"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameChangeDetails.place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of name change (City/State)</FormLabel>
                        <FormControl>
                          <Input
                            className="uppercase"
                            {...field}
                            maxLength={35}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameChangeDetails.canProvideDocumentation"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Can you submit certified documentation to reflect the
                          name change?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) =>
                              field.onChange(value === "yes")
                            }
                            defaultValue={field.value ? "yes" : "no"}
                            className="flex flex-row space-x-4"
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
            </div>

            {/* Limited Passport Question */}
            {showQuestionCount === 3 &&
              (passportType === "book" || passportType === "both") && (
                <FormField
                  control={form.control}
                  name="isLimitedPassport"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        Was your most recent passport book limited for two years
                        or less?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value === "yes");
                          }}
                          value={field.value ? "yes" : "no"}
                          className="flex flex-row space-x-4"
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

            {/* Paid for Card Question */}
            {showQuestionCount === 3 &&
              passportType === "book" &&
              isLimitedPassport && (
                <FormField
                  control={form.control}
                  name="paidForCard"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        Did you pay for a card the last time you applied?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value === "yes");
                          }}
                          value={field.value ? "yes" : "no"}
                          className="flex flex-row space-x-4"
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

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
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
      </div>
    </div>
  );
}
