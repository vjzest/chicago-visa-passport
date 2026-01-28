import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const EditPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    ...form
  } = useForm();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [show, setShow] = useState({ new: false, old: false });
  const onSubmit = async (values: any) => {
    try {
      setButtonDisabled(true);
      const { data } = await axiosInstance.put(
        "/user/account/password",
        values
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success("Password updated");
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating password");
    } finally {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 3000);
    }
  };
  const oldPasswordInput = watch("oldPassword");
  const newPasswordInput = watch("newPassword");
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4 flex flex-col ">
      <h2 className="mb-4 text-2xl font-semibold">Edit password</h2>
      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="oldPassword">Old password</Label>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Input
            type={show.old ? "text" : "password"}
            placeholder="Enter your old password"
            {...register("oldPassword", {
              required: "Old password is required",
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
            }}
            className="w-80"
          />
          {oldPasswordInput &&
            (show.old ? (
              <EyeOff
                onClick={() => setShow((prev) => ({ ...prev, old: false }))}
              />
            ) : (
              <Eye
                onClick={() => setShow((prev) => ({ ...prev, old: true }))}
              />
            ))}
        </div>
        {errors?.oldPassword && (
          <p className="mt-2 text-sm text-red-500">
            {errors?.oldPassword?.message as string}
          </p>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Input
            type={show.new ? "text" : "password"}
            placeholder="Enter your new password"
            {...register("newPassword", {
              required: "New password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
                message:
                  "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, one special character and one number",
              },
              validate: (value) => {
                const oldPassword = oldPasswordInput;
                return (
                  value !== oldPassword ||
                  "New password must be different from old password"
                );
              },
            })}
            id="newPassword"
            name="newPassword"
            className="w-80"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
            }}
          />
          {newPasswordInput &&
            (show.new ? (
              <EyeOff
                onClick={() => setShow((prev) => ({ ...prev, new: false }))}
              />
            ) : (
              <Eye
                onClick={() => setShow((prev) => ({ ...prev, new: true }))}
              />
            ))}
        </div>
        {errors?.newPassword && (
          <p className="mt-2 w-[25rem] text-wrap text-sm text-red-500">
            {errors?.newPassword?.message as string}
          </p>
        )}
      </div>
      <Button
        disabled={buttonDisabled || !oldPasswordInput || !newPasswordInput}
        className="self-end"
        type="submit"
      >
        Change
      </Button>
    </form>
  );
};

export default EditPasswordForm;
