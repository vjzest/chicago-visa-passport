"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ContactUsSchema } from "@/lib/form-schema";
import { Textarea } from "@/components/ui/textarea";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axiosInstance from "@/lib/config/axios";
import { formatName } from "@/lib/utils";
import { useDataStore } from "@/store/use-data-store";

const ContactUsCard = ({
  userData,
}: {
  userData?: {
    email: string;
    fullName: string;
    _id?: string;
    phone?: string;
    email2?: string;
    phone2?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };
}) => {
  // const { contact } = useContactUs();
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contactInfo = useDataStore((state) => state.storeContactInfo);
  const form = useForm<z.infer<typeof ContactUsSchema>>({
    mode: "onChange",
    resolver: zodResolver(ContactUsSchema),
    defaultValues: {
      email: userData?.email || "",
      name: userData?.firstName
        ? userData.firstName + " " + userData?.lastName
        : "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ContactUsSchema>) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/common/contact", data);
      // handle successful response
      if (response?.data?.success) {
        toast.success("Request has been submitted successfully");
        form.reset();
      } else {
        toast.error("An error occurred while submitting the form.");
      }
    } catch (error) {
      // handle error
      toast.error("An error occurred while submitting the form.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Card className="my-10 flex flex-col justify-center gap-5 p-5 py-12 shadow-full md:flex-row md:gap-16">
        <div className="flex w-full items-center justify-center md:w-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onChange={() => {
                if (submitError) setSubmitError("");
              }}
              className="flex w-full flex-col space-y-6 sm:w-[400px] sm:justify-center"
            >
              <h2 className="text-3xl font-semibold">Contact us</h2>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={60}
                        placeholder={"Enter your name"}
                        {...field}
                        onChange={(e) => {
                          const formattedName = formatName(e.target.value, {
                            allowUppercaseInBetween: true,
                            allowNonConsecutiveSpaces: true,
                          });
                          field.onChange(formattedName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        maxLength={100}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value.trim());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message here."
                        {...field}
                        maxLength={1000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {submitError && <FormMessage>{submitError}</FormMessage>}
              <div>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    type="submit"
                    className="rounded-full px-6"
                    size="lg"
                    disabled={isLoading}
                    variant={"primary"}
                  >
                    {!isLoading ? (
                      "Submit Message"
                    ) : (
                      <Loader className="animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5  md:w-1/2">
          <div className="w-full md:min-w-[30rem] min-h-[25rem]">
            <iframe
              src={contactInfo?.googleMapsUrl}
              className="w-full h-[25rem]"
              loading="lazy"
            ></iframe>
          </div>
          <div className="w-[970px]:flex-row flex w-full flex-col justify-between  gap-10 px-5 lg:flex-row">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Reach Out</span>
              <a href={`tel:${contactInfo?.phone}`}>
                <span className="flex items-center gap-2">
                  <Image src={IMGS?.Phone} width={40} alt="" />
                  {contactInfo?.phone}
                </span>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default ContactUsCard;
