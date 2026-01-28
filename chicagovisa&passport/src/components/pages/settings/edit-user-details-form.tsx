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
import React from "react";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { formatName } from "@/lib/utils";

const userSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(30, "First name must be at most 30 characters"),
    middleName: z
      .string()
      .min(3, "Middle name must be at least 3 characters")
      .max(30, "Middle name must be at most 30 characters")
      .optional(),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(30, "Last name must be at most 30 characters"),
    email1: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone1: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\+?\d+$/, "Invalid phone number"),
    email2: z
      .string()

      .email("Invalid email address")
      .optional(),
    phone2: z
      .string()
      .regex(/^\+?\d+$/, "Invalid phone number")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.email1 === data.email2) {
      ctx.addIssue({
        path: ["email2"],
        message: "Emails must be different",
        code: "custom",
      });
    }
    if (data.phone1 === data.phone2) {
      ctx.addIssue({
        path: ["phone2"],
        message: "Phone numbers must be different",
        code: "custom",
      });
    }
  });

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  profile: UserFormData;
  refetchData: () => void;
}

const EditUserDetailsForm = ({ profile, refetchData }: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: profile.firstName,
      middleName: profile.middleName,
      lastName: profile.lastName,
      email1: profile.email1,
      phone1: profile.phone1,
      email2: profile.email2,
      phone2: profile.phone2,
    },
  });

  const onSubmit = async (values: UserFormData) => {
    try {
      const { data } = await axiosInstance.put("/user/account", values);
      if (!data?.success) throw new Error(data?.message);
      toast.success("Profile updated");
      refetchData();
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    }
  };

  const isFormUnchanged = Object.keys(form.formState.dirtyFields).length === 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 flex flex-col gap-3 md:w-1/2"
      >
        <h2 className="mb-4 text-2xl font-semibold">Edit Profile</h2>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  {...field}
                  maxLength={30}
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
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your middle name"
                  {...field}
                  maxLength={30}
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
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  {...field}
                  maxLength={30}
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
          control={form.control}
          name="email1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Enter your primary phone number"
                  maxLength={10}
                  {...field}
                  value={(field.value || "").replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value.replace(/\D/g, "");
                    if (numericValue.length <= 10) {
                      field.onChange(e);
                      form.setValue("phone1", numericValue);
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
          name="phone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary phone number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your secondary phone number"
                  maxLength={10}
                  {...field}
                  value={(field.value || "").replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value.replace(/\D/g, "");
                    if (numericValue.length <= 10) {
                      field.onChange(e);
                      form.setValue("phone2", numericValue);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isFormUnchanged || form.formState.isSubmitting}
          className="self-end mt-4"
          type="submit"
        >
          Save Profile
        </Button>
      </form>
    </Form>
  );
};

export default EditUserDetailsForm;
