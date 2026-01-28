import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import CustomDateInput from "@/components/globals/date-text-input";

export function createPassportSchemas(applicantDOB: Date) {
  const PassportCardDetailsSchema = z
    .object({
      status: z.enum(["yes", "damaged", "lost", "stolen"], {
        message: "Please select an option",
      }),
      firstNameAndMiddleName: z
        .string()
        .max(80, "Maximum 80 characters")
        .optional()
        .nullable(),
      lastName: z
        .string()
        .max(80, "Maximum 80 characters")
        .optional()
        .nullable(),
      number: z
        .string()
        .refine((value) => {
          if (!value) return true;
          return value.length === 9;
        }, "Invalid passport card number")
        .refine((value) => {
          if (!value) return true;
          const regex = /^[A-Za-z]\d*$/;
          return regex.test(value!);
        }, "Invalid passport card number")
        .optional()
        .nullable(),
      issueDate: z
        .string()
        .refine(
          (date) => {
            if (!date) return true;
            const issueDateObj = new Date(date);
            const startDate = new Date("Jul 12 2008");
            return issueDateObj >= startDate;
          },
          {
            message: "Issue date should be after 12 Jul, 2008",
          }
        )
        .refine(
          (date) => {
            if (!date) return true;
            const issueDateObj = new Date(date);
            return issueDateObj >= applicantDOB;
          },
          {
            message: `Issue date cannot be older than the applicant's date of birth (${applicantDOB.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })})`,
          }
        )

        .refine(
          (date) => {
            if (!date) return true;
            const issueDateObj = new Date(date);
            const currentDate = getCurrentDateInDC();
            return issueDateObj <= currentDate;
          },
          {
            message: "Issue date cannot be in the future",
          }
        )
        .optional()
        .nullable(),
      hasReportedLostOrStolen: z.boolean().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.status === "yes") {
          return !!data.issueDate;
        }
        return true;
      },
      {
        message: "Issue date is required",
        path: ["issueDate"],
      }
    )
    .refine(
      (data) => {
        if (data.status === "yes") {
          return !!data.number;
        }
        return true;
      },
      {
        message: "Number is required",
        path: ["number"],
      }
    )
    .refine(
      (data) => {
        if (data.status === "lost" || data.status === "stolen") {
          return typeof data.hasReportedLostOrStolen === "boolean";
        }
        return true;
      },
      {
        message:
          "Please specify if you have reported the lost or stolen passport",
        path: ["hasReportedLostOrStolen"],
      }
    );

  const PassportBookDetailsSchema = z
    .object({
      status: z.enum(["yes", "damaged", "lost", "stolen"], {
        message: "Please select an option",
      }),
      firstNameAndMiddleName: z
        .string()
        .max(80, "Maximum 80 characters")
        .optional()
        .nullable(),
      lastName: z
        .string()
        .max(80, "Maximum 80 characters")
        .optional()
        .nullable(),
      number: z
        .string()
        .refine((value) => {
          if (!value) return true;
          return value.length === 9;
        }, "Invalid passport book number")
        .refine((value) => {
          const regex = /^([A-Z]?\d{0,8}|\d{0,9})$/;
          return regex.test(value!);
        }, "Invalid passport book number")
        .optional()
        .nullable(),
      issueDate: z
        .string()
        .refine(
          (date) => {
            if (!date) return true;
            return !!parseMDYDate(date);
          },
          { message: "Invalid date provided", path: ["issueDate"] }
        )
        .refine(
          (date) => {
            if (!date) return true;
            const issueDateObj = new Date(date);
            return issueDateObj >= applicantDOB;
          },
          {
            message: `Issue date cannot be older than the applicant's date of birth (${applicantDOB.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })})`,
          }
        )
        .refine(
          (date) => {
            if (!date) return true;
            const issueDateObj = parseMDYDate(date)!;
            const currentDate = getCurrentDateInDC();
            return issueDateObj <= currentDate;
          },
          {
            message: "Issue date cannot be in the future",
          }
        )
        .optional()
        .nullable(),
      isOlderThan15Years: z
        .enum(["yes", "no", "unknown"])
        .optional()
        .nullable(),
      hasReportedLostOrStolen: z.boolean().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.status === "yes") {
          return !!data.issueDate;
        }
        return true;
      },
      {
        message: "Issue date is required",
        path: ["issueDate"],
      }
    )
    .refine(
      (data) => {
        if (data.status === "lost" || data.status === "stolen") {
          return typeof data.hasReportedLostOrStolen === "boolean";
        }
        return true;
      },
      {
        message:
          "Please specify if you have reported the lost or stolen passport",
        path: ["hasReportedLostOrStolen"],
      }
    )
    .refine(
      (data) => {
        if (data.status === "yes") {
          return !!data.number;
        }
        return true;
      },
      {
        message: "Number is required",
        path: ["number"],
      }
    )
    .refine(
      (data) => {
        if (
          (data.status === "lost" || data.status === "stolen") &&
          !data.issueDate &&
          !data.hasReportedLostOrStolen
        ) {
          return (
            data.isOlderThan15Years &&
            typeof data.isOlderThan15Years === "string"
          );
        }
        return true;
      },
      {
        message:
          "Please specify if the passport was issued more than 15 years ago",
        path: ["isOlderThan15Years"],
      }
    )
    .superRefine((data, ctx) => {
      if (data.status === "lost" || data.status === "stolen") {
        if (data.hasReportedLostOrStolen === undefined && !data.issueDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please specify if you have reported the lost or stolen passport",
            path: ["hasReportedLostOrStolen"],
          });
        }
      }
    });

  const PassportHistorySchema = z
    .object({
      hasPassportCardOrBook: z.enum(["book", "card", "both", "none"]),
      passportCardDetails: PassportCardDetailsSchema.optional().nullable(),
      passportBookDetails: PassportBookDetailsSchema.optional().nullable(),
    })
    .refine(
      (data) => {
        if (
          data.hasPassportCardOrBook === "card" ||
          data.hasPassportCardOrBook === "both"
        ) {
          return !!data.passportCardDetails;
        }
        return true;
      },
      {
        message: "Passport card details are required",
        path: ["passportCardDetails"],
      }
    )
    .refine(
      (data) => {
        if (
          data.hasPassportCardOrBook === "book" ||
          data.hasPassportCardOrBook === "both"
        ) {
          return !!data.passportBookDetails;
        }
        return true;
      },
      {
        message: "Passport book details are required",
        path: ["passportBookDetails"],
      }
    );

  return {
    PassportCardDetailsSchema,
    PassportBookDetailsSchema,
    PassportHistorySchema,
  };
}

