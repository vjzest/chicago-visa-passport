"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/config/axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import InfoBox from "@/components/pages/home/info";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .nonempty("Name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .nonempty("Message is required"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [submissionMessage, setSubmissionMessage] = useState({
    success: false,
    message: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });
  const isFormValid = form.formState.isValid;
  const { name, email, message, acceptTerms } = form.watch();
  const isFormComplete = name && email && message && acceptTerms;
  const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    // Block input if it's not a letter or space
    if (!/^[a-zA-Z\s]$/.test(event.key)) {
      event.preventDefault();
    }
  };
  const onSubmit = async (values: FormData) => {
    try {
      const { data } = await axiosInstance.post("/contact", values);
      if (!data?.success) throw new Error(data?.message);
      setSubmissionMessage({
        message: "",
        success: true,
      });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmissionMessage({
        message: "Something went wrong, please try again later",
        success: false,
      });
    }
  };
  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4 transform transition-all duration-300 animate-slideIn">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              {/* Message */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600">Our team will contact you shortly</p>
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        <div className="h-[50vh] bg-[#F2F9FF] relative">
          {/* Main container - changes to column on mobile */}
          <div className="w-[90%] h-full mx-auto hidden lg:flex">
            {/* Desktop Layout */}
            <div className="w-1/2 flex justify-center items-center">
              <h1 className="mt-5 font-grotesk text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#144066] mb-6">
                Contact Us
              </h1>
            </div>

            <div className="w-1/2 relative">
              <div className="h-[70%] absolute bottom-0">
                <Image
                  src="/contact/contact.png"
                  alt="contact-banner"
                  width={800}
                  height={800}
                  className="object-contain h-full rounded-lg  "
                  priority
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="w-full h-full mx-auto flex flex-col lg:hidden">
            {/* Mobile Text Section */}
            <div className="w-full pt-6 px-4">
              <h1 className="font-grotesk text-3xl font-bold leading-tight text-[#144066] text-center">
                Contact Us
              </h1>
            </div>

            {/* Mobile Image Section */}
            <div className="flex-1 relative  px-4  ">
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src="/contact/contact.png"
                  alt="contact-banner"
                  width={500}
                  height={500}
                  className="object-contain max-h-[300px] rounded-lg absolute bottom-0"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <section className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Contact Info */}
              <div className="space-y-4 sm:space-y-6">
                <h1 className="font-grotesk text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222]">
                  Have Questions?
                </h1>
                <p className="mt-2 text-[#666666] text-sm sm:text-base">
                  If you have any questions or need assistance, feel free to
                  reach out to us anytime. Our dedicated team is here to help
                  you navigate the process, answer your concerns, and provide
                  the support you need.
                </p>
                <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-900 mt-1" />
                    <a
                      href="mailto:support@jetpassports.com"
                      className="text-[#222222] text-sm"
                    >
                      support@jetpassports.com
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-900 mt-1" />
                    <a
                      href="tel:202-474-9999"
                      className="text-[#222222] text-sm"
                    >
                      202-474-9999
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-900 mt-1" />
                    <div className="text-[#222222] space-y-1 text-sm">
                      <p className="font-medium">Monday - Friday</p>
                      <p>9:00 am - 6:00 pm (Open)</p>
                      <p>Saturday & Sunday (Closed)</p>
                      <p>Holidays (Closed)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column - Form */}
              <div className="bg-white rounded-lg p-4 sm:p-6">
                {submissionMessage.message && (
                  <p
                    className={`mb-4 ${submissionMessage.success ? "text-green-500" : "text-red-500"}`}
                  >
                    {submissionMessage.message}
                  </p>
                )}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#222222]">
                            Name*
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full h-10 sm:h-12 pt-3 px-4 rounded-lg bg-blue-50"
                              onKeyDown={handleNameKeyDown}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#222222]">
                            Email*
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="w-full h-10 sm:h-12 pt-3 px-4 rounded-lg bg-blue-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#222222]">
                            Message*
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="border-none w-full h-24 sm:h-[120px] pt-3 px-4 rounded-lg bg-blue-50 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          {" "}
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="leading-none">
                            {" "}
                            <p className="text-sm text-gray-600 font-roboto">
                              I accept the{" "}
                              <a
                                href="/home/terms-conditions"
                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                              >
                                Terms and Conditions
                              </a>
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      suppressHydrationWarning={true}
                      type="submit"
                      disabled={!isFormComplete || !isFormValid}
                      className="w-full bg-[#006DCC] rounded-full hover:bg-[#144066] text-white px-6 sm:px-8 py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Message
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
        <InfoBox/>
      </div>
    </>
  );
}
