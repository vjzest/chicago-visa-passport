"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IRole } from "@/interfaces/role.interface";
import axiosInstance from "@/services/axios/axios";
import { Info, Loader2 } from "lucide-react";
import { IAdmin } from "@/interfaces/admin.interface";
import { toast } from "sonner";
import Image from "next/image";
import env from "@/lib/env.config";

// Define the Zod schema
const AddUserFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "username is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    chicagoAccess: z.boolean().default(true),
    passportAccess: z.boolean().default(false),
    image: z.custom<File>(),
    showInDropdown: z.boolean().default(false),
    ipRestriction: z.boolean().default(false),
    ipAddress: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const regex = /^[a-zA-Z0-9.:]+$/;
        return regex.test(val);
      }, "Invalid IP address"),
    autoAssign: z.boolean().default(false),
    status: z.enum(["Active", "Archive"]).default("Active"),
    password: z
      .string()
      .optional()
      .refine(
        (value) => value === undefined || value === "" || value.length >= 6,
        {
          message: "Password must be at least 6 characters long",
        }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.ipRestriction && !data.ipAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "IP address is required when IP restriction is enabled",
        path: ["ipAddress"],
      });
    }
  });
type ZAddUserSchema = z.infer<typeof AddUserFormSchema>;

// Define the prop types
interface EditUserDialogProps {
  setOpenEditDialog: (open: boolean) => void;
  initialValues?: Partial<ZAddUserSchema> | null;
  admin: IAdmin;
  reset: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  setOpenEditDialog,
  reset,
  admin,
}) => {
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [passportRoles, setPassportRoles] = useState<IRole[]>([]);
  const [image, setImage] = useState<Blob | null>();
  const form = useForm({
    resolver: zodResolver(AddUserFormSchema),
    defaultValues: {
      ...admin,
      role: (admin as any).projectAccess?.[0]?.roleId || "",
      chicagoAccess: !!(admin as any).projectAccess?.find((p: any) => p.project === "chicago-visa"),
      passportAccess: !!(admin as any).projectAccess?.find((p: any) => p.project === "jet-passport"),
      image: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setError("");
      const projectAccess: { project: string; roleId: string; enabled: boolean }[] = [];
      const selectedRole = roles.find((r) => r._id === values.role) || passportRoles.find((r) => r._id === values.role);
      const roleTitle = selectedRole?.title || "";

      if (values.chicagoAccess) {
        const chicagoRole = roles.find(r => r.title === roleTitle) || roles[0];
        if (chicagoRole) {
          projectAccess.push({ project: "chicago-visa", roleId: chicagoRole._id, enabled: true });
        }
      }
      if (values.passportAccess) {
        const passportRole = passportRoles.find(r => r.title === roleTitle) || passportRoles[0];
        if (passportRole) {
          projectAccess.push({ project: "jet-passport", roleId: passportRole._id, enabled: true });
        }
      }

      const getFormData = () => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("projectAccess", JSON.stringify(projectAccess));
        formData.append("role", values.role);

        if (image) formData.append("image", image);
        formData.append("ipRestriction", values.ipRestriction);
        formData.append("ipAddress", values.ipAddress);
        formData.append("autoAssign", values.autoAssign);
        formData.append("status", values.status);
        if (values.password) formData.append("password", values.password);
        return formData;
      };

      // Attempt Dual Update
      const chicagoUrl = env.BASE_URL || "http://localhost:4000/api/v1";
      const passportUrl = env.PASSPORT_BASE_URL || "http://localhost:4001/api/v1";

      const promises = [];
      const chicagoToken = localStorage.getItem("admin_token");
      const passportToken = localStorage.getItem("admin_token_passport");

      if (values.chicagoAccess && chicagoToken) {
        promises.push(axios.put(`${chicagoUrl}/admin/admins/${admin._id}`, getFormData(), {
          headers: { Authorization: `Bearer ${chicagoToken}`, "Content-Type": "multipart/form-data" }
        }));
      }

      if (values.passportAccess && passportToken) {
        promises.push(axios.put(`${passportUrl}/admin/admins/${admin._id}`, getFormData(), {
          headers: { Authorization: `Bearer ${passportToken}`, "Content-Type": "multipart/form-data" }
        }));
      }

      const results = await Promise.allSettled(promises);
      const errors = results.filter(r => r.status === "rejected");

      if (errors.length === promises.length && promises.length > 0) {
        throw new Error("Failed to update on both Chicago and Passport backends");
      }

      if (errors.length > 0) {
        toast.warning(`Updated partially. Some systems failed to sync.`);
      } else {
        toast.success("User updated and synchronized successfully!");
      }

      setOpenEditDialog(false);
      setError("");
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "An error occurred during synchronization");
    }
  };

  const fetchRoles = async () => {
    try {
      const chicagoUrl = env.BASE_URL || "http://localhost:4000/api/v1";
      const passportUrl = env.PASSPORT_BASE_URL || "http://localhost:4001/api/v1";

      const [chicagoRes, passportRes] = await Promise.allSettled([
        axiosInstance.get(`${chicagoUrl}/admin/roles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
        }),
        axiosInstance.get(`${passportUrl}/admin/roles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token_passport")}` }
        })
      ]);

      if (chicagoRes.status === "fulfilled" && chicagoRes.value.data?.success) {
        setRoles(chicagoRes.value.data.data);
      }
      if (passportRes.status === "fulfilled" && passportRes.value.data?.success) {
        setPassportRoles(passportRes.value.data.data);
      }
    } catch (error) {
      console.log("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    form.reset({
      ...admin,
      role: (admin as any).projectAccess?.[0]?.roleId || "",
      chicagoAccess: !!(admin as any).projectAccess?.find((p: any) => p.project === "chicago-visa"),
      passportAccess: !!(admin as any).projectAccess?.find((p: any) => p.project === "jet-passport"),
      password: "",
      image: "",
    });
  }, [admin]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="add-user-form"
        className="flex h-[70vh] flex-col md:grid grid-cols-2 gap-x-4 overflow-y-auto px-4 pb-4"
        encType="multipart/form-data"
      >
        {/* field for image upload */}
        {(image || admin.image) && (
          <Image
            height={100}
            width={100}
            src={image ? URL.createObjectURL(image) : admin.image}
            alt="admin_image"
            className="mx-auto h-40 w-40 rounded-sm object-cover"
          />
        )}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="py-3 col-span-2">
              <FormLabel htmlFor="image" className="text-blue-500 font-semibold cursor-pointer">
                Click to choose {image || field.value ? "another image" : "profile image"}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={""}
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                      field.onChange(file);
                    }
                  }}
                  type="file"
                  accept="image/*"
                  id="image"
                  className="mt-1 hidden w-full rounded-md border border-gray-300 p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel htmlFor="firstName">First name</FormLabel>
              <FormControl>
                <Input type="text" id="firstName" placeholder="Enter first name" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel htmlFor="lastName">Last name</FormLabel>
              <FormControl>
                <Input type="text" id="lastName" placeholder="Enter last name" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel htmlFor="username">username</FormLabel>
              <FormControl>
                <Input type="text" id="username" placeholder="Enter username" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input type="email" id="email" placeholder="Enter email" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-8 py-4 border-t border-b">
            <div className="flex flex-col gap-1">
              <FormLabel className="text-blue-600 font-semibold mb-1">Project Access</FormLabel>
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="chicagoAccess"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Chicago Visa</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passportAccess"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Jet Passport</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor="role" className="text-blue-600 font-semibold">Admin Type / Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent id="role">
                        {roles.map((role) => (
                          <SelectItem key={role._id} value={role._id}>
                            {role.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mb-2 mt-6 flex items-center gap-2">
          <FormField
            control={form.control}
            name="autoAssign"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormLabel htmlFor="autoAssign">Auto Assign</FormLabel>
                <FormControl>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} id="autoAssign" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="mb-2 mt-6 flex items-center gap-2">
          <FormField
            control={form.control}
            name="ipRestriction"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormLabel htmlFor="ipRestriction">IP Restriction</FormLabel>
                <FormControl>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} id="ipRestriction" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {form.watch("ipRestriction") && (
          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem className="py-3">
                <FormLabel htmlFor="ipAddress">IP Address</FormLabel>
                <FormControl>
                  <Input type="text" id="ipAddress" placeholder="Enter IP address" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="py-3">
                <FormLabel htmlFor="status">Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ?? "Active"}>
                    <SelectTrigger className="text-nowrap">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent id="status">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Archive">Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input type="text" id="password" placeholder="Enter password (optional)" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="flex items-center gap-2 my-4">
            <Info color="red" />
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}
        <Button
          className="col-span-2 w-fit mx-auto"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Edit admin"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditUserDialog;
