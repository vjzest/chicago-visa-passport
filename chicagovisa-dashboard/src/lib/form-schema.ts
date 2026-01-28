import { z } from "zod";

const optionSchema = z.object({
  title: z.string().min(1, "Option title is required"),
  value: z.string().min(1, "Option value is required"),
});

export const dynamicFieldSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    key: z
      .string()
      .min(1, "Key is required")
      .refine((value) => !/\s/.test(value), {
        message: "Key should not contain spaces",
      }),
    placeholder: z.string().min(1, "Placeholder is required"),
    type: z.enum([
      "text",
      "number",
      "textarea",
      "email",
      "tel",
      "date",
      "checkbox",
      "select",
    ]),
    required: z.boolean(),
    minLength: z.string().optional(),
    maxLength: z.string().optional(),
    restrictPastDates: z.boolean(),
    restrictFutureDates: z.boolean(),
    options: z
      .array(optionSchema)
      .optional()
      .refine(
        (options) => {
          // This will allow empty options if the type is not "select"
          return true;
        },
        {
          message: "At least one option is required for select type",
        }
      ),
  })
  .refine(
    (data) => {
      if (
        data.type === "select" &&
        (!data.options || data.options.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Options are required for select type",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      const { minLength, maxLength, type } = data;
      if (["text", "textarea", "number"].includes(type)) {
        const min = minLength ? parseInt(minLength, 10) : undefined;
        const max = maxLength ? parseInt(maxLength, 10) : undefined;

        if (min !== undefined && max !== undefined) {
          return min <= max;
        }
      }
      return true;
    },
    {
      message: "minLength should be less than or equal to maxLength",
      path: ["minLength", "maxLength"],
    }
  );

export type DynamicFieldFormInputs = z.infer<typeof dynamicFieldSchema>;

export const generateFormSchema = (formFields: IDynamicFormField[]) => {
  const formSchema: { [key: string]: z.ZodString } = {};

  formFields.forEach((field) => {
    let fieldSchema = z.string();

    // Apply required validation
    if (field?.validations?.required) {
      fieldSchema = fieldSchema.min(1, field.validations.required.message);
    }

    // Apply min length validation
    if (field?.validations?.minLength) {
      fieldSchema = fieldSchema.min(
        field?.validations.minLength.value,
        field?.validations.minLength.message
      );
    }

    if (field.type === "email") {
      fieldSchema = fieldSchema.email({ message: "Invalid email address" });
    }

    formSchema[field.key] = fieldSchema;
  });

  return z.object(formSchema);
};

export const loginSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const StatusTableSchema = z.object({
  title: z.string().min(2, {
    message: "Status title must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export const ServiceTypeSchema = z.object({
  serviceType: z.string().min(2, {
    message: "Service type must be at least 2 characters.",
  }),
  shippingAddress: z.string().min(1, {
    message: "At least one shipping address is required.",
  }),
  description: z.string().optional(),
  shortHand: z.string().min(1, {
    message: "Short hand is required.",
  }),
  processingTime: z.string().min(1, {
    message: "Processing time is required.",
  }),
});
