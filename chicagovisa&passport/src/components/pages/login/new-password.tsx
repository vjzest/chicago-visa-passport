"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/config/axios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
        return regex.test(val);
      }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordFormInputs = z.infer<typeof newPasswordSchema>;
type pageProps = {
  otpState: any;
};

const NewPasswordComponent: React.FC<pageProps> = ({ otpState }) => {
  const form = useForm<NewPasswordFormInputs>({
    resolver: zodResolver(newPasswordSchema),
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (values: NewPasswordFormInputs) => {
    try {
      const response = await axiosInstance.post(`/user/auth/new-password/`, {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        email: otpState?.email,
      });
      if (response.status === 201) {
        toast.success(
          response?.data?.data?.message ||
            "Your password successfully updated and sent to your mail"
        );
        router.replace("/login");
      }
    } catch (error) {
      const typedError = error as { response: { data?: any } };
      toast.error(
        typedError?.response?.data?.message ||
          "An error occurred while processing your request.",
        {
          position: "top-center",
        }
      );
      console.error("while setting new password", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="size-full max-w-md rounded p-6 shadow">
        <h2 className="mb-5 py-3 text-xl font-semibold">New Password</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-1/2 flex-col justify-center space-y-4"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="Enter your new password"
                        {...field}
                        className="mt-1 block w-full rounded border border-gray-300 p-2 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>
                    {form?.formState?.errors?.newPassword?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        {...field}
                        className="mt-1 block w-full rounded border border-gray-300 p-2 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>
                    {form?.formState?.errors?.confirmPassword?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 mb-4"
              disabled={form.formState.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-sm text-gray-600">
          For any further assistance, you can reach our support team. We are
          here to help you with any issues or questions you may have.
        </div>
      </div>
    </div>
  );
};

export default NewPasswordComponent;
