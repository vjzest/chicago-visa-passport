"use client";
import React, { useEffect, useState } from "react";
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
import { loginSchema } from "@/lib/form-schema";
import { useRouter } from "next/navigation";
import { useCaseStore } from "@/store/use-case-store";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { setUserData } = useCaseStore((state) => state);
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // const [otpState, setOtpState] = useState({
  //   otp: "",
  //   isVerified: false,
  //   showOtpModal: false,
  //   attempts: 0,
  // });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useRouter();
  const { setAfterAuthLink, afterAuthLink } = useAuthStore((state) => state);
  const onSubmit = async (values: LoginFormInputs) => {
    try {
      if (values?.password?.length > 100) {
        values.password = values?.password?.substring(0, 100);
      }
      const { data } = await axiosInstance.post("/user/auth/login", {
        email: values?.email,
        password: values?.password,
      });
      if (!data?.success) {
        toast.error(data?.message);
      }
      localStorage.setItem("user_token", data?.data?.token);
      const {
        email1,
        firstName,
        id,
        lastName,
        middleName,
        phone1,
        email2,
        phone2,
        dateOfBirth,
      } = data?.data?.user ?? {};
      const fullName =
        [firstName, middleName, lastName].filter(Boolean).join(" ") || "N/A";
      setUserData(
        email1,
        fullName,
        id,
        phone1,
        email2,
        phone2,
        firstName,
        middleName,
        lastName,
        dateOfBirth
      );
      localStorage.setItem("lastLoginEmail", values?.email);
      setAfterAuthLink("");

      // Smart Login: Check if user is a Passport user
      try {
        const { data: casesData } = await axiosInstance.get("/user/case");
        if (casesData?.success && casesData?.data?.length > 0) {
          const recentCase = casesData.data[0]; // Assuming sorted by createdAt desc
          const isPassportCase = recentCase?.caseInfo?.serviceType?.silentKey?.toLowerCase()?.includes("passport");

          if (isPassportCase) {
            navigate.replace("/us-passport/dashboard/my-applications");
            return;
          }
        }
      } catch (caseError) {
        console.error("Error fetching cases for redirect logic", caseError);
      }

      navigate.replace(afterAuthLink || "/dashboard/my-applications");
    } catch (error) {
      const typedError = error as { response: { data?: any } };
      toast.error(
        typedError?.response?.data?.message ||
        "An error occurred while logging in.",
        {
          position: "top-center",
        }
      );
      console.error("Login error", error);
    }
  };
  useEffect(() => {
    form.setValue("email", localStorage.getItem("lastLoginEmail") ?? "");
  }, []);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-semibold">
          To login, have your password provided by email available.
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Enter email"
                      {...field}
                      className="mt-1 block w-full rounded border border-gray-300 p-2"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        maxLength={100}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter Password"
                        {...field}
                        className="mt-1 block w-full rounded border border-gray-300 p-2 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
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
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <div className="mb-2 flex justify-end ">
              <Link href="/forgot">
                <span className="cursor-pointer text-sm text-blue-600 hover:underline">
                  Forgot password
                </span>
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-5 text-sm text-gray-600">
          For any further assistance, you can reach our support team. We are
          here to help you with any issues or questions you may have.
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
