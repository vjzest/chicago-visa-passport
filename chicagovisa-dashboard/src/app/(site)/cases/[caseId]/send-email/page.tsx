"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Plane, Router, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { removeHtmlTags } from "@/lib/utils";
import axiosInstance from "@/services/axios/axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import CustomAlert from "@/components/globals/custom-alert";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BreadCrumbComponent from "@/components/globals/breadcrumb";
import LoadingPage from "@/components/globals/LoadingPage";

const formSchema = z.object({
  subject: z.string().min(1, "Enter your email subject"),
  content: z.string().refine(
    (val) => {
      const trimmedContent = removeHtmlTags(val).trim();
      return trimmedContent.length > 0;
    },
    {
      message: "Enter your email content",
    }
  ),
});

type FormType = z.infer<typeof formSchema>;

const Page = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [ccInput, setCcInput] = useState("");
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [ccTags, setCcTags] = useState<string[]>([]);
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCcKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addCcTag();
    }
  };

  const addCcTag = () => {
    if (!ccInput.trim()) return;

    const emails = ccInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const newTags: string[] = [];
    let emailInvalid = false;
    emails.forEach((email) => {
      newTags.push(email);
      if (!validateEmail(email)) emailInvalid = true;
    });
    if (emailInvalid) return;
    setCcTags((prev) => [...prev, ...newTags]);
    setCcInput("");
  };

  const removeCcTag = (email: string) => {
    setCcTags((prev) => prev.filter((tag) => tag !== email));
  };

  const onSubmitEmail = async (values: FormType) => {
    setSendingEmail(true);
    try {
      const { data } = await axiosInstance.post(
        `/admin/cases/caseId/${caseId}/custom-email`,
        {
          subject: values.subject,
          content: values.content,
          cc: ccTags,
        }
      );
      if (!data?.success) {
        throw new Error(data?.message);
      }
      toast.success("Email sent successfully");
      router.push("/cases/" + caseId);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setSendingEmail(false);
    }
  };

  const breadcrumbs = useMemo(() => {
    return [
      {
        label: "Case Details",
        link: "/cases/" + caseId,
      },
      {
        label: "Send Email",
        link: null,
      },
    ];
  }, []);

  const fetchCasedetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/cases/caseId/" + caseId,
        {
          cache: false,
        }
      );
      if (!data.success) throw new Error(data.message);
      setCaseDetails(data?.data.caseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCasedetails();
  }, []);

  return caseDetails ? (
    <Form {...form}>
      <BreadCrumbComponent customBreadcrumbs={breadcrumbs} />
      <h2 className="mb-4 text-2xl font-semibold">
        Send Email ({caseDetails?.caseNo})
      </h2>
      <form className="space-y-4">
        <span className="font-semibold text-base">
          To: {caseDetails?.contactInformation?.email1}
        </span>
        {/* CC Field */}
        <div className="space-y-2">
          <label
            htmlFor="cc"
            className="block text-sm font-medium text-gray-700"
          >
            CC (Optional)
          </label>
          <div className="flex flex-wrap gap-2 items-center p-2 border rounded-md min-h-12 bg-white">
            {ccTags.map((email) => (
              <div
                key={email}
                className={`flex items-center px-3 py-1 rounded-full text-sm border border-deep-blue`}
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeCcTag(email)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X />
                </button>
              </div>
            ))}
            <div className="flex items-center w-full">
              <Input
                id="cc"
                type="email"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={handleCcKeyDown}
                onBlur={addCcTag}
                placeholder={
                  ccTags.length === 0 ? "Enter emails separated by commas" : ""
                }
                className="flex-1 min-w-[100px] outline-none bg-transparent rounded-tr-none rounded-br-none"
              />
              <Button
                type="button"
                variant={"outline"}
                disabled={!validateEmail(ccInput)}
                onClick={addCcTag}
                className="px-3 py-1 text-sm rounded-md rounded-tl-none rounded-bl-none"
              >
                <Check size={"1.3rem"} />
              </Button>
            </div>
          </div>
          <div className="flex justify-end"></div>
        </div>
        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </FormLabel>
              <Input
                maxLength={200}
                {...field}
                id="subject"
                type="text"
                placeholder="Enter email subject"
                className="w-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Body Field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Body
              </FormLabel>
              <FormControl>
                <div className="overflow-hidden border-b">
                  <ReactQuill
                    value={field.value}
                    onChange={field.onChange}
                    className="h-[20rem] mb-4"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <DialogTrigger asChild>
              <Button
                disabled={!form.formState.isValid || sendingEmail}
                type="button"
                className="ml-auto"
              >
                {sendingEmail ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PaperPlaneIcon />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="md:w-[30vw]">
              <DialogHeader>
                <DialogTitle>
                  Confirm to send this email to customer?
                </DialogTitle>
                <DialogDescription>
                  Please recheck again for mistakes if you have to.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    form.handleSubmit(onSubmitEmail)();
                    setOpenConfirm(false);
                  }}
                >
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>{" "}
        </div>{" "}
        {/* Subject and body fields would go here */}
      </form>
    </Form>
  ) : (
    <LoadingPage />
  );
};

export default Page;