type PassportHistoryFormData = z.infer<
  ReturnType<typeof createPassportSchemas>["PassportHistorySchema"]
>;

type PassportHistoryFormProps = {
  goBack: () => void;
  onSubmit: (values: PassportHistoryFormData) => void;
  defaultValues?: PassportHistoryFormData;
  applicantDOB: Date;
  isLoading: boolean;
};

export function PassportHistoryForm({
  goBack,
  onSubmit,
  defaultValues,
  applicantDOB,
  isLoading,
}: PassportHistoryFormProps) {
  const { PassportHistorySchema } = createPassportSchemas(applicantDOB);

  const form = useForm<PassportHistoryFormData>({
    resolver: zodResolver(PassportHistorySchema),
    defaultValues:
      Object.keys(defaultValues || {}).length !== 0
        ? defaultValues
        : {
            hasPassportCardOrBook: "none",
            passportCardDetails: undefined,
            passportBookDetails: undefined,
          },
  });

  const { control, watch, setValue } = form;
  const hasPassportCardOrBook = watch("hasPassportCardOrBook");

  useEffect(() => {
    if (hasPassportCardOrBook === "none") {
      setValue("passportCardDetails", undefined, { shouldValidate: true });
      setValue("passportBookDetails", undefined, { shouldValidate: true });
    } else if (hasPassportCardOrBook === "card") {
      setValue("passportBookDetails", undefined, { shouldValidate: true });
    } else if (hasPassportCardOrBook === "book") {
      setValue("passportCardDetails", undefined, { shouldValidate: true });
    }
  }, [hasPassportCardOrBook, setValue]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name?.endsWith(".status") && type === "change") {
        const detailsType = name.includes("Card")
          ? "passportCardDetails"
          : "passportBookDetails";
        form.clearErrors(`${detailsType}.number`);
        form.clearErrors(`${detailsType}.issueDate`);
        //@ts-ignore
        form.clearErrors(`${detailsType}.isOlderThan15Years`);
        form.clearErrors(`${detailsType}.hasReportedLostOrStolen`);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const renderPassportDetails = (type: "card" | "book") => {
    const details =
      type === "card" ? "passportCardDetails" : "passportBookDetails";
    const status = watch(`${details}.status`);
    const issueDate = watch(`${details}.issueDate`);
    const hasReportedLostOrStolen = watch(`${details}.hasReportedLostOrStolen`);

    return (
      <>
        <div className="md:col-span-2 gap-4">
          <h3 className=" text-lg font-semibold">
            Passport {type === "card" ? "Card" : "Book"} Details
          </h3>
        </div>
        <FormField
          control={control}
          name={`${details}.status`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <div className="flex flex-col">
                {" "}
                <FormLabel>
                  Do you still have the {type} in your possession?{" "}
                  <span className="text-lg text-red-500">*</span>
                </FormLabel>
                <span className="text-blue-700 mt-2">
                  NOTE: By selecting YES, you will be required to submit the{" "}
                  {type} with your application.
                </span>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${type}-yes`} />
                    <Label htmlFor={`${type}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="damaged" id={`${type}-damaged`} />
                    <Label className="leading-6" htmlFor={`${type}-damaged`}>
                      Yes, but it was Damaged or Mutilated
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lost" id={`${type}-lost`} />
                    <Label htmlFor={`${type}-lost`}>No, it was Lost</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stolen" id={`${type}-stolen`} />
                    <Label htmlFor={`${type}-stolen`}>
                      No, it has been Stolen
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${details}.issueDate`}
          render={({ field }) => (
            <FormItem className="col-span-2 md:w-3/4">
              <FormLabel>
                The date your most recent passport {type} was issued
                {status === "yes" && (
                  <span className="text-lg text-red-500">*</span>
                )}
              </FormLabel>
              <FormControl>
                <CustomDateInput
                  {...field}
                  className="w-fit uppercase"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "book" &&
          !hasReportedLostOrStolen &&
          (status === "lost" || status === "stolen") &&
          !issueDate && (
            <FormField
              control={control}
              //@ts-ignore
              name={`${details}.isOlderThan15Years`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Was your lost or stolen passport book issued more than 15
                    years ago?
                    <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      //@ts-ignore
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${type}-older-yes`} />
                        <Label htmlFor={`${type}-older-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${type}-older-no`} />
                        <Label htmlFor={`${type}-older-no`}>No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="unknown"
                          id={`${type}-older-unknown`}
                        />
                        <Label htmlFor={`${type}-older-unknown`}>Unknown</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        {(status === "lost" || status === "stolen") && (
          <FormField
            control={control}
            name={`${details}.hasReportedLostOrStolen`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  Have you reported your lost or stolen {type}?
                  <span className="text-lg text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "yes")}
                    value={
                      field.value === true
                        ? "yes"
                        : field.value === false
                          ? "no"
                          : undefined
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${type}-reported-yes`} />
                      <Label htmlFor={`${type}-reported-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${type}-reported-no`} />
                      <Label htmlFor={`${type}-reported-no`}>No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <span className="font-medium text-base text-slate-500 col-span-2">
            Your name as printed on your most recent {type}:
          </span>
          <FormField
            control={control}
            name={`${details}.firstNameAndMiddleName`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>First Name and Middle Name</FormLabel>
                <FormControl>
                  <Input
                    className="uppercase"
                    maxLength={80}
                    {...field}
                    value={field.value ?? ""}
                    placeholder="First Name and Middle Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${details}.lastName`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="uppercase"
                    maxLength={80}
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${details}.number`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="capitalize">
                  {type} Number
                  {status === "yes" && (
                    <span className="text-lg text-red-500">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    className="uppercase"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (value.length <= 9) {
                        const regex =
                          details === "passportBookDetails"
                            ? /^([A-Z]?\d{0,8}|\d{0,9})$/
                            : /^[A-Za-z]\d*$/;
                        if (regex.test(value) || value === "") {
                          field.onChange({
                            ...e,
                            target: { ...e.target, value: value.toUpperCase() },
                          });
                        }
                      }
                    }}
                    placeholder="Passport Number"
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </>
    );
  };

  const handleSubmit = (values: PassportHistoryFormData) => {
    const transformedData = {
      hasPassportCardOrBook: values.hasPassportCardOrBook,
      passportCardDetails:
        values.hasPassportCardOrBook === "card" ||
        values.hasPassportCardOrBook === "both"
          ? values.passportCardDetails
          : null,
      passportBookDetails:
        values.hasPassportCardOrBook === "book" ||
        values.hasPassportCardOrBook === "both"
          ? values.passportBookDetails
          : null,
    };
    //@ts-ignore
    onSubmit(transformedData);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center md:min-h-[80vh] md:w-3/4">
      <h2 className="mb-10 text-xl font-semibold">
        Tell us about your passport history
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={control}
            name="hasPassportCardOrBook"
            render={({ field }) => (
              <FormItem className="space-y-3 bg-slate-100 p-8">
                <FormLabel>
                  Have you been issued any of the following?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="card" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Have a passport card and want to renew or replace it
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="book" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Have a passport book and want to renew or replace it
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="both" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Have both a book and card and want to renew or replace
                        both documents
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        First-time applicant, or child under age 16, or do not
                        want to submit most recent passport
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(hasPassportCardOrBook === "book" ||
            hasPassportCardOrBook === "both") && (
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderPassportDetails("book")}
            </div>
          )}

          {(hasPassportCardOrBook === "card" ||
            hasPassportCardOrBook === "both") && (
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderPassportDetails("card")}
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
    </div>
  );
}
