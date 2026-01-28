"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IAdmin } from "@/interfaces/admin.interface";
import { IServiceLevel } from "@/interfaces/service-level.interface";
import { IProcessingLocation } from "@/interfaces/processing-location.interface";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  emailApi,
  fedexConfigurationsAPI,
} from "@/services/end-points/end-point";
import CustomAlert from "@/components/passport/globals/custom-alert";
import Link from "next/link";
import { IStatus } from "@/interfaces/status.interface";
import { Loader2 } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import { useAccess } from "@/hooks/use-access";
import PaymentForm from "./payment-form";
import { removeHtmlTags } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ICaseInfo {
  caseManager: {
    _id: string;
  };
  serviceLevel: {
    _id: string;
  };
  serviceType: {
    _id: string;
  };
  status: {
    _id: string;
    title: string;
    level: number;
  };
  subStatus1: {
    _id: string;
    title: string;
    level: number;
  };
  subStatus2: {
    _id: string;
    title: string;
    level: number;
  };
  processingLocation: { _id: string };
  disableAutoEmails: boolean;
  notes: string[];
  additionalShippingOptions?: Record<string, boolean>;
}

export function CaseForm({
  caseDetails,
  setNotes,
  caseManagers,
  serviceLevels,
  serviceTypes,
  processingLocations,
  caseId,
  accountId,
  statuses,
  excludedFields,
  refetch,
}: {
  caseDetails: any;
  setNotes: Dispatch<SetStateAction<any[]>>;
  caseManagers: IAdmin[];
  serviceLevels: IServiceLevel[];
  serviceTypes: any[];
  processingLocations: IProcessingLocation[];
  statuses: IStatus[];
  caseId: string;
  accountId: string;
  excludedFields: string[];
  refetch: () => void;
}) {
  const isCaseSubmitted = !!caseDetails?.submissionDate;
  const caseInfo: ICaseInfo = caseDetails?.caseInfo;
  const access = useAccess();
  const refreshStatuses = useAdminStore((state) => state.refreshStatuses);
  const [fedexShipping, setFedexShipping] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTestimonialRequest, setSendingTestimonialRequest] =
    useState(false);
  const [dynamicSchema, setDynamicSchema] = useState<any>(null);
  const [allowFormSubmission, setAllowFormSubmission] = useState(false);
  const [disableResendMail, setDisableResendMail] = useState(false);

  const getAlertMessage = () => {
    const notes = form.watch("notes");

    return `${!notes && access?.editCaseDetails.companyCaseNotes ? "Your note is missing. " : ""}Are you sure you want to update the Case details?`;
  };

  const getAllFedex = async () => {
    const response = await fedexConfigurationsAPI.getAll();
    const activeNonDeleted = response?.data?.filter(
      (item: { isDeleted: boolean; isActive: boolean }) =>
        !item?.isDeleted && item?.isActive
    );
    setFedexShipping(activeNonDeleted || []);
  };

  const toggleAutoEmails = async () => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/cases/caseId/${caseId}/toggle-auto-emails`
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(
        `Auto emails ${caseInfo.disableAutoEmails ? "enabled" : "disabled"} successfully`
      );
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to toggle auto emails");
    }
  };

  useEffect(() => {
    getAllFedex();
  }, []);

  useEffect(() => {
    if (fedexShipping.length > 0) {
      const dynamicFields: any = {};
      fedexShipping.forEach((option: { title: string }) => {
        dynamicFields[option.title] = z.boolean().default(false);
      });

      const newSchema = z.object({
        caseManager: z
          .string()
          .min(1, { message: "Case Manager is required" })
          .optional(),
        serviceLevel: z
          .string()
          .min(1, { message: "Service Level is required" })
          .optional(),
        serviceType: z
          .string()
          .min(1, { message: "Service Type is required" })
          .optional(),
        status: z.string().min(1, { message: "Status is required" }).optional(),
        processingLocation: z
          .string()
          .min(1, { message: "Processing Location is required" })
          .optional(),
        disableAutoEmails: z.boolean().default(false),
        notes: z.string().min(5, { message: "Notes are required" }),
        ...dynamicFields,
      });

      setDynamicSchema(newSchema);
    }
  }, [fedexShipping]);

  const form = useForm({
    resolver: zodResolver(dynamicSchema || z.object({})),
    defaultValues: {
      caseManager: caseInfo.caseManager?._id,
      status: caseInfo?.status?._id ?? "",
      subStatus1: caseInfo?.subStatus1?._id ?? "",
      subStatus2: caseInfo?.subStatus2?._id ?? "",
      serviceType: caseInfo?.serviceType?._id,
      serviceLevel: caseInfo?.serviceLevel?._id,
      processingLocation: caseInfo?.processingLocation?._id,
      disableAutoEmails: caseDetails?.account?.consentToUpdates,
      notes: "",
      ...Object.fromEntries(
        fedexShipping.map((option: { title: string }) => [
          option.title,
          caseInfo.additionalShippingOptions?.[option.title] || false,
        ])
      ),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetCaseForm = () => {
    form.reset({
      caseManager: caseInfo.caseManager?._id,
      status: caseInfo?.status?._id ?? "",
      subStatus1: caseInfo?.subStatus1?._id ?? "",
      subStatus2: caseInfo?.subStatus2?._id ?? "",
      serviceType: caseInfo?.serviceType?._id,
      serviceLevel: caseInfo?.serviceLevel?._id,
      processingLocation: caseInfo?.processingLocation?._id,
      disableAutoEmails: caseDetails?.account?.consentToUpdates,
      notes: "",
      ...Object.fromEntries(
        fedexShipping.map((option: { title: string }) => [
          option.title,
          caseInfo.additionalShippingOptions?.[option.title] || false,
        ])
      ),
    });
  };

  useEffect(() => {
    resetCaseForm();
  }, [caseDetails, fedexShipping]);
  const filteredServiceLevels = serviceLevels.filter(
    (el) =>
      el.serviceTypes.includes(form.watch("serviceType")) ||
      el._id === caseDetails?.caseInfo?.serviceLevel?._id
  );
  const onConfirm = async () => {
    setLoading(true);
    const values = form.getValues();

    // Remove excluded fields from the values object
    const updatedValues = Object.keys(values).reduce((acc, key) => {
      if (!excludedFields.includes(key)) {
        //@ts-ignore
        acc[key] = values[key];
      }
      return acc;
    }, {});

    try {
      const response = await axiosInstance.put(
        `/admin/cases/caseId/${caseId}`,
        updatedValues
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Couldn't update case details"
        );
      }

      if (response?.data?.data?.notes) {
        interface INote {
          note: string;
          createdAt: string;
          _id: string;
          host: string;
        }
        setNotes(
          response?.data?.data?.notes?.sort(
            (a: INote, b: INote) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
      form.setValue("notes", "");
      toast.success("Case details updated successfully");
      refetch();
      refreshStatuses();
    } catch (error: any) {
      resetCaseForm();
      console.error("Error updating case:", error);
      toast.error(
        error.response?.data?.message ||
          error?.message ||
          "Couldn't update case details"
      );
    }
    setLoading(false);
  };

  const handleRequestTestimonial = async () => {
    setSendingTestimonialRequest(true);
    const response = await emailApi.sendTestimonialRequest(caseId);
    if (response?.success) {
      toast.success("Testimonial request sent successfully");
      refetch();
    } else {
      toast.error("Failed to send testimonial request");
    }
    setSendingTestimonialRequest(false);
  };

  const handleResendEmail = async () => {
    setDisableResendMail(true);
    await emailApi.resendCredentials({ accountId, caseId });
    setTimeout(() => {
      setDisableResendMail(false);
    }, 3000);
  };

  useEffect(() => {
    const subscription = form.watch((values: any) => {
      const normalizedValues = {
        ...values,
        notes:
          values.notes === "<p><br></p>"
            ? ""
            : removeHtmlTags(values.notes)?.trim(),
      };

      const isChanged = Object.keys(normalizedValues).some((key: any) => {
        switch (key) {
          case "serviceLevel":
            return (
              normalizedValues[key] !== (caseInfo?.serviceLevel?._id ?? "")
            );
          case "serviceType":
            return normalizedValues[key] !== (caseInfo?.serviceType?._id ?? "");
          case "status":
            return normalizedValues[key] !== (caseInfo?.status?._id ?? "");
          case "subStatus1":
            return normalizedValues[key] !== (caseInfo?.subStatus1?._id ?? "");
          case "subStatus2":
            return normalizedValues[key] !== (caseInfo?.subStatus2?._id ?? "");
          case "caseManager":
            return normalizedValues[key] !== (caseInfo?.caseManager?._id ?? "");
          case "processingLocation":
            return (
              normalizedValues[key] !==
              (caseInfo?.processingLocation?._id ?? "")
            );
          case "disableAutoEmails":
            return (
              normalizedValues[key] !== caseDetails?.account?.consentToUpdates
            );
          case "notes":
            return normalizedValues[key] !== "";
          default:
            return (
              normalizedValues[key] &&
              !caseInfo?.additionalShippingOptions?.[key]
            );
        }
      });

      setAllowFormSubmission(isChanged);
    });

    return () => subscription.unsubscribe(); // Cleanup subscription on unmount
  }, [form, caseDetails]);

  const level1SubStatuses = statuses.filter(
    (status: IStatus) =>
      status.level === 2 && status.parent === form.watch("status")
  );
  const level2SubStatuses = statuses.filter(
    (status: IStatus) =>
      status.level === 3 && status.parent === form.watch("subStatus1")
  );
  return (
    <div className="rounded-lg bg-blue-50 p-6 space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <h2 className="text-xl font-bold text-blue-800">Case Updates</h2>
          {!excludedFields.includes("caseManager") && (
            <FormField
              control={form.control}
              name="caseManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Manager:</FormLabel>
                  <Select
                    disabled={!access?.editCaseDetails.assignedRepresentative}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Case Manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {caseManagers.map((manager) => (
                        <SelectItem
                          key={manager?._id}
                          value={manager?._id}
                        >{`${manager?.firstName} ${manager?.lastName}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select
                  disabled={
                    !isCaseSubmitted ||
                    !access?.editCaseDetails.serviceTypeAndLevel
                  }
                  // disabled
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceTypes.map((serviceType) => (
                      <SelectItem
                        key={serviceType?._id}
                        value={serviceType?._id}
                      >{`${serviceType?.serviceType}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!excludedFields.includes("serviceLevel") && (
            <FormField
              control={form.control}
              name="serviceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Service level (in travel & Passport Information)
                  </FormLabel>
                  <Select
                    disabled={
                      !isCaseSubmitted ||
                      !access?.editCaseDetails.serviceTypeAndLevel ||
                      caseDetails.caseInfo.serviceLevelUpdated
                    }
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Service Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredServiceLevels.map((serviceLevel) => (
                        <SelectItem
                          key={serviceLevel?._id}
                          value={serviceLevel?._id}
                        >{`${serviceLevel?.serviceLevel + ` : ${serviceLevel?.time}`}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status:</FormLabel>
                  <Select
                    disabled={!access?.editCaseDetails.status}
                    onValueChange={(e) => {
                      form.setValue("subStatus1", "");
                      form.setValue("subStatus2", "");
                      field.onChange(e);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map(
                        (status) =>
                          status.level === 1 && (
                            <SelectItem
                              key={status?._id}
                              value={status?._id}
                            >{`${status?.title}`}</SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subStatus1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub status 1:</FormLabel>
                  <Select
                    disabled={
                      !access?.editCaseDetails.status ||
                      level1SubStatuses.length < 1
                    }
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {level1SubStatuses?.map((status) => (
                        <SelectItem
                          key={status?._id}
                          value={status?._id}
                        >{`${status?.title}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subStatus2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub status 2:</FormLabel>
                  <Select
                    disabled={
                      !access?.editCaseDetails.status ||
                      level2SubStatuses.length < 1
                    }
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {level2SubStatuses?.map((status) => (
                        <SelectItem
                          key={status?._id}
                          value={status?._id}
                        >{`${status?.title}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>

          <FormField
            control={form.control}
            name="processingLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Location:</FormLabel>
                <Select
                  disabled={!access?.editCaseDetails.shippingOptions}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Processing Location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {processingLocations?.map((processingLocation) => (
                      <SelectItem
                        key={processingLocation?._id}
                        value={processingLocation?._id}
                      >{`${processingLocation?.locationName}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isCaseSubmitted &&
            access?.editCaseDetails.shippingOptions &&
            fedexShipping.length > 0 && (
              <div className="space-y-4">
                {fedexShipping.map(
                  (item: { _id: string; title: any; price: number }) => (
                    <FormField
                      key={item._id}
                      control={form.control}
                      name={item.title}
                      render={({ field }) => {
                        const isCheckedInDatabase =
                          caseInfo?.additionalShippingOptions?.[item?.title] ||
                          false;
                        return (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                disabled={
                                  !access?.editCaseDetails.shippingOptions ||
                                  isCheckedInDatabase
                                }
                                checked={field?.value || isCheckedInDatabase}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Add {item?.title} for ${item?.price} more.
                              </FormLabel>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  )
                )}
              </div>
            )}

          {access?.editCaseDetails.companyCaseNotes && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Note:</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <ReactQuill
                          className="bg-white"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex gap-4 justify-end w-full ml-auto">
            {allowFormSubmission && (
              <Button variant={"outline"} onClick={resetCaseForm}>
                Cancel changes
              </Button>
            )}
            <CustomAlert
              confirmText="Submit"
              alertMessage={getAlertMessage()}
              extra={(() => {
                const selectedStatusId = form.getValues("status");
                const selectedStatus = statuses.find(
                  (status) => status._id === selectedStatusId
                );
                const selectedServiceType = form.getValues("serviceType");
                return (
                  <>
                    {caseDetails?.caseInfo?.serviceType?._id !==
                      selectedServiceType && (
                      <div className="break-words border-2 border-red-500 p-2 font-medium text-red-500">
                        You are changing the{" "}
                        <strong>&#39; SERVICE TYPE&#39;</strong> for this case.
                        <span className="text-red-500 font-medium">
                          This will reset all progress for this case and the
                          customer will have to go through passport application,
                          doc upload and other steps again.
                        </span>
                        Please double check.
                      </div>
                    )}
                    {selectedStatus?.key === "passport-processed" && (
                      <div className="break-words border-2 border-red-500 p-2 font-medium text-red-500">
                        Please note that you are changing the case status to
                        <strong>&#39;PASSPORT PROCESSED&#39;</strong>. This will
                        automatically place a shipment order on FedEx. Please
                        double check.
                      </div>
                    )}
                  </>
                );
              })()}
              TriggerComponent={
                <Button
                  disabled={!allowFormSubmission || loading}
                  type="submit"
                  className="px-8  w-full md:w-[15rem] bg-green-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              }
              onConfirm={onConfirm}
            />
          </div>
        </form>
      </Form>

      <div className="flex items-center gap-2">
        <CustomAlert
          alertTitle={`${caseInfo.disableAutoEmails ? "Enable" : "Disable"} auto emails?`}
          alertMessage={`This will ${caseInfo.disableAutoEmails ? "enable" : "disable"} all auto emails going out to the client on updates on this case.`}
          onConfirm={toggleAutoEmails}
          TriggerComponent={
            <Switch
              id="toggle-auto-emails"
              checked={caseInfo.disableAutoEmails}
            />
          }
        />
        <Label htmlFor="toggle-auto-emails">Disable Auto Emails</Label>
      </div>

      {isCaseSubmitted && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 ">
          {access?.viewCaseDetails.emails && (
            <>
              {caseDetails?.caseInfo?.requestForTestimonial ? (
                <Button
                  type="button"
                  className="w-44 mx-auto px-3 text-xs"
                  disabled
                >
                  Testimonial Request Sent
                </Button>
              ) : (
                <CustomAlert
                  alertTitle="Send Testimonial Request"
                  confirmText="Send"
                  alertMessage="Are you sure you want to send a testimonial request tot the client?"
                  onConfirm={handleRequestTestimonial}
                  TriggerComponent={
                    <Button
                      disabled={sendingTestimonialRequest}
                      type="button"
                      className="w-44 mx-auto px-3 text-xs"
                    >
                      Request Testimonial
                    </Button>
                  }
                />
              )}
            </>
          )}
          {access?.viewCaseDetails.emails && (
            <CustomAlert
              alertTitle="Resend Onboarding Email"
              confirmText="Send"
              alertMessage="Are you sure you want to resend the onboarding email to the client?"
              onConfirm={handleResendEmail}
              TriggerComponent={
                <Button
                  disabled={disableResendMail}
                  type="button"
                  className="w-44 mx-auto px-3 text-xs"
                >
                  Resend Onboarding Email
                </Button>
              }
            />
          )}{" "}
          <PaymentForm
            refetch={refetch}
            billingInfo={caseDetails.billingInfo}
            caseId={caseDetails?._id}
            buttonText="Process Payment"
          />
        </div>
      )}

      {/*  */}
      {isCaseSubmitted && access?.editCaseDetails.refundAndVoid && (
        <div className="mt-5 flex flex-row gap-3">
          <Link
            href={`/cases/${caseId}/refund`}
            className="text-primary underline"
          >
            Process Refund
          </Link>
          <Link
            href={`/cases/${caseId}/void`}
            className="text-primary underline"
          >
            Void Transaction
          </Link>
        </div>
      )}
    </div>
  );
}
