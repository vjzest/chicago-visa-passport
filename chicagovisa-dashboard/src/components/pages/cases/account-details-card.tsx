import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react"; // Import EyeOff icon
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEmailForm } from "./change-email-form";

// Zod schema for password validation
const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type for form inputs
type NewPasswordFormInputs = z.infer<typeof newPasswordSchema>;

const AccountDetailsCard = ({ caseDetails, fetchCasedetails }: any) => {
  const [showUserKey, setShowUserKey] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const toggleUserKeyVisibility = () => {
    setShowUserKey(!showUserKey);
  };

  // Function to mask the user key
  const maskUserKey = (key: any) => {
    return key ? "*".repeat(key.length) : "N/A";
  };

  // React Hook Form setup
  const form = useForm<NewPasswordFormInputs>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Password reset submission handler
  const onSubmit = async (values: NewPasswordFormInputs) => {
    try {
      const response = await axiosInstance.post(`/user/auth/new-password/`, {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        email: caseDetails?.account?.email1,
      });
      if (response.status === 201) {
        toast.success(
          response?.data?.data?.message ||
            "Your password was successfully updated and sent to your email"
        );
        setIsModalOpen(false);
        fetchCasedetails();

        // router.replace("/login");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while processing your request.",
        {
          position: "top-center",
        }
      );
      console.error("Error while setting new password", error);
    }
  };

  return (
    <Card className="p-2 space-y-2 my-3">
      <CardContent>
        <h1 className="py-2 text-lg font-semibold">Account Details</h1>
        <div className="py-2 space-y-2">
          <div className="flex items-center">
            <div className="w-24 font-medium">Email</div>
            <div>{caseDetails?.account?.email1 || "N/A"}</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">Password</div>
            <div className="flex items-center">
              <span className="mr-2">
                {showUserKey
                  ? caseDetails?.account?.userKey || "N/A"
                  : maskUserKey(caseDetails?.account?.userKey)}
              </span>
              {caseDetails?.account?.userKey && (
                <button
                  onClick={toggleUserKeyVisibility}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Dialog
            open={isModalOpen}
            onOpenChange={(bool) => {
              if (!bool) form.reset();
              setIsModalOpen(!!bool);
            }}
          >
            <DialogTrigger asChild>
              <Button size={"sm"} variant={"outline"} className="mt-2">
                Reset Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 w-[80vw] md:w-[25vw]"
                >
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              maxLength={20}
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              maxLength={20}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <ChangeEmailForm
            refreshData={fetchCasedetails}
            oldEmail={caseDetails?.account?.email1}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
