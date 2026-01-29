"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/form-schema";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { useAdminStore } from "@/store/use-admin-store";
import { Loader2 } from "lucide-react";
import env from "@/lib/env.config";

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const { initialize, setAdmin } = useAdminStore((state) => state);

  const navigate = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const passportToken = localStorage.getItem("admin_token_passport");
    if (token || passportToken) navigate.replace("/search");
  }, []);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const loginPayload = {
        email: data.email,
        password: data.password,
      };

      // Attempt Chicago Login (direct axios call using env config)
      let chicagoRes;
      try {
        const chicagoUrl = env.BASE_URL || "http://localhost:4000/api/v1";
        chicagoRes = await axiosInstance.post(`${chicagoUrl}/admin/auth/login`, loginPayload);
        if (chicagoRes.status === 200) {
          localStorage.setItem("admin_token", chicagoRes?.data?.data?.token);
          setAdmin(chicagoRes?.data?.data?.user);
        }
      } catch (err) {
        console.error("Chicago Login failed", err);
      }

      // Attempt Passport Login (direct axios call using env config)
      let passportRes;
      try {
        const passportUrl =
          env.PASSPORT_BASE_URL || "http://localhost:4001/api/v1";
        passportRes = await axiosInstance.post(
          `${passportUrl}/admin/auth/login`,
          loginPayload
        );
        if (passportRes.status === 200) {
          localStorage.setItem(
            "admin_token_passport",
            passportRes?.data?.data?.token
          );
          if (!chicagoRes || chicagoRes.status !== 200) {
            setAdmin(passportRes?.data?.data?.user);
          }
        }
      } catch (err) {
        console.error("Passport Login failed", err);
      }

      if (
        (chicagoRes && chicagoRes.status === 200) ||
        (passportRes && passportRes.status === 200)
      ) {
        await initialize();
        navigate.replace("/search");
        toast.success("Login Successful");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "An error occurred please try after some time"
      );
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 px-6 md:w-[30%]">
      <div className="w-full max-w-md">
        <h2 className="mb-5 text-xl font-bold">Admin Login</h2>
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
                      placeholder="Enter Email"
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
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter Password"
                      {...field}
                      className="mt-1 block w-full rounded border border-gray-300 p-2"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              disabled={
                form?.formState?.isLoading || form?.formState?.isSubmitting
              }
              type="submit"
              className="w-full"
            >
              {form?.formState?.isLoading ||
                (form?.formState?.isSubmitting && (
                  <Loader2 size={"1rem"} className="animate-spin mr-2" />
                ))}
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
