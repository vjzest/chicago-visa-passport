import { z } from "zod";

export const ContactUsSchema = z.object({
  name: z
    .string()
    .describe("Full Name")
    .min(3, "Full Name must be at least 3 characters")
    .max(60, "Full Name must be 60 characters maximum"),
  email: z
    .string()
    .describe("Email")
    .email({ message: "Invalid Email Address" }),
  message: z
    .string()
    .describe("Message")
    .min(10, "Message must be at least 10 characters"),
});

export const ApplyFormSchema = z.object({
  toCountry: z.string().describe("Country").min(1, "Country is required"),
  visaType: z
    .string()
    .describe("Passport Type")
    .min(1, "Passport Type is required"),
  fromCountry: z.string().describe("Country").min(1, "Country is required"),
  isCitizen: z
    .boolean()
    .nullable()
    .refine((val) => val !== null, "Please select an option"),
  reason: z.string().nonempty({ message: "Reason is required" }),
  stateOfResidency: z.string().optional(),
  state: z.string().describe("state").min(1, "State is required"),
});

export const loginSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const formSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
      message: "Invalid phone number format",
    }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters" }),
});

export function generateFormSchema(fields: IDynamicFormField[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;
    const requiredMessage = `${field.title} is required.`;

    switch (field.type) {
      case "text":
      case "textarea":
        schema = z.string({ message: requiredMessage });
        break;
      case "tel":
        schema = z.string({ message: requiredMessage }).refine(
          (val) => {
            // If empty and not required, it's valid
            if (val === "" && !field.validations?.required?.value) return true;
            // If value is provided, must match length requirements
            if (
              field.validations?.minLength?.value ===
              field.validations?.maxLength?.value
            ) {
              return val.length === field?.validations?.minLength?.value;
            }
            // Otherwise check min and max separately
            return (
              val.length >= (field.validations?.minLength?.value || 0) &&
              val.length <= (field.validations?.maxLength?.value || Infinity)
            );
          },
          {
            message:
              field?.validations?.minLength?.value ===
              field?.validations?.maxLength?.value
                ? `Phone number must be ${field?.validations?.minLength?.value} digits`
                : `Phone number must be between ${field?.validations?.minLength?.value} and ${field?.validations?.maxLength?.value} digits`,
          }
        );
        break;
      case "email":
        schema = z.string({ message: requiredMessage }).refine(
          (val) => {
            if (val === "" && !field.validations?.required?.value) return true;
            return z.string().email().safeParse(val).success;
          },
          {
            message: "Invalid email address",
          }
        );
        break;
      case "number":
        schema = z.number({ message: requiredMessage });
        break;
      case "date":
        schema = z
          .string({ message: requiredMessage })
          .min(1, "Provide a valid date")
          .refine((val) => !isNaN(Date.parse(val)), {
            message: "Provide a valid date",
          });
        if (field.validations?.restrictPastDates?.value) {
          schema = schema?.refine(
            (date) => {
              const today = new Date().toISOString().split("T")[0];
              return date >= today;
            },
            {
              message:
                field.validations.restrictPastDates.message ||
                "Date cannot be in the past",
            }
          );
        }
        if (field.validations?.restrictFutureDates?.value) {
          schema = schema?.refine(
            (date) => {
              const today = new Date().toISOString().split("T")[0];
              return date <= today;
            },
            {
              message:
                field.validations.restrictFutureDates.message ||
                "Date cannot be in the future",
            }
          );
        }
        break;
      case "checkbox":
        schema = z.boolean({ message: requiredMessage });
        break;
      case "select":
        if (field.options && field.options.length > 0) {
          schema = z.enum(
            field.options.map((option) => option.value) as [
              string,
              ...string[],
            ],
            { message: requiredMessage }
          );
        } else {
          schema = z.string({ message: requiredMessage });
        }
        break;
      default:
        schema = z.any();
    }

    // Apply validations if schema is a string type
    if (field?.validations && schema instanceof z.ZodString) {
      if (field?.validations?.minLength) {
        schema = schema?.min(
          field?.validations?.minLength?.value,
          field?.validations?.minLength?.message
        );
      }
      if (field?.validations?.maxLength) {
        if (schema instanceof z.ZodString) {
          schema = schema.max(
            field?.validations?.maxLength?.value,
            field?.validations?.maxLength?.message
          );
        }
      }
      if (field?.validations?.pattern) {
        let regexPattern: RegExp;
        if (field?.validations?.pattern?.value instanceof RegExp) {
          regexPattern = field?.validations?.pattern?.value;
        } else {
          try {
            const patternStr = String(
              field?.validations?.pattern?.value
            ).replace(/^\/|\/$/g, "");
            regexPattern = new RegExp(patternStr);
          } catch (error) {
            console.error(
              `Invalid regex pattern for field ${field.key}:`,
              error
            );
            return;
          }
        }

        schema = schema.refine((value) => regexPattern.test(value), {
          message: field?.validations?.pattern?.message || "Invalid format",
        });
      }
    }

    if (field?.validations?.required?.value) {
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, `${field.title} is required`);
      } else if (schema instanceof z.ZodNumber) {
        schema = schema.refine((val) => val !== undefined && val !== null, {
          message: `${field.title} is required`,
        });
      } else if (schema instanceof z.ZodBoolean) {
        schema = schema.refine((val) => val !== undefined, {
          message: `${field.title} is required`,
        });
      }
      schemaFields[field?.key] = schema;
    } else {
      schemaFields[field?.key] = schema.optional();
    }
  });

  // Create the base schema
  let formSchema: z.ZodType<any> = z.object(schemaFields);

  // Add cross-field validation for email and phone
  formSchema = formSchema
    .refine(
      (data) => {
        // If email2 is provided, it must be different from email1
        if (data.email2 && data.email2.trim() !== "") {
          return data.email1 !== data.email2;
        }
        return true;
      },
      {
        message: "Primary and secondary email addresses cannot be the same",
        path: ["email2"], // This will show the error on the email2 field
      }
    )
    .refine(
      (data) => {
        // If phone2 is provided, it must be different from phone1
        if (data.phone2 && data.phone2.trim() !== "") {
          return data.phone1 !== data.phone2;
        }
        return true;
      },
      {
        message: "Primary and secondary phone numbers cannot be the same",
        path: ["phone2"], // This will show the error on the phone2 field
      }
    );

  return formSchema;
}
