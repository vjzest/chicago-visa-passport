"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
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
import ForgotOtpDialog from "./forgot-otp";
import NewPasswordComponent from "./new-password";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const form = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [otpState, setOtpState] = useState({
    otp: "",
    showOtpModal: false,
    attempts: 0,
    isVerified: false,
    email: "",
  });

  const onSubmit = async (values: ForgotPasswordFormInputs) => {
    try {
      const response = await axiosInstance.post(`/user/auth/send-otp/`, {
        email: values.email,
      });
      if (response.status === 200) {
        toast.success("Password reset otp sent to your email.", {
          position: "top-center",
        });
        setOtpState((prev) => ({
          ...prev,
          showOtpModal: true,
          email: values?.email,
        }));
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
      console.error("Forgot password error", error);
    }
  };

  return (
    <>
      {otpState?.isVerified ? (
        <>
          <NewPasswordComponent otpState={otpState} />
        </>
      ) : (
        <div className="flex h-[85%] items-center justify-center p-4">
          <div className="size-full max-w-md rounded p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">Forgot Password</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-1/2 flex-col justify-center space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          {...field}
                          className="mt-1 block w-full rounded border border-gray-300 p-2"
                        />
                      </FormControl>
                      <FormMessage>
                        {form?.formState?.errors?.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full py-2"
                  disabled={form.formState.isSubmitting}
                >
                  Send OTP
                </Button>
                <div className="flex justify-center">
                  <Link href="/login">
                    <span className="cursor-pointer text-sm text-blue-600 hover:underline">
                      Back to Login
                    </span>
                  </Link>
                </div>
              </form>
            </Form>
            <div className="mt-5 text-sm text-gray-600">
              For any further assistance, you can reach our support team. We are
              here to help you with any issues or questions you may have.
            </div>
          </div>
          {otpState?.showOtpModal && (
            <ForgotOtpDialog
              open={otpState.showOtpModal}
              otpState={otpState}
              setOtpState={setOtpState}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ForgotPasswordForm;
