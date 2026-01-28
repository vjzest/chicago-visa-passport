import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatName } from "@/lib/utils";
import FieldTooltip from "./field-tooltip";
import { debounce } from "lodash";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
import { Card } from "@/components/ui/card";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import CustomDateInput from "@/components/globals/date-text-input";

const createCombinedSchema = (applicantDOB: Date) => {
  const ParentSchema = z.object({
    firstName: z.string().max(35, "maximum 35 digits").optional().nullable(),
    lastName: z.string().max(35, "maximum 35 digits").optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    placeOfBirth: z.string().max(40, "maximum 40 digits").optional().nullable(),
    gender: z.string().optional().nullable(),
    isUSCitizen: z.boolean().nullable(),
  });

  return z
    .object({
      isParent1Unknown: z.boolean(),
      isParent2Unknown: z.boolean(),
      parent1: ParentSchema.nullable(),
      parent2: ParentSchema.nullable(),
      isMarried: z.boolean(),
      marriageDetails: z
        .object({
          spouseFirstName: z
            .string()
            .max(35, "maximum 35 characters")
            .optional()
            .nullable(),
          spouseLastName: z
            .string()
            .max(35, "maximum 35 characters")
            .optional()
            .nullable(),
          spouseDateOfBirth: z.string().nullable().optional().nullable(),
          marriageDate: z.string().optional().nullable(),
          spousePlaceOfBirth: z
            .string()
            .max(40, "must be 40 characters maximum")
            .optional()
            .nullable(),
          spouseIsUSCitizen: z.boolean().optional().nullable(),
          isWidowedOrDivorced: z.boolean().optional().nullable(),
          widowOrDivorceDate: z.string().nullable().optional(),
        })
        .nullable(),
    })
    .superRefine((data, ctx) => {
      const applicantDate = applicantDOB;
      const currentDate = getCurrentDateInDC();

      if (!data.isParent1Unknown) {
        if (!data.parent1?.firstName) {
          ctx.addIssue({
            path: ["parent1.firstName"],
            code: z.ZodIssueCode.custom,
            message: "First name is required",
          });
        }
        if (!data.parent1?.lastName) {
          ctx.addIssue({
            path: ["parent1.lastName"],
            code: z.ZodIssueCode.custom,
            message: "Last name is required",
          });
        }
        if (!data.parent1?.gender) {
          ctx.addIssue({
            path: ["parent1.gender"],
            code: z.ZodIssueCode.custom,
            message: "Sex is required",
          });
        }
        if (data.parent1?.dateOfBirth) {
          const parent1DOB = parseMDYDate(data.parent1.dateOfBirth);
          if (!parent1DOB) {
            ctx.addIssue({
              path: ["parent1.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: "Parent's date of birth is invalid",
            });
          }
          if (parent1DOB! >= applicantDate) {
            ctx.addIssue({
              path: ["parent1.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Parent's date of birth must be before applicant's date of birth (${new Date(applicantDOB).toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })})`,
            });
          }
          if (parent1DOB! < new Date("1800-01-01")) {
            ctx.addIssue({
              path: ["parent1.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Parent's date of birth must be after 1800-01-01`,
            });
          }
        }
      }

      if (!data.isParent2Unknown) {
        if (!data.parent2?.firstName) {
          ctx.addIssue({
            path: ["parent2.firstName"],
            code: z.ZodIssueCode.custom,
            message: "First name is required",
          });
        }
        if (!data.parent2?.lastName) {
          ctx.addIssue({
            path: ["parent2.lastName"],
            code: z.ZodIssueCode.custom,
            message: "Last name is required",
          });
        }
        if (!data.parent2?.gender) {
          ctx.addIssue({
            path: ["parent2.gender"],
            code: z.ZodIssueCode.custom,
            message: "Sex is required",
          });
        }
        if (data.parent2?.dateOfBirth) {
          const parent2DOB = parseMDYDate(data.parent2.dateOfBirth);
          if (!parent2DOB!) {
            ctx.addIssue({
              path: ["parent2.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: "Parent's date of birth is invalid",
            });
          }
          if (parent2DOB! >= applicantDate) {
            ctx.addIssue({
              path: ["parent2.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Parent's date of birth must be before applicant's date of birth (${new Date(applicantDOB).toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })})`,
            });
          }
          if (parent2DOB! < new Date("1800-01-01")) {
            ctx.addIssue({
              path: ["parent2.dateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Parent's date of birth must be after 1800-01-01`,
            });
          }
        }
      }

      if (data.isMarried) {
        if (!data.marriageDetails?.spouseFirstName) {
          ctx.addIssue({
            path: ["marriageDetails.spouseFirstName"],
            code: z.ZodIssueCode.custom,
            message: "Spouse first name is required",
          });
        }
        if (!data.marriageDetails?.spouseLastName) {
          ctx.addIssue({
            path: ["marriageDetails.spouseLastName"],
            code: z.ZodIssueCode.custom,
            message: "Spouse last name is required",
          });
        }
        if (!data.marriageDetails?.spouseDateOfBirth) {
          ctx.addIssue({
            path: ["marriageDetails.spouseDateOfBirth"],
            code: z.ZodIssueCode.custom,
            message: "Spouse date of birth is required",
          });
        }
        if (data.marriageDetails?.spouseDateOfBirth) {
          const spouseDOB = parseMDYDate(
            data.marriageDetails?.spouseDateOfBirth
          );
          if (!spouseDOB!) {
            ctx.addIssue({
              path: ["marriageDetails.spouseDateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: "Spouse's date of birth is invalid",
            });
          }
          if (spouseDOB! >= currentDate) {
            ctx.addIssue({
              path: ["marriageDetails.spouseDateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Spouse date of birth must be before ${currentDate.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })}`,
            });
          }
          if (spouseDOB! < new Date("1800-01-01")) {
            ctx.addIssue({
              path: ["marriageDetails.spouseDateOfBirth"],
              code: z.ZodIssueCode.custom,
              message: `Parent's date of birth must be after 1800-01-01`,
            });
          }
        }
        if (!data.marriageDetails?.marriageDate) {
          ctx.addIssue({
            path: ["marriageDetails.marriageDate"],
            code: z.ZodIssueCode.custom,
            message: "Marriage date is required",
          });
        }

        if (!data.marriageDetails?.spousePlaceOfBirth) {
          ctx.addIssue({
            path: ["marriageDetails.spousePlaceOfBirth"],
            code: z.ZodIssueCode.custom,
            message: "Spouse place of birth is required",
          });
        }

        if (data.marriageDetails?.marriageDate) {
          const marriageDate = parseMDYDate(data.marriageDetails?.marriageDate);
          if (!marriageDate) {
            ctx.addIssue({
              path: ["marriageDetails.marriageDate"],
              code: z.ZodIssueCode.custom,
              message: "Invalid marriage date",
            });
          }
          if (marriageDate! <= applicantDate) {
            ctx.addIssue({
              path: ["marriageDetails.marriageDate"],
              code: z.ZodIssueCode.custom,
              message: `Marriage date must be after applicant's date of birth (${new Date(applicantDOB).toLocaleDateString("en-us", { day: "2-digit", month: "2-digit", year: "numeric" })})`,
            });
          }
          //marriage date should be on or before current Date
          if (marriageDate! > currentDate) {
            ctx.addIssue({
              path: ["marriageDetails.marriageDate"],
              code: z.ZodIssueCode.custom,
              message: `Marriage date must be on or before ${currentDate.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })}`,
            });
          }

          if (data.marriageDetails?.spouseDateOfBirth) {
            const spouseDOB = parseMDYDate(
              data.marriageDetails?.spouseDateOfBirth
            );
            if (!spouseDOB!) {
              ctx.addIssue({
                path: ["marriageDetails.spouseDateOfBirth"],
                code: z.ZodIssueCode.custom,
                message: "Spouse's date of birth is invalid",
              });
            }
            if (spouseDOB! >= marriageDate!) {
              ctx.addIssue({
                path: ["marriageDetails.spouseDateOfBirth"],
                code: z.ZodIssueCode.custom,
                message: "Spouse's date of birth must be before marriage date",
              });
            }
          }
        }

        if (
          data.marriageDetails?.isWidowedOrDivorced &&
          !data.marriageDetails?.widowOrDivorceDate
        ) {
          ctx.addIssue({
            path: ["marriageDetails.widowOrDivorceDate"],
            code: z.ZodIssueCode.custom,
            message:
              "Widow or divorce date is required when widowed or divorced",
          });
        }

        if (
          data.marriageDetails?.isWidowedOrDivorced &&
          data.marriageDetails?.widowOrDivorceDate &&
          data.marriageDetails?.marriageDate
        ) {
          const widowOrDivorceDate = parseMDYDate(
            data.marriageDetails?.widowOrDivorceDate
          );
          if (!widowOrDivorceDate) {
            ctx.addIssue({
              path: ["marriageDetails.widowOrDivorceDate"],
              code: z.ZodIssueCode.custom,
              message: "Invalid widow or divorce date",
            });
            return;
          }
          if (widowOrDivorceDate > currentDate) {
            ctx.addIssue({
              path: ["marriageDetails.widowOrDivorceDate"],
              code: z.ZodIssueCode.custom,
              message: `Widow or divorce date must be on or before ${currentDate.toLocaleDateString("en-us", { day: "2-digit", month: "short", year: "numeric" })}`,
            });
          }
        }
      }
    });
};
type CombinedFormData = z.infer<ReturnType<typeof createCombinedSchema>>;

type CombinedFormProps = {
  goBack: () => void;
  onSubmit: (values: {
    isParent1Unknown: boolean;
    isParent2Unknown: boolean;
    isMarried: boolean;
    parent1: null | CombinedFormData["parent2"];
    parent2: null | CombinedFormData["parent2"];
    marriageDetails: null | CombinedFormData["marriageDetails"];
  }) => void;
  defaultValues?: CombinedFormData;
  applicantDOB: Date;
  isLoading: boolean;
};

export function ParentAndMarriageInfoForm({
  goBack,
  onSubmit,
  defaultValues,
  applicantDOB,
  isLoading,
}: CombinedFormProps) {
  const CombinedSchema = createCombinedSchema(applicantDOB);
  const [isMarried, setIsMarried] = useState(defaultValues?.isMarried || false);
  const [initiallyFilled, setInitiallyFilled] = useState(false);
  const form = useForm<CombinedFormData>({
    resolver: zodResolver(CombinedSchema),
    defaultValues: {
      isParent1Unknown: false,
      isParent2Unknown: false,
      parent1: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        placeOfBirth: "",
        gender: "",
        isUSCitizen: false,
      },
      parent2: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        placeOfBirth: "",
        gender: "",
        isUSCitizen: false,
      },
      isMarried: false,
      marriageDetails: {
        spouseFirstName: "",
        spouseLastName: "",
        spouseDateOfBirth: "",
        marriageDate: "",
        spousePlaceOfBirth: "",
        spouseIsUSCitizen: false,
        isWidowedOrDivorced: false,
        widowOrDivorceDate: "",
      },
      ...defaultValues,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const {
    parentAndMarriageInfo: persistedInfo,
    setParentAndMarriageInfo: setPersistedInfo,
  } = usePassportApplicationStore((state) => state);
  const watchedFields = form.watch();

  // Debounced store update
  const updateStore = useCallback(
    debounce((data: CombinedFormData) => {}, 300),
    [setPersistedInfo]
  );

  // Sync with Zustand store in real time
  useEffect(() => {
    updateStore(watchedFields);
  }, [JSON.stringify(watchedFields)]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      updateStore.cancel();
    };
  }, []);

  useEffect(() => {
    if (
      (!defaultValues || Object.keys(defaultValues).length <= 1) &&
      persistedInfo &&
      !initiallyFilled
    ) {
      form.reset({
        ...persistedInfo,
        isMarried: persistedInfo.isMarried,
        marriageDetails: persistedInfo.isMarried
          ? persistedInfo.marriageDetails
          : null,
      });
    }
    setInitiallyFilled(true);
  }, [defaultValues, form, persistedInfo]);

  const submitTransformedData = (data: CombinedFormData) => {
    const transformedData: {
      isParent1Unknown: boolean;
      isParent2Unknown: boolean;
      isMarried: boolean;
      parent1: null | CombinedFormData["parent1"];
      parent2: null | CombinedFormData["parent2"];
      marriageDetails: null | CombinedFormData["marriageDetails"];
    } = {
      isParent1Unknown: data.isParent1Unknown,
      isParent2Unknown: data.isParent2Unknown,
      parent1: data.isParent1Unknown ? null : data.parent1,
      parent2: data.isParent2Unknown ? null : data.parent2,
      isMarried: data.isMarried,
      marriageDetails: data.isMarried ? data.marriageDetails : null,
    };
    onSubmit(transformedData);
  };

  const calculateAge = (birthDateString: Date) => {
    const today = getCurrentDateInDC();
    const birthDate = birthDateString;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const age = calculateAge(applicantDOB);
    if (age < 18) {
      setIsMarried(false);
      setValue("isMarried", false);
    }
  }, [applicantDOB, setValue]);

  return (
    <div className="w-full md:w-3/4 md:min-h-[80vh] flex flex-col justify-center items-center">
      <h2 className="font-semibold text-xl mb-10">
        Applicant&#39;s Family Information
      </h2>
      <Form {...form}>
        <form
          className="min-w-full"
          onSubmit={handleSubmit(submitTransformedData)}
        >
          <Card className="flex flex-col gap-2 bg-white p-4 mb-3">
            <span className="text-slate-500 font-medium">
              Note: Please fill in as much information as you know.
            </span>
            <span className="text-red-500 text-base font-medium">
              If completing as a THIRD PARTY or PARENT OF MINOR, complete the
              form in the context of the applicant NOT yourself.
            </span>
          </Card>

          {/* Parent Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-8">
            {/* Parent 1 */}
            <div className="w-full flex md:flex-row flex-col md:col-span-2 items-center gap-8">
              <h2 className="font-semibold text-lg w-fit text-slate-500 my-2">
                Mother/Father/Parent Of Applicant
              </h2>
              <FormField
                control={control}
                name="isParent1Unknown"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-end gap-2">
                    <FormControl>
                      <Checkbox
                        className="size-6"
                        checked={field.value}
                        onCheckedChange={(value) => {
                          if (value) {
                            setValue("parent1", {
                              firstName: "",
                              lastName: "",
                              dateOfBirth: "",
                              placeOfBirth: "",
                              gender: "",
                              isUSCitizen: false,
                            });
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-base">Unknown</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {!watch("isParent1Unknown") && (
              <>
                <FormField
                  control={control}
                  name="parent1.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name {"(at Parent's Birth) "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter parent 1 first name"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={35}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 35) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue("parent1.firstName", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent1.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name {"(at Parent's Birth) "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter parent 1 last name"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={35}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 35) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue("parent1.lastName", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent1.dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth (MM/DD/YYYY)
                        <span className="text-lg text-white">*</span>
                      </FormLabel>
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
                  control={control}
                  name="parent1.placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Place of Birth{" "}
                        <span className="text-lg text-white">*</span>
                        <FieldTooltip message="Please enter the place of birth of your parent. Include City & State if in the U.S. or City & Country as it is presently known." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter place of birth"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={40}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 40) {
                              const formattedName = formatName(value, {
                                allowNonConsecutiveSpaces: true,
                                specialCharacters: [".", "-"],
                              });
                              field.onChange(formattedName);
                              setValue("parent1.placeOfBirth", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent1.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sex <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-full"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value ?? ""}
                        >
                          <option value="" disabled>
                            Select sex
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          {/* <option value="unspecified">Unspecified</option> */}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent1.isUSCitizen"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 md:mt-9">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                          className="size-6"
                        />
                      </FormControl>
                      <FormLabel className="!mb-2 flex items-center gap-1">
                        Is US citizen?
                        <FieldTooltip message="Please choose whether your parent is a US citizen." />
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Parent 2 */}
            <div className="w-full flex md:flex-row flex-col md:col-span-2 items-center gap-8">
              <h2 className="font-semibold text-lg w-fit text-slate-500 my-2">
                Mother/Father/Parent Of Applicant
              </h2>
              <FormField
                control={control}
                name="isParent2Unknown"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-end gap-2">
                    <FormControl>
                      <Checkbox
                        className="size-6"
                        checked={field.value}
                        onCheckedChange={(value) => {
                          if (value) {
                            setValue("parent2", {
                              firstName: "",
                              lastName: "",
                              dateOfBirth: "",
                              placeOfBirth: "",
                              gender: "",
                              isUSCitizen: false,
                            });
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-base">Unknown</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {!watch("isParent2Unknown") && (
              <>
                <FormField
                  control={control}
                  name="parent2.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name {"(at Parent's Birth) "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter parent 2 first name"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={35}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 35) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue("parent2.firstName", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent2.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name {"(at Parent's Birth) "}
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter parent 2 last name"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={35}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 35) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue("parent2.lastName", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent2.dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth (MM/DD/YYYY)
                        <span className="text-lg text-white">*</span>
                      </FormLabel>
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
                  control={control}
                  name="parent2.placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Place of Birth{" "}
                        <span className="text-lg text-white">*</span>
                        <FieldTooltip message="Please enter the place of birth of your parent. Include City & State if in the U.S. or City & Country as it is presently known." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter place of birth"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={40}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 40) {
                              const formattedName = formatName(value, {
                                allowNonConsecutiveSpaces: true,
                                specialCharacters: [".", "-"],
                              });
                              field.onChange(formattedName);
                              setValue("parent2.placeOfBirth", formattedName);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent2.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sex <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-full"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value ?? ""}
                        >
                          <option value="" disabled>
                            Select sex
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          {/* <option value="unspecified">Unspecified</option> */}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="parent2.isUSCitizen"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 md:mt-9">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                          className="size-6"
                        />
                      </FormControl>
                      <FormLabel className="!mb-2 flex items-center gap-1">
                        Is US citizen?
                        <FieldTooltip message="Please choose whether your parent is a US citizen." />
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {/* Marriage Information */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-4">
              Current Spouse or Most Recent Spouse of Applicant
            </h2>
            <FormField
              control={control}
              name="isMarried"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mb-4">
                  <FormControl>
                    <Checkbox
                      className="size-6"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        setIsMarried(value as boolean);
                        field.onChange(value);
                        if (!value) {
                          // Reset marriage-related fields when unmarried
                          setValue("marriageDetails.spouseFirstName", "");
                          setValue("marriageDetails.spouseLastName", "");
                          setValue("marriageDetails.spouseDateOfBirth", "");
                          setValue("marriageDetails.marriageDate", "");
                          setValue("marriageDetails.spousePlaceOfBirth", "");
                          setValue("marriageDetails.spouseIsUSCitizen", false);
                          setValue(
                            "marriageDetails.isWidowedOrDivorced",
                            false
                          );
                          setValue("marriageDetails.widowOrDivorceDate", "");
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-base">
                    Has Applicant Ever Been Married?
                  </FormLabel>
                </FormItem>
              )}
            />

            {isMarried && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="marriageDetails.spouseFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First And MiddleName
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          maxLength={10}
                          placeholder="Spouse's First Name"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 10) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue(
                                "marriageDetails.spouseFirstName",
                                formattedName
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="marriageDetails.spouseLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Spouse's Last Name"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 15) {
                              const formattedName = formatName(value);
                              field.onChange(formattedName);
                              setValue(
                                "marriageDetails.spouseLastName",
                                formattedName
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="marriageDetails.spouseDateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Date of Birth (MM/DD/YYYY)
                        <span className="text-lg text-red-500">*</span>
                        <FieldTooltip message="Please enter the date of birth of applicant's spouse" />
                      </FormLabel>
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
                  control={control}
                  name="marriageDetails.marriageDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Date Of Most Recent Marriage (MM/DD/YYYY)
                        <span className="text-lg text-red-500">*</span>
                        <FieldTooltip message="Please enter the applicant's marriage date." />
                      </FormLabel>
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
                  name="marriageDetails.spousePlaceOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Place of Birth
                        <span className="text-lg text-red-500">*</span>
                        <FieldTooltip message="Please enter the place of birth of applicant's spouse" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Spouse's Place of Birth"
                          {...field}
                          value={field.value ?? ""}
                          maxLength={40}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 40) {
                              const formattedName = formatName(value, {
                                allowNonConsecutiveSpaces: true,
                              });
                              field.onChange(formattedName);
                              setValue(
                                "marriageDetails.spousePlaceOfBirth",
                                formattedName
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="marriageDetails.spouseIsUSCitizen"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          className="size-6"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is your spouse a U.S. citizen?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="marriageDetails.isWidowedOrDivorced"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          className="size-6"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none flex gap-2">
                        <FormLabel className="flex items-center gap-1">
                          Has applicant ever been widowed or divorced?
                        </FormLabel>
                        <FieldTooltip message="Please choose whether applicant has ever been divorced or widowed." />
                      </div>
                    </FormItem>
                  )}
                />

                {watch("marriageDetails.isWidowedOrDivorced") && (
                  <FormField
                    name="marriageDetails.widowOrDivorceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Widow or Divorce Date (MM/DD/YYYY)
                          <span className="text-lg text-red-500">*</span>
                          <FieldTooltip message="Enter the most recent date of divorce or death of the applicant's spouse, as applicable." />
                        </FormLabel>
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
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
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
