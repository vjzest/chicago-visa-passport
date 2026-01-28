import React, { useCallback, useEffect, useState } from "react";
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
import { formatName } from "@/lib/utils";
import { Loader2, Plus, X } from "lucide-react";
import FieldTooltip from "./field-tooltip";
import { STATES } from "@/lib/constants";
import { debounce } from "lodash";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
import { COUNTRIES } from "@/lib/utils/countries";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import { CustomDateInput } from "@/components/globals/date-text-input";

// Combine schemas
const createCombinedSchema = (countryOfBirth: string) => {
  const basePersonalInfoSchema = {
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(35, "Maximum 35 letters only allowed"),
    middleName: z.string().max(35, "Maximum 35 letters only allowed"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(35, "Maximum 35 letters only allowed"),
    suffix: z.string().max(35, "Maximum 35 characters allowed"),
    dateOfBirth: z
      .string({ message: "Date of birth is required" })
      .min(1, "Date of birth is required")
      .refine((val) => {
        const parsedDate = parseMDYDate(val);
        return !!parsedDate;
      }, "Invalid date provided")
      .refine(
        (val) => {
          const parsedDate = parseMDYDate(val)!;
          const today = getCurrentDateInDC();
          return parsedDate <= today && parsedDate >= new Date("1800-01-01");
        },
        {
          message: `Must be between 01/01/1800 and ${
            //show getCurrentDateInDC() in mm/dd/yyyy format
            getCurrentDateInDC().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
          }`,
        }
      ),
    gender: z.string().min(1, "Sex is required"),
    // changingGenderMarker: z.boolean().optional(),
    cityOfBirth: z
      .string()
      .min(1, "Birth city is required")
      .max(25, "Maximum 25 characters"),
    countryOfBirth: z.string().min(1, "Birth country is required"),
    socialSecurityNumber: z
      .string()
      .min(1, "SSN is required")
      .length(9, "9 digits required"),
    occupation: z
      .string()
      .min(1, "Enter your occupation")
      .max(30, "Maximum 30 characters"),
    employerOrSchool: z.string().max(30, "Maximum 30 characters").optional(),
  };

  const physicalDescriptionSchema = {
    height: z.object({
      feet: z.coerce
        .number()
        .min(1, "Feet is required")
        .max(10, "Feet must be less than or equal to 10"),
      inches: z.coerce
        .number()
        .min(0, "Inches is required and should be at least 0")
        .max(11, "Inches must be less than or equal to 11"),
    }),
    eyeColor: z.string().min(1, "Eye color is required"),
    hairColor: z.string().min(1, "Hair color is required"),
  };

  // Add state requirement only for USA and Canada
  if (countryOfBirth === "USA" || countryOfBirth === "CAN") {
    return z.object({
      ...basePersonalInfoSchema,
      stateOfBirth: z.string().min(1, "Birth state is required"),
      ...physicalDescriptionSchema,
    });
  }

  return z.object({
    ...basePersonalInfoSchema,
    stateOfBirth: z.string().optional(),
    ...physicalDescriptionSchema,
  });
};

type CombinedFormData = z.infer<ReturnType<typeof createCombinedSchema>> & {
  allPreviousNames: { firstName: string; lastName: string }[];
};

type CombinedFormProps = {
  onSubmit: (values: CombinedFormData) => void;
  defaultValues?: CombinedFormData;
  isLoading: boolean;
};

type Option = {
  label: string;
  value: string;
};

const eyeColorOptions = [
  "Black",
  "Brown",
  "Blue",
  "Green",
  "Hazel",
  "Gray",
  "Amber",
];

const hairColorOptions = ["Black", "Brown", "Blonde", "Red", "Gray", "Bald"];

export function PersonalInfoForm({
  onSubmit,
  defaultValues,
  isLoading,
}: CombinedFormProps) {
  const [initiallyFilled, setInitiallyFilled] = useState(false);
  const [states, setStates] = useState<Option[]>([]);
  const [countries, setCountries] = useState<Option[]>([]);
  const [countryIsoData, setCountryIsoData] = useState<Record<string, string>>(
    {}
  );
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [pastNames, setPastNames] = useState<
    { firstName: string; lastName: string }[]
  >(defaultValues?.allPreviousNames ?? []);
  const [pastFirstName, setPastFirstName] = useState("");
  const [pastLastName, setPastLastName] = useState("");

  const form = useForm<CombinedFormData>({
    resolver: zodResolver(createCombinedSchema(selectedCountry)),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      dateOfBirth: "",
      gender: "",
      // changingGenderMarker: false,
      cityOfBirth: "",
      stateOfBirth: "",
      countryOfBirth: "",
      socialSecurityNumber: "",
      occupation: "",
      employerOrSchool: "",
      height: { feet: 0, inches: 0 },
      eyeColor: "",
      hairColor: "",
      ...defaultValues,
    },
  });

  const { control, handleSubmit, setValue, watch } = form;
  const watchedCountry = watch("countryOfBirth");
  const watchedFields = form.watch();

  const {
    personalInfo: persistedPersonalInfo,
    setPersonalInfo: setPersistedPersonalInfo,
  } = usePassportApplicationStore((state) => state);

  // Debounced store update
  const updateStore = useCallback(
    debounce((data: CombinedFormData) => {
      const { height, eyeColor, hairColor, ...personalInfo } = data;
      setPersistedPersonalInfo(personalInfo);
    }, 300),
    [setPersistedPersonalInfo]
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
      !defaultValues ||
      (Object.keys(defaultValues).length <= 1 &&
        persistedPersonalInfo &&
        !initiallyFilled)
    ) {
      form.reset({
        ...persistedPersonalInfo,
      });
    }
    setInitiallyFilled(true);
  }, [defaultValues, form, persistedPersonalInfo]);

  const fetchCountries = async () => {
    try {
      setCountriesLoading(true);

      const isoObj: Record<string, string> = {};
      const countryArr: Option[] = COUNTRIES?.map(
        (country: { name: string; iso3: string }) => {
          isoObj[country.iso3] = country.iso3;
          return {
            label: country.name,
            value: country.iso3,
          };
        }
      );
      setCountryIsoData(isoObj);
      setCountries(countryArr);
      return isoObj;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return {};
    } finally {
      setCountriesLoading(false);
    }
  };

  const fetchStates = async (countryISO: string) => {
    try {
      setStatesLoading(true);
      setStates(STATES[countryISO]);
      return STATES[countryISO];
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    } finally {
      setStatesLoading(false);
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      const isoObj = await fetchCountries();

      if (defaultValues?.countryOfBirth) {
        setSelectedCountry(isoObj[defaultValues.countryOfBirth]);

        if (
          defaultValues.countryOfBirth === "USA" ||
          defaultValues.countryOfBirth === "CAN"
        ) {
          const statesData = await fetchStates(
            isoObj[defaultValues.countryOfBirth]
          );
          if (defaultValues?.stateOfBirth) {
            const state = statesData.find(
              (s) => s.value === defaultValues.stateOfBirth
            );
            if (state) {
              setValue("stateOfBirth", state.value);
            }
          }
        }
      }

      if (defaultValues) {
        Object.entries(defaultValues).forEach(([key, value]) => {
          setValue(key as keyof CombinedFormData, value);
        });
      }

      setIsInitialized(true);
    };

    initializeForm();
  }, [defaultValues, setValue]);

  useEffect(() => {
    if (isInitialized && selectedCountry) {
      if (watchedCountry === "USA" || watchedCountry === "CAN") {
        fetchStates(selectedCountry);
      } else {
        setStates([]);
        setValue("stateOfBirth", "");
      }
    }
  }, [selectedCountry, isInitialized, setValue, watchedCountry]);

  const isStateRequired = watchedCountry === "USA" || watchedCountry === "CAN";

  return (
    <div className="flex w-full flex-col items-center justify-center md:min-h-[80vh] md:w-3/4">
      <h2 className="mb-10 text-xl font-semibold">About the applicant</h2>
      <Form {...form}>
        <form
          onSubmit={handleSubmit((values) => {
            onSubmit({
              ...values,
              allPreviousNames: pastNames,
            });
          })}
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={35}
                      placeholder="Enter your first name"
                      {...field}
                      onChange={(e) => {
                        const formattedName = formatName(e.target.value);
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
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={35}
                      placeholder="Enter your middle name"
                      {...field}
                      onChange={(e) => {
                        const formattedName = formatName(e.target.value);
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={35}
                      placeholder="Enter your last name"
                      {...field}
                      onChange={(e) => {
                        const formattedName = formatName(e.target.value);
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
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Suffix <span className="text-lg text-white">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      maxLength={35}
                      placeholder="Enter suffix"
                      className="uppercase w-[50%]"
                      {...field}
                      onChange={(e) => {
                        const formattedName = formatName(e.target.value);
                        field.onChange(formattedName);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 bg-slate-100 p-4 grid grid-cols-2 items-center gap-3 rounded-sm ">
              <FormField
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of Birth (MM/DD/YYYY)
                      <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <CustomDateInput
                        className="uppercase"
                        // type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="cityOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-1">
                        City of birth{" "}
                        <span className="text-lg text-red-500">*</span>
                        <FieldTooltip message="Enter your city of birth" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        maxLength={25}
                        placeholder="Enter city"
                        {...field}
                        onChange={(e) => {
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
                name="countryOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-1">
                        Country of Birth{" "}
                        <span className="text-lg text-red-500">*</span>
                        {countriesLoading && (
                          <Loader2 className="size-4 animate-spin text-sky-500" />
                        )}
                        <FieldTooltip message="Please choose the country of your birth." />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <select
                        className="styled-select w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          setSelectedCountry(countryIsoData[value]);
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

              {isStateRequired && (
                <FormField
                  control={control}
                  name="stateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-1 hello123">
                          State/Territory of Birth{" "}
                          <span className="text-lg text-red-500">*</span>
                          {statesLoading && (
                            <Loader2 className="size-4 animate-spin text-sky-500" />
                          )}
                          <FieldTooltip message="Please select the state/territory of your birth." />
                        </div>
                      </FormLabel>
                      <FormControl>
                        <select
                          className="styled-select"
                          disabled={!selectedCountry}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        >
                          <option value="" disabled>
                            Select state
                          </option>
                          {states.map((state) => (
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
                name="socialSecurityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Social Security Number{" "}
                      <span className="text-lg text-red-500">*</span>
                      <FieldTooltip message="Enter your social security number using (XXX-XX-XXXX) format. Section 6039E of the Internal Revenue Code (26 U.S.C. 6039E) requires you to provide your Social Security number (SSN), if you have one, when you apply for or renew a U.S. passport. If you have not been issued a SSN, enter zeros." />
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder="Enter SSN"
                        maxLength={11}
                        {...field}
                        value={field.value.replace(
                          /(\d{3})(\d{2})(\d{4})/,
                          "$1-$2-$3"
                        )}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 9) {
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="flex items-center gap-1">
                      Sex <span className="text-lg text-red-500">*</span>
                    </FormLabel>
                    {/* <FieldTooltip message="The gender markers used are: M (male), F (female), and X (unspecified or another gender identity). The gender marker that you check on this form will appear in your passport regardless of the gender marker(s) on your previous passport and/or your supporting evidence of citizenship and identity." /> */}
                  </div>
                  <FormControl>
                    <select
                      className="styled-select"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
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

            {/* <FormField
              control={control}
              name="changingGenderMarker"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <div className="flex items-center gap-2 md:mt-9">
                    <FormLabel className="flex items-center gap-1">
                      Changing Gender Marker?{" "}
                    </FormLabel>
                    <FieldTooltip message="If changing your gender marker from what was printed on your previous passport, select 'Yes'." />
                  </div>
                  <FormControl className="md:!mt-9">
                    <Checkbox
                      className="size-6"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex-flex-col">
              <span className="font-medium">
                Height <span className="text-lg text-red-500">*</span>
              </span>
              <div className="grid grid-cols-2">
                <FormField
                  control={control}
                  name="height.feet"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Feet:</FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-[5rem]"
                          defaultValue="0"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={String(field.value)}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="height.inches"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Inches :</FormLabel>
                      <FormControl>
                        <select
                          className="styled-select w-[5rem]"
                          defaultValue={"0"}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={String(field.value)}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors?.height && (
                <>
                  <p className="text-red-500 font-medium">
                    {form.formState.errors?.height?.feet?.message ?? ""}
                  </p>
                  <p className="text-red-500 font-medium">
                    {form.formState.errors?.height?.inches?.message ?? ""}
                  </p>
                </>
              )}
            </div>

            <FormField
              control={control}
              name="eyeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Eye Color <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      className="styled-select w-[50%]"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {eyeColorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="hairColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hair Color <span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      className="styled-select w-[50%]"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {hairColorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Occupation<span className="text-lg text-red-500">*</span>{" "}
                    <FieldTooltip message="Occupation is mandatory for adults and must be completed as descriptively as possible if a title alone will not make it clear. If you are not employed, state so in the occupation field. If you are self-employed, the type of work you perform should be completed in occupation and 'self-employed' in employer. Children should enter 'student' or 'child' in the occupation field." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Enter your occupation"
                      {...field}
                      maxLength={30}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 35) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowNumbers: true,
                            allowUppercaseInBetween: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("occupation", formattedName);
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
              name="employerOrSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Employer or School
                    <FieldTooltip message="Enter the name of the company where you work or the name of your school if you are a student. This field is optional and so you may choose not to enter any information." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Enter your employer or school"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowNumbers: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("employerOrSchool", formattedName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-4 flex flex-col gap-1">
            <span className="text-base font-semibold">
              List all previous names you have used
            </span>
            <div className="my-2 flex flex-col gap-2">
              {pastNames.map((name, index) => {
                return (
                  <span
                    key={index}
                    className="flex items-center gap-2 text-base font-medium uppercase text-primary"
                  >
                    <X
                      onClick={() => {
                        setPastNames((prevNames) =>
                          prevNames.filter((_, i) => i !== index)
                        );
                      }}
                      className="cursor-pointer text-red-500"
                      size={"1.5rem"}
                    />
                    <span>{index + 1}.</span>
                    <span>{name.firstName}</span>
                    <span>{name.lastName}</span>
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Input
                className="uppercase"
                placeholder="First Name"
                onChange={(e) => {
                  const formattedName = formatName(e.target.value);
                  setPastFirstName(formattedName);
                }}
                value={pastFirstName}
              />
              <Input
                className="uppercase"
                placeholder="Last Name"
                onChange={(e) => {
                  const formattedName = formatName(e.target.value);
                  setPastLastName(formattedName);
                }}
                value={pastLastName}
              />
              <Button
                className="w-fit md:px-2"
                onClick={(e) => {
                  if (pastFirstName && pastLastName) {
                    setPastNames((prevNames) => [
                      ...prevNames,
                      {
                        firstName: pastFirstName,
                        lastName: pastLastName,
                      },
                    ]);
                    setPastFirstName("");
                    setPastLastName("");
                  }
                }}
                disabled={!pastFirstName || !pastLastName}
              >
                <Plus size={"1.5rem"} />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex w-full justify-end">
            <Button type="submit" disabled={isLoading || countriesLoading}>
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
