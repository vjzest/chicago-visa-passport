"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useCaseStore } from "@/store/use-case-store"; // Import store to set user data if needed, or just skip for now

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const PassportLoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormInputs) => {
        try {
            // Dedicated call to Passport Backend
            const { data } = await axios.post("http://localhost:4001/api/v1/user/auth/login", {
                email: values.email,
                password: values.password,
            });

            if (!data?.success) {
                toast.error(data?.message || "Login failed");
                return;
            }

            // Success!!
            const token = data?.data?.token;
            if (token) {
                // Store in a dedicated key to avoid conflict with Visa Login (unless user wants unified, but requested separation)
                // However, existing passport dashboard pages might look for 'user_token'. 
                // User said "visa to mai chahta huu ki us-passport/login page alg ho... passport user login karke apna dashbaor open karega"
                // Assuming separation is key.
                localStorage.setItem("passport_user_token", token);

                // ALSO setting user_token might be necessary if the dashboard components reuse hooks that read 'user_token'.
                // If I set user_token, it overwrites Visa session. This is a trade-off.
                // Given the user wants "Passport User Login", it implies they are ACTING as a passport user.
                // So I will overwrite user_token too, or else the dashboard won't work without refactoring every dashboard hook.
                // I will set BOTH for safety.
                localStorage.setItem("user_token", token);
            }

            toast.success("Passport Login Successful");
            router.replace("/us-passport/dashboard/my-applications");

        } catch (error: any) {
            console.error("Passport Login Error:", error);
            const msg = error?.response?.data?.message || "An error occurred during login.";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to Passport Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Manage your US Passport Applications
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" aria-hidden="true" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Apply for a new Passport?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/us-passport/apply" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                Start Application
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassportLoginPage;
