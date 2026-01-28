"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type IContactDetails = {
  email: string;
  phone: string;
  address: string;
  googleMapsUrl: string;
};

const Page = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [contactDetails, setContactDetails] = useState<IContactDetails | null>(
    null
  );
  const [formData, setFormData] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const fetchContactDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/configs/contact-info", {
        cache: false,
      });
      if (!data?.success) throw new Error(data?.message);
      setContactDetails(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const handleUpdate = async (values: any) => {
    try {
      const { data } = await axiosInstance.put(
        "/admin/configs/contact-info",
        values
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success("Successfully updated contact details");
      setOpenConfirm(false);
      fetchContactDetails();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchContactDetails();
  }, []);
  useEffect(() => {
    if (contactDetails) {
      setValue("email", contactDetails?.email);
      setValue("phone", contactDetails?.phone);
      setValue("address", contactDetails?.address);
      setValue("googleMapsUrl", contactDetails?.googleMapsUrl);
    }
  }, [contactDetails]);
  const emailInput = watch("email");
  const addressInput = watch("address");
  const phoneInput = watch("phone");
  const googleMapsUrlInput = watch("googleMapsUrl");
  return (
    <>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogTitle>Change contact info?</DialogTitle>
          <p>Are you sure to change your contact details?</p>
          <div className="flex w-full justify-end gap-6">
            <Button
              onClick={() => {
                setFormData(null);
                setOpenConfirm(false);
              }}
              variant={"outline"}
            >
              No
            </Button>
            <Button onClick={() => handleUpdate(formData)}>Yes</Button>
          </div>
        </DialogContent>
      </Dialog>
      <h1 className="mb-6 text-xl md:text-2xl font-semibold">Contact info</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <form
          onSubmit={handleSubmit((values) => {
            setOpenConfirm(true);
            setFormData(values);
          })}
          action=""
          className="flex flex-col gap-4 flex-1 max-w-[30rem]"
        >
          <div className="flex gap-2 flex-col">
            <label htmlFor="" className="font-semibold">
              Email
            </label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter contact email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-col">
            <label htmlFor="" className="font-semibold">
              Phone
            </label>
            <Input
              {...register("phone", {
                required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Phone number must be at most 20 characters",
                },
                pattern: {
                  //only allow spaces, hyphen , plus, parentheses and numbers
                  value: /^[0-9\s\-()+]*$/,
                  message: "Invalid phone number",
                },
              })}
              placeholder="Enter contact phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">
                {errors.phone.message as string}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-col">
            <label htmlFor="" className="font-semibold">
              Address
            </label>
            <Textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
                maxLength: {
                  value: 200,
                  message: "Address must be at most 200 characters",
                },
              })}
              placeholder="Enter official address"
              rows={2}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">
                {errors.address.message as string}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-col">
            <label htmlFor="" className="font-semibold">
              Google maps location URL
            </label>
            <Input
              {...register("googleMapsUrl", {
                required: "Google maps URL is required",
                validate: (val: string) =>
                  val.startsWith("https") ||
                  val.startsWith("http") ||
                  "Invalid URL",
              })}
              placeholder="Paste URL to your location from Google Maps"
            />
            {errors.googleMapsUrl && (
              <p className="text-red-500 text-sm">
                {errors.googleMapsUrl.message as string}
              </p>
            )}
          </div>
          <Button
            disabled={
              (emailInput === contactDetails?.email &&
                addressInput === contactDetails?.address &&
                phoneInput === contactDetails?.phone &&
                googleMapsUrlInput === contactDetails?.googleMapsUrl) ||
              isSubmitting
            }
            className="self-end"
            type="submit"
          >
            Save changes
          </Button>
        </form>

        <div className="flex justify-center flex-1">
          <iframe
            src={contactDetails?.googleMapsUrl}
            className="w-[30rem] h-[25rem]"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Page;
