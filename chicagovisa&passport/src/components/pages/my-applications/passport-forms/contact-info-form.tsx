import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatName, validateCanadianZip, validateUSZip } from "@/lib/utils";
import FieldTooltip from "./field-tooltip";
import { STATES } from "@/lib/constants";
import { debounce } from "lodash";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
import { MAILING_COUNTRIES } from "@/lib/utils/countries";

const createAddressSchema = (country: string, forPermanentAddress: boolean) => {
  if (forPermanentAddress) {
    const baseSchema = {
      line1: z.string().max(40, "Maximum 40 characters"),
      line2: z.string().max(40, "Maximum 40 characters").optional(),
      city: z.string().max(15, "Maximum 15 characters").optional(),
      zipCode: z.string().max(10, "Maximum 10 digits").optional(),
      country: z.string().optional(),
    };

    return z.object({
      ...baseSchema,
      state: z.string().optional(),
    });
  } else {
    const baseSchema = {
      line1: z
        .string()
        .min(1, "Address is required")
        .max(40, "Maximum 40 digits"),
      line2: z.string().max(40, "Maximum 40 digits").optional(),
      inCareOf: z.string().max(50, "Maximum 50 digits").optional(),
      city: z.string().min(1, "City is required").max(15, "Maximum 15 digits"),
      zipCode: z.string(),
      // .min(1, "Zip Code is required")
      // .max(10, "Maximum 10 digits"),
      country: z.string().min(1, "Country is required"),
    };

    return z.object({
      ...baseSchema,
      state: z.string().optional(),
    });
  }
};

