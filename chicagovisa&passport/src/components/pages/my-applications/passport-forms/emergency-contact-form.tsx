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
import { EMERGENCY_CONTACT_STATES } from "@/lib/data";
import { camelCaseToNormalCase, formatName, validateUSZip } from "@/lib/utils";
import FieldTooltip from "./field-tooltip";
import { debounce } from "lodash";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
import { useCallback, useEffect, useState } from "react";

// Update the schema to include new fields
const EmergencyContactSchema = z
  .object({
    emergencyContactName: z
      .string()
      .min(1, "Name is required")
      .max(40, "Maximum 40 characters"),
    emergencyContactPhone: z
      .string()
      .min(1, "Phone is required")
      .max(25, "Maximum 25 digits")
      .optional(),
    emergencyContactRelationship: z
      .string()
      .min(1, "Relationship is required")
      .max(70, "Maximum 70 characters")
      .optional(),
    street: z
      .string()
      .min(1, "Street address is required")
      .max(40, "Maximum 40 characters")
      .optional(),
    apartmentOrUnit: z.string().max(40, "Maximum 40 characters").optional(),
    state: z.string().min(1, "State is required").optional(),
    city: z
      .string()
      .min(1, "City is required")
      .max(40, "Maximum 40 characters")
      .optional(),
    zipCode: z
      .string()
      .min(1, "Zipcode is required")
      .refine((value) => {
        if (value === "") return true;
        return validateUSZip(value);
      }, "Invalid Zip Code : only formats XXXXX and XXXXX-XXXX are accepted")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Check if at least one field (other than apartmentOrUnit) is filled
    const keysToCheck = [
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactRelationship",
      "street",
      "state",
      "city",
      "zipCode",
    ];

    const isAnyFieldFilled =
      //@ts-ignore
      keysToCheck.some((key) => data[key]?.trim()) || !!data.apartmentOrUnit;

    if (isAnyFieldFilled) {
      // Enforce all required fields except for `apartmentOrUnit`
      keysToCheck.forEach((key) => {
        //@ts-ignore
        if (!data[key]?.trim()) {
          //@ts-ignore
          ctx.addIssue({
            path: [key],
            message: `${camelCaseToNormalCase(key)} is required`,
          });
        }
      });
    }
  });

type EmergencyContactFormData = z.infer<typeof EmergencyContactSchema>;

type EmergencyContactFormProps = {
  goBack: () => void;
  onSubmit: (values: EmergencyContactFormData) => void;
  defaultValues?: EmergencyContactFormData; // Optional defaultValues prop
  isLoading: boolean;
};

export function EmergencyContactForm({
  goBack,
  onSubmit,
  defaultValues, // Accept the defaultValues prop
  isLoading,
}: EmergencyContactFormProps) {
  const form = useForm<EmergencyContactFormData>({
    resolver: zodResolver(EmergencyContactSchema),
    defaultValues:
      Object.keys(defaultValues || {}).length !== 0
        ? defaultValues
        : {
            emergencyContactName: "",
            emergencyContactPhone: "",
            emergencyContactRelationship: "",
            street: "",
            apartmentOrUnit: "",
            state: "",
            city: "",
            zipCode: "",
          },
  });
  const {
    emergencyContact: persistedEmergencyContact,
    setEmergencyContact: setPersistedEmergencyContact,
  } = usePassportApplicationStore((state) => state);
  const watchedFields = form.watch();
  const [initiallyFilled, setInitiallyFilled] = useState(false);

  // Debounced store update
  const updateStore = useCallback(
    debounce((data: EmergencyContactFormData) => {
      setPersistedEmergencyContact(data);
    }, 300),
    [setPersistedEmergencyContact]
  ); // Adjust debounce time as needed

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
      persistedEmergencyContact &&
      !initiallyFilled
    ) {
      form.reset(persistedEmergencyContact);
    }
    setInitiallyFilled(true);
  }, [defaultValues, form]);

  return (
    <>
      <h2 className="font-semibold text-xl text-center mb-10">
        Who should we contact in case of an emergency?
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" w-full md:w-3/4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    First & Last name{" "}
                    <span className="text-lg text-red-500">*</span>
                    <FieldTooltip
                      message="Please enter the name of a contact person who will not be
                    traveling with you."
                    />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={40}
                      placeholder="Emergency Contact Name"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 40) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("emergencyContactName", formattedName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number<span className="text-lg text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Phone Number"
                      {...field}
                      maxLength={25}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = value.replace(/\D/g, "");
                        if (numericValue.length <= 25) {
                          field.onChange(e);
                          form.setValue("emergencyContactPhone", numericValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContactRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Relationship to Applicant{" "}
                    <span className="text-lg text-red-500">*</span>
                    <FieldTooltip message="Enter the emergency contact's relationship to the applicant. For example : Father, Mother, Sister, Brother, Spouse, Friend" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Relationship"
                      {...field}
                      maxLength={70}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 20) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                          });
                          field.onChange(formattedName);
                          form.setValue(
                            "emergencyContactRelationship",
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
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Street Address/RFD# Or PO Box:{" "}
                    <span className="text-lg text-red-500">*</span>
                    <FieldTooltip message="Please enter the address where the emergency contact person lives." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={40}
                      placeholder="Street"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 40) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowNumbers: true,
                            specialCharacters: ["#", "/", "-", ",", "."],
                          });
                          field.onChange(formattedName);
                          form.setValue("street", formattedName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apartmentOrUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Apartment or Unit <span className="text-lg"></span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={40}
                      placeholder="Apartment or Unit (optional)"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 40) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowNumbers: true,
                            specialCharacters: ["#", "/", "-", ",", "."],
                          });
                          field.onChange(formattedName);
                          form.setValue("apartmentOrUnit", formattedName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Select state <span className="text-lg text-red-500">*</span>
                    <FieldTooltip message="Please choose the emergency contact's state." />
                  </FormLabel>
                  <FormControl>
                    <select
                      className="styled-select w-full"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "none" ? "" : e.target.value
                        )
                      }
                      value={field.value}
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      {EMERGENCY_CONTACT_STATES.map((state, index) => (
                        <option key={index} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    City<span className="text-lg text-red-500">*</span>
                    <FieldTooltip message="Please enter the emergency contact's city." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={40}
                      placeholder="City"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 15) {
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            specialCharacters: [".", "-"],
                          });
                          field.onChange(formattedName);
                          form.setValue("city", formattedName);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Zip Code<span className="text-lg text-red-500">*</span>
                    <FieldTooltip message="Please enter the emergency contact's zip code." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      maxLength={10}
                      placeholder="Zip Code"
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
                          form.setValue("zipCode", value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between mt-4">
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
    </>
  );
}