const CombinedFormSchema = z
  .object({
    mailing: createAddressSchema("", false),
    permanent: createAddressSchema("", true).optional(),
    sameAsMailing: z.boolean(),
    emailAddress: z
      .string()
      .max(50, "Maximum 50 characters")
      .email("Invalid email address")
      .min(1, "Email is required"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .max(22, "Maximum 22 digits"),
    phoneNumberType: z.enum(["home", "cell", "work"]),
    additionalPhoneNumbers: z
      .array(
        z.object({
          phone: z
            .string()
            .regex(/^\d+$/, "Phone number must contain only digits")
            .max(22, "Maximum 22 digits"),
          type: z.enum(["work", "home", "cell"]),
        })
      )
      .optional(),
    preferredCommunication: z.enum(["mail", "email", "both"]),
  })
  .superRefine((data, ctx) => {
    if (data.mailing?.country === "USA" || data.mailing?.country === "CAN") {
      if (!data.mailing?.state) {
        ctx.addIssue({
          path: ["mailing.state"],
          code: z.ZodIssueCode.custom,
          message: "State is required",
        });
      }
      if (!data.mailing?.zipCode) {
        ctx.addIssue({
          path: ["mailing.zipCode"],
          code: z.ZodIssueCode.custom,
          message: "Zip code is required",
        });
      }
      if (data?.mailing?.country === "USA") {
        if (!validateUSZip(data.mailing?.zipCode ?? "")) {
          ctx.addIssue({
            path: ["mailing.zipCode"],
            code: z.ZodIssueCode.custom,
            message:
              "Invalid Zip Code : only formats XXXXX and XXXXX-XXXX are accepted",
          });
        }
      } else {
        if (!validateCanadianZip(data.mailing?.zipCode ?? "")) {
          ctx.addIssue({
            path: ["mailing.zipCode"],
            code: z.ZodIssueCode.custom,
            message: "Invalid Zip Code : must be XXX XXX or XXXXX format",
          });
        }
      }
    }
    if (!data.sameAsMailing) {
      if (!data.permanent?.line1) {
        ctx.addIssue({
          path: ["permanent.line1"],
          code: z.ZodIssueCode.custom,
          message: "Address is required",
        });
      }
      if (!data.permanent?.city) {
        ctx.addIssue({
          path: ["permanent.city"],
          code: z.ZodIssueCode.custom,
          message: "City is required",
        });
      }
      if (!data.permanent?.zipCode) {
        ctx.addIssue({
          path: ["permanent.zipCode"],
          code: z.ZodIssueCode.custom,
          message: "Zip Code is required",
        });
      }
      if (!data.permanent?.country) {
        ctx.addIssue({
          path: ["permanent.country"],
          code: z.ZodIssueCode.custom,
          message: "Country is required",
        });
      }
      if (
        data.permanent?.country === "USA" ||
        data.permanent?.country === "CAN"
      ) {
        if (!data.permanent?.state) {
          ctx.addIssue({
            path: ["permanent.state"],
            code: z.ZodIssueCode.custom,
            message: "State is required",
          });
        }
        if (!data.permanent?.zipCode) {
          ctx.addIssue({
            path: ["permanent.zipCode"],
            code: z.ZodIssueCode.custom,
            message: "Zip code is required",
          });
        }
        if (data?.permanent?.country === "USA") {
          if (!validateUSZip(data.permanent?.zipCode ?? "")) {
            ctx.addIssue({
              path: ["permanent.zipCode"],
              code: z.ZodIssueCode.custom,
              message:
                "Invalid Zip Code : only formats XXXXX and XXXXX-XXXX are accepted",
            });
          }
        } else {
          if (!validateCanadianZip(data.permanent?.zipCode ?? "")) {
            ctx.addIssue({
              path: ["permanent.zipCode"],
              code: z.ZodIssueCode.custom,
              message: "Invalid Zip Code : must be XXX XXX or XXXXX format",
            });
          }
        }
      }
    }
  });

type CombinedFormData = z.infer<typeof CombinedFormSchema>;

type CombinedFormProps = {
  goBack: () => void;
  onSubmit: (values: CombinedFormData) => void;
  defaultValues?: Partial<CombinedFormData>;
  isLoading: boolean;
};

const AdditionalPhoneSection = ({
  numbers,
  addNumber,
  deleteNumber,
}: {
  numbers: { phone: string; type: string }[];
  addNumber: (data: { phone: string; type: "home" | "work" | "cell" }) => void;
  deleteNumber: (index: number) => void;
}) => {
  const [additionalPhone, setAdditionalPhone] = useState<string>("");
  const [additionalPhoneType, setAdditionalPhoneType] = useState<
    "home" | "cell" | "work" | ""
  >("");
  const [additionalPhoneError, setAdditionalPhoneError] = useState<string>("");
  return (
    <>
      <div className="flex flex-col gap-2">
        {numbers.map((elem, i) => (
          <div key={elem.phone} className="flex gap-6 items-center text-base">
            <span className="">
              <span className="text-slate-600 font-bold">{i + 1}.</span>{" "}
              {elem.phone}
            </span>
            <span className="font-medium uppercase text-slate-500">
              {elem.type}
            </span>
            <button
              type="button"
              onClick={() => deleteNumber(i)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>{" "}
      {numbers?.length < 2 && (
        <div className="flex md:flex-row flex-wrap gap-2 md:gap-6 items-center col-span-1 md:col-span-2">
          <div className="flex flex-col min-w-40 gap-2">
            <FormLabel className="font-medium" htmlFor="">
              Phone number and type
            </FormLabel>
            <Input
              className="uppercase"
              value={additionalPhone}
              onChange={(e) => {
                if (additionalPhoneError) setAdditionalPhoneError("");
                if (
                  !isNaN(Number(e.target.value)) &&
                  e.target.value.length <= 22
                ) {
                  setAdditionalPhone(e.target.value.trim());
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="hello" className="invisible">
              ----
            </label>
            <RadioGroup
              onValueChange={(value: "home" | "cell" | "work") => {
                if (additionalPhoneError) setAdditionalPhoneError("");

                setAdditionalPhoneType(value);
              }}
              value={additionalPhoneType}
              className="flex gap-4 "
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="home" />
                </FormControl>
                <FormLabel className="">Home</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="cell" />
                </FormControl>
                <FormLabel className="">Cell</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="work" />
                </FormControl>
                <FormLabel className="">Work</FormLabel>
              </FormItem>
            </RadioGroup>
          </div>
          <Button
            type="button"
            size={"sm"}
            onClick={() => {
              if (!additionalPhone)
                return setAdditionalPhoneError("Phone number is required");
              if (!additionalPhoneType)
                return setAdditionalPhoneError(
                  "Please select phone number type"
                );
              if (numbers.length >= 2) return;
              addNumber({
                phone: additionalPhone,
                type: additionalPhoneType,
              });
              setAdditionalPhone("");
              setAdditionalPhoneType("");
            }}
            className="bg-green-600 mt-4"
          >
            Add
          </Button>
        </div>
      )}
      {additionalPhoneError && (
        <span className="text-red-500">{additionalPhoneError}</span>
      )}
    </>
  );
};

export function ContactInfoForm({
  goBack,
  onSubmit,
  defaultValues,
  isLoading,
}: CombinedFormProps) {
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [mailingStates, setMailingStates] = useState<
    { label: string; value: string }[]
  >([]);
  const [permanentStates, setPermanentStates] = useState<
    { label: string; value: string }[]
  >([]);
  const [countryIsoData, setCountryIsoData] = useState<Record<string, string>>(
    {}
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const form = useForm<CombinedFormData>({
    resolver: zodResolver(CombinedFormSchema),
    defaultValues: {
      mailing: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        inCareOf: "",
      },
      permanent: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      sameAsMailing: true,
      emailAddress: "",
      phoneNumber: "",
      phoneNumberType: "home",
      additionalPhoneNumbers: [],
      preferredCommunication: "mail",
      ...defaultValues,
    },
  });

  const { control, handleSubmit, watch } = form;
  const watchedFields = form.watch();
  const watchedMailingCountry = watch("mailing.country");
  const watchedPermanentCountry = watch("permanent.country");
  const watchedSameAsMailing = watch("sameAsMailing");

  const { setContactInfo } = usePassportApplicationStore();

  const updateStore = useCallback(
    debounce((data: CombinedFormData) => {
      setContactInfo(form.getValues());
    }, 300),
    [setContactInfo]
  );

  useEffect(() => {
    updateStore(watchedFields);
  }, [JSON.stringify(watchedFields)]);

  useEffect(() => {
    return () => {
      updateStore.cancel();
    };
  }, []);

  const fetchCountries = async () => {
    try {
      const isoObj: Record<string, string> = {};
      const countryArr = MAILING_COUNTRIES.map(
        (country: { name: string; iso3: string }) => {
          isoObj[country.iso3] = country.iso3;
          return { label: country.name, value: country.iso3 };
        }
      );
      setCountryIsoData(isoObj);
      setCountries(countryArr);
      return isoObj;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return {};
    }
  };
  console.log("values", form.getValues());

  const fetchStates = (countryISO: string) => {
    try {
      return STATES[countryISO] || [];
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      await fetchCountries();
      setIsInitialized(true);
    };
    initializeForm();
  }, []);
  useEffect(() => {
    if (isInitialized && watchedMailingCountry) {
      const states = fetchStates(countryIsoData[watchedMailingCountry]);
      setMailingStates(states ?? []);
    }
  }, [watchedMailingCountry, isInitialized, countryIsoData]);

  useEffect(() => {
    if (isInitialized && watchedPermanentCountry) {
      const states = fetchStates(countryIsoData[watchedPermanentCountry]);
      setPermanentStates(states ?? []);
    }
  }, [watchedPermanentCountry, isInitialized, countryIsoData]);

  useEffect(() => {
    if (isInitialized) {
      if (watchedSameAsMailing) {
        const mailingAddress = form.getValues("mailing");
        form.setValue("permanent", mailingAddress);
      } else {
        form.setValue("permanent", {
          line1: "",
          line2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
      }
    }
  }, [watchedSameAsMailing, form]);

  const isMailingStateRequired =
    watchedMailingCountry === "USA" || watchedMailingCountry === "CAN";
  const isPermanentStateRequired =
    watchedPermanentCountry === "USA" || watchedPermanentCountry === "CAN";

  return (
    <div className="flex w-full md:w-3/4 flex-col items-center justify-center md:min-h-[80vh]">
      <h2 className="mb-10 text-xl font-semibold">
        Address and Contact Information
      </h2>
      <Form {...form}>
        <form
          onSubmit={handleSubmit((values) =>
            onSubmit({
              ...values,
              permanent: values.sameAsMailing
                ? values.mailing
                : values.permanent,
            })
          )}
          className="space-y-8 w-full"
        >
          <div>
            <h3 className="text-lg font-medium mb-4">Mailing Address</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="mailing.line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Line 1 (Street/RFD# or URB)
                      <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Address line 1"
                        {...field}
                        onChange={(e) => {
                          const formattedName = formatName(e.target.value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowNumbers: true,
                            specialCharacters: ["#", "/", "-", ",", "."],
                          });
                          field.onChange(formattedName.slice(0, 40));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="mailing.line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Line 2 (Apartment, suite etc.)
                      <FieldTooltip message="Please enter in the apartment, suite, floor, number, etc. if applicable." />
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Address line 2"
                        {...field}
                        onChange={(e) => {
                          const formattedName = formatName(e.target.value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            allowNumbers: true,
                            specialCharacters: ["#", "/", "-", ",", "."],
                          });
                          field.onChange(formattedName.slice(0, 40));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="mailing.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Enter city"
                        {...field}
                        maxLength={35}
                        onChange={(e) => {
                          if (e.target.value.length > 15) return;
                          const formattedName = formatName(e.target.value, {
                            specialCharacters: [".", "-"],
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
                control={control}
                name="mailing.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        className="styled-select w-full"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue("mailing.state", "");
                        }}
                        value={field.value}
                      >
                        <option value="" disabled>
                          Select country
                        </option>
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isMailingStateRequired && (
                <FormField
                  control={control}
                  name="mailing.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-full"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        >
                          <option value="">Select state</option>
                          {mailingStates.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={control}
                name="mailing.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Zip Code{" "}
                      {(watchedMailingCountry === "USA" ||
                        watchedMailingCountry === "CAN") && (
                        <span className="text-lg text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        maxLength={10}
                        className="uppercase"
                        placeholder="Enter zip code"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          value = value.replace(/\s{2,}/g, " ");
                          value = value.replace(/-+/g, "-");
                          if (value.length === 10) {
                            value = value.trim();
                          } else {
                            value = value.trimStart();
                          }
                          if (value.length <= 10) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="mailing.inCareOf"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="flex items-center gap-1">
                    In Care Of
                    <FieldTooltip message="Include 'In Care Of' or 'Attention' if the person you want to receive the passport is not the same as the person applying. If you are applying for your child under 16, include your name or the child's other parent or guardian in this field." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Enter name of Parent or Guardian"
                      {...field}
                      onChange={(e) => {
                        const formattedName = formatName(e.target.value, {
                          allowNonConsecutiveSpaces: true,
                          allowUppercaseInBetween: true,
                        });
                        field.onChange(formattedName.slice(0, 50));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Permanent Address</h3>
            <div className="mb-4">
              <FormField
                control={control}
                name="sameAsMailing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        className="size-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Permanent address is same as my mailing address
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {!watchedSameAsMailing && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={control}
                  name="permanent.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Line 1 (Street/RFD# or URB)
                        <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Address line 1"
                          {...field}
                          onChange={(e) => {
                            const formattedName = formatName(e.target.value, {
                              allowNonConsecutiveSpaces: true,
                              allowUppercaseInBetween: true,
                              allowNumbers: true,
                              specialCharacters: ["#", "/", "-", ",", "."],
                            });
                            field.onChange(formattedName.slice(0, 40));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="permanent.line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Line 2 (Apartment, suite etc.)
                        <FieldTooltip message="Please enter in the apartment, suite, floor, number, etc. if applicable." />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Address line 2"
                          {...field}
                          onChange={(e) => {
                            const formattedName = formatName(e.target.value, {
                              allowNonConsecutiveSpaces: true,
                              allowUppercaseInBetween: true,
                              allowNumbers: true,
                              specialCharacters: ["#", "/", "-", ",", "."],
                            });
                            field.onChange(formattedName.slice(0, 40));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="permanent.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="Enter city"
                          {...field}
                          maxLength={15}
                          onChange={(e) => {
                            if (e.target.value.length > 15) return;
                            const formattedName = formatName(e.target.value, {
                              specialCharacters: [".", "-"],
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
                  control={control}
                  name="permanent.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span className="text-lg text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-full"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            form.setValue("permanent.state", "");
                          }}
                          value={field.value}
                        >
                          <option value="" disabled>
                            Select country
                          </option>
                          {countries.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isPermanentStateRequired && (
                  <FormField
                    control={control}
                    name="permanent.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          State <span className="text-lg text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            className="styled-select w-full"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          >
                            <option value="">Select state</option>
                            {permanentStates.map((state) => (
                              <option key={state.value} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={control}
                  name="permanent.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Zip Code{" "}
                        {(watchedPermanentCountry === "USA" ||
                          watchedPermanentCountry === "CAN") && (
                          <span className="text-lg text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          maxLength={10}
                          className="uppercase"
                          placeholder="Enter zip code"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/\s{2,}/g, " ");
                            value = value.replace(/-+/g, "-");
                            if (value.length === 10) {
                              value = value.trim();
                            } else {
                              value = value.trimStart();
                            }
                            if (value.length <= 10) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address
                      <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Email Address"
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number{" "}
                      <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Phone Number"
                        {...field}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          if (numericValue.length <= 22) {
                            field.onChange(numericValue);
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
                name="phoneNumberType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Phone Number</FormLabel>
                    <FormControl>
                      <select
                        className="styled-select w-full"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                      >
                        <option value="" disabled>
                          Select phone type
                        </option>
                        <option value="home">Home</option>
                        <option value="cell">Cell</option>
                        <option value="work">Work</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3 className="text-base col-span-1 md:col-span-2 font-medium md:mb-4">
                Additional Phone Numbers
              </h3>
              <AdditionalPhoneSection
                numbers={form.getValues("additionalPhoneNumbers") || []}
                deleteNumber={(index: number) => {
                  const additionalPhoneNumbers =
                    form.getValues("additionalPhoneNumbers") || [];
                  additionalPhoneNumbers.splice(index, 1);
                  form.setValue(
                    "additionalPhoneNumbers",
                    additionalPhoneNumbers
                  );
                }}
                addNumber={(data) =>
                  form.setValue("additionalPhoneNumbers", [
                    ...(form.getValues("additionalPhoneNumbers") || []),
                    data,
                  ])
                }
              />
            </div>
          </div>

          <FormField
            control={control}
            name="preferredCommunication"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Preferred Method of Communication</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex  items-center gap-8 space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mail" />
                      </FormControl>
                      <FormLabel className="font-normal">Mail</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="email" />
                      </FormControl>
                      <FormLabel className="font-normal">Email</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="both" />
                      </FormControl>
                      <FormLabel className="font-normal">Both</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
