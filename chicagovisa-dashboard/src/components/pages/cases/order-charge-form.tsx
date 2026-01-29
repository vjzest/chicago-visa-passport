"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Info } from "lucide-react";
import {
  additionalService,
  caseApi,
  processorApi,
} from "@/services/end-points/end-point";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminStore } from "@/store/use-admin-store";

// Define the service type interface
interface ServiceType {
  serviceType: string;
  _id: string;
}

// Define the service level interface
interface ServiceLevel {
  serviceLevel: string;
  _id: string;
  price: string;
  nonRefundableFee: string;
  inboundFee: string;
  outboundFee: string;
  serviceTypes: string[];
  isActive: boolean;
}

// Define the additional service interface
interface AdditionalService {
  _id: string;
  title: string;
  serviceTypes: { _id: string }[];
  price: number;
  addons: {
    subTitle: string;
    price: number;
    _id: string;
  }[];
  isActive: boolean;
}

// Define the case info interface
interface CaseInfo {
  serviceType: ServiceType;
  serviceLevel: ServiceLevel;
  additionalServices: {
    service: { _id: string };
    addons: string[];
  }[];
}

// Define the payment form schema
const PaymentFormSchema = z.object({
  processor: z
    .string({
      required_error: "Please select a payment processor",
    })
    .min(1, "Please select a payment processor"),
  cardHolderName: z
    .string()
    .min(1, "Card holder name is required")
    .max(100, "Maximum 100 characters"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine(
      (value) => {
        // Remove spaces for validation
        const digitsOnly = value.replace(/\s/g, "");
        return /^[0-9]{13,19}$/.test(digitsOnly);
      },
      {
        message: "Please enter a valid card number",
      }
    ),
  expirationDate: z
    .string()
    .min(1, "Expiry date is required")
    .refine((value) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value), {
      message: "Please enter a valid expiry date (MM/YY)",
    }),
  cardVerificationCode: z
    .string()
    .min(1, "CVC is required")
    .refine((value) => /^[0-9]{3,4}$/.test(value), {
      message: "Please enter a valid CVC code (3-4 digits)",
    }),
  serviceTypeId: z
    .string({
      required_error: "Please select a service type",
    })
    .min(1, "Please select a service type"),
  serviceLevelId: z
    .string({
      required_error: "Please select a service level",
    })
    .min(1, "Please select a service level"),
});

type OrderChargeFormValues = z.infer<typeof PaymentFormSchema>;

type PaymentFormProps = {
  refetch: () => void;
  buttonText?: string;
  caseId: any;
  caseInfo: CaseInfo;
  serviceTypes: ServiceType[];
  serviceLevels: ServiceLevel[];
};

export function OrderChargeForm({
  refetch,
  buttonText = "Charge Customer",
  caseId,
  caseInfo,
  serviceTypes,
  serviceLevels,
}: PaymentFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processors, setProcessors] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<
    AdditionalService[]
  >([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [selectedServiceLevel, setSelectedServiceLevel] = useState<string>("");
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: string[];
  }>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [formValues, setFormValues] = useState<OrderChargeFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const refreshStatuses = useAdminStore((state) => state.refreshStatuses);

  const form = useForm<OrderChargeFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      processor: "",
      cardNumber: "",
      cardHolderName: "",
      expirationDate: "",
      cardVerificationCode: "",
      serviceTypeId: "",
      serviceLevelId: "",
    },
  });

  const selectedProcessor = form.watch("processor");

  const isSubmitting = form.formState.isSubmitting;

  // Calculate total price
  const calculateTotalPrice = () => {
    // Find the selected service level
    const serviceLevel = serviceLevels.find(
      (level) => level._id === selectedServiceLevel
    );

    if (!serviceLevel) return 0;

    // Calculate service level price (sum of all fees)
    let total =
      Number.parseFloat(serviceLevel.price || "0") +
      Number.parseFloat(serviceLevel.nonRefundableFee || "0") +
      Number.parseFloat(serviceLevel.inboundFee || "0") +
      Number.parseFloat(serviceLevel.outboundFee || "0");

    // Add additional services prices
    Object.keys(selectedAdditionalServices).forEach((serviceId) => {
      if (selectedAdditionalServices[serviceId]) {
        const service = additionalServices.find((s) => s._id === serviceId);
        if (service) {
          total += service.price;

          // Add addon prices
          const addons = selectedAddons[serviceId] || [];
          addons.forEach((addonId) => {
            const addon = service.addons.find((a) => a._id === addonId);
            if (addon) {
              total += addon.price;
            }
          });
        }
      }
    });

    return total;
  };

  // Get price breakdown
  const getPriceBreakdown = () => {
    const breakdown: { label: string; price: number }[] = [];

    // Find the selected service level
    const serviceLevel = serviceLevels.find(
      (level) => level._id === selectedServiceLevel
    );

    if (serviceLevel) {
      if (Number.parseFloat(serviceLevel.price) > 0) {
        breakdown.push({
          label: `${serviceLevel.serviceLevel} Base Price`,
          price: Number.parseFloat(serviceLevel.price),
        });
      }

      if (Number.parseFloat(serviceLevel.nonRefundableFee) > 0) {
        breakdown.push({
          label: "Non-Refundable Fee",
          price: Number.parseFloat(serviceLevel.nonRefundableFee),
        });
      }

      if (Number.parseFloat(serviceLevel.inboundFee) > 0) {
        breakdown.push({
          label: "Inbound Shipping Fee",
          price: Number.parseFloat(serviceLevel.inboundFee),
        });
      }

      if (Number.parseFloat(serviceLevel.outboundFee) > 0) {
        breakdown.push({
          label: "Outbound Shipping Fee",
          price: Number.parseFloat(serviceLevel.outboundFee),
        });
      }
    }

    // Add additional services
    Object.keys(selectedAdditionalServices).forEach((serviceId) => {
      if (selectedAdditionalServices[serviceId]) {
        const service = additionalServices.find((s) => s._id === serviceId);
        if (service) {
          breakdown.push({
            label: service.title,
            price: service.price,
          });

          // Add addon prices
          const addons = selectedAddons[serviceId] || [];
          addons.forEach((addonId) => {
            const addon = service.addons.find((a) => a._id === addonId);
            if (addon) {
              breakdown.push({
                label: `- ${addon.subTitle}`,
                price: addon.price,
              });
            }
          });
        }
      }
    });

    return breakdown;
  };

  const fetchAdditionalServices = async () => {
    try {
      const response = await additionalService.getAll();
      setAdditionalServices(response.data);
    } catch (error) {
      console.error("Error fetching additional services:", error);
    }
  };

  async function onSubmit(values: OrderChargeFormValues) {
    setFormValues(values);
    setIsConfirmDialogOpen(true);
  }

  async function finalSubmit() {
    if (!formValues) return;
    setLoading(true);

    try {
      // Prepare additional services data
      const additionalServicesData = Object.keys(selectedAdditionalServices)
        .filter((serviceId) => selectedAdditionalServices[serviceId])
        .map((serviceId) => ({
          service: serviceId,
          addons: selectedAddons[serviceId] || [],
        }));

      // Combine all data
      const paymentData = {
        processor: formValues.processor,
        serviceType: formValues.serviceTypeId,
        serviceLevel: formValues.serviceLevelId,
        additionalServices: additionalServicesData,
        billingInfo: {
          cardHolderName: formValues.cardHolderName,
          cardNumber: formValues.cardNumber.replace(/\s/g, "").trim(),
          expirationDate: formValues.expirationDate,
          cardVerificationCode: formValues.cardVerificationCode,
        },
      };

      const response = await caseApi.chargeForOrderManually(
        caseId,
        paymentData
      );

      if (!response.success) throw new Error(response.message);

      setIsDialogOpen(false);
      setIsConfirmDialogOpen(false);
      refetch();
      toast.success("Charged client successfully");
      refreshStatuses();
    } catch (error: any) {
      setIsConfirmDialogOpen(false);
      setFailureMessage(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle and restrict input to numbers only
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only numbers, backspace, delete, tab, arrows, home, end
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      ".",
      "Period",
    ];

    // Allow decimal point for amount field
    if (
      e.currentTarget.id === "amount" &&
      (e.key === "." || e.key === "Period")
    ) {
      return;
    }

    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Function to prevent pasting non-numeric content
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    isCardNumber = false
  ) => {
    const pastedData = e.clipboardData.getData("text");
    const fieldId = e.currentTarget.id;

    if (fieldId === "amount") {
      // For amount field, allow only numbers and one decimal point
      if (
        !/^[\d.]+$/.test(pastedData) ||
        (pastedData.includes(".") && pastedData.split(".").length > 2)
      ) {
        e.preventDefault();
      }
    } else if (isCardNumber) {
      // For card number, allow only numbers (spaces will be handled in onChange)
      if (!/^\d[\d\s]*$/.test(pastedData)) {
        e.preventDefault();
      }
    } else {
      // For other numeric fields, allow only numbers
      if (!/^\d+$/.test(pastedData)) {
        e.preventDefault();
      }
    }
  };

  // Handler for getting all processors
  const fetchProcessorIds = async () => {
    const response = await processorApi.GetAllProcessorId();
    setProcessors(response?.data);
  };

  // Initialize form with case info
  useEffect(() => {
    if (caseInfo) {
      // Set default service type and level
      if (caseInfo.serviceType && caseInfo.serviceType._id) {
        setSelectedServiceType(caseInfo.serviceType._id);
        form.setValue("serviceTypeId", caseInfo.serviceType._id);
      }

      if (caseInfo.serviceLevel && caseInfo.serviceLevel._id) {
        setSelectedServiceLevel(caseInfo.serviceLevel._id);
        form.setValue("serviceLevelId", caseInfo.serviceLevel._id);
      }

      // Set additional services
      if (
        caseInfo.additionalServices &&
        caseInfo.additionalServices.length > 0
      ) {
        const servicesObj: { [key: string]: boolean } = {};
        const addonsObj: { [key: string]: string[] } = {};

        caseInfo.additionalServices.forEach((item) => {
          servicesObj[item.service?._id] = true;
          addonsObj[item.service?._id] = item.addons;
        });
        setSelectedAdditionalServices(servicesObj);
        setSelectedAddons(addonsObj);
      }
    }
  }, [caseInfo, form]);

  // Handler for the payment processor
  useEffect(() => {
    fetchProcessorIds();
    fetchAdditionalServices();
  }, []);

  // Filter service levels based on selected service type
  const filteredServiceLevels = serviceLevels.filter(
    (level) =>
      (!selectedServiceType ||
        level.serviceTypes.includes(selectedServiceType)) &&
      level.isActive
  );

  // Filter additional services based on selected service type
  const filteredAdditionalServices = additionalServices.filter(
    (service) =>
      (!selectedServiceType ||
        service.serviceTypes.some((s) => s._id === selectedServiceType)) &&
      service.isActive
  );

  // Handle service type change
  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
    form.setValue("serviceTypeId", value);

    // Clear service level if it's not compatible with the new service type
    const isServiceLevelCompatible = serviceLevels.some(
      (level) =>
        level._id === selectedServiceLevel && level.serviceTypes.includes(value)
    );

    if (!isServiceLevelCompatible) {
      setSelectedServiceLevel("");
      form.setValue("serviceLevelId", "");
    }

    // Clear additional services that are not compatible with the new service type
    const newSelectedServices = { ...selectedAdditionalServices };
    const newSelectedAddons = { ...selectedAddons };

    Object.keys(newSelectedServices).forEach((serviceId) => {
      const service = additionalServices.find((s) => s._id === serviceId);
      if (service && !service.serviceTypes.some((s) => s._id === value)) {
        newSelectedServices[serviceId] = false;
        delete newSelectedAddons[serviceId];
      }
    });

    setSelectedAdditionalServices(newSelectedServices);
    setSelectedAddons(newSelectedAddons);
  };

  return (
    <>
      <Dialog
        open={!!failureMessage}
        onOpenChange={() => setFailureMessage("")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Failed</DialogTitle>
          </DialogHeader>
          <span className="text-center text-lg font-semibold text-slate-600">
            Sorry. There was an error while processing this payment.
          </span>
          <div className=" w-full rounded-lg bg-red-100 p-4 text-center shadow">
            <span className="block text-lg font-bold text-red-600">
              {failureMessage}
            </span>
          </div>
          <DialogFooter>
            <Button onClick={() => setFailureMessage("")}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(bool) => {
          if (!bool) {
            form.setValue("cardHolderName", "");
            form.setValue("cardNumber", "");
            form.setValue("expirationDate", "");
            form.setValue("cardVerificationCode", "");
            form.setValue("processor", "");
            setSelectedAdditionalServices({});
            setSelectedAddons({});
            refetch();
          }
          setIsDialogOpen(bool);
        }}
      >
        <DialogTrigger asChild>
          <Button className="w-44 mx-auto" size="sm">
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Charge For Order</DialogTitle>
            <DialogDescription>
              Select services and enter payment details to process a customer
              charge.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 py-2">
                {/* Service Selection Section */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-4">Service Selection</h3>

                  {/* Service Type */}
                  <FormField
                    control={form.control}
                    name="serviceTypeId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 mb-4">
                        <FormLabel className="sm:text-right">
                          Service Type
                        </FormLabel>
                        <div className="col-span-1 sm:col-span-3">
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleServiceTypeChange(value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceTypes.map((type) => (
                                <SelectItem key={type._id} value={type._id}>
                                  {type.serviceType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Service Level */}
                  <FormField
                    control={form.control}
                    name="serviceLevelId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 mb-4">
                        <FormLabel className="sm:text-right">
                          Service Level
                        </FormLabel>
                        <div className="col-span-1 sm:col-span-3">
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedServiceLevel(value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={!selectedServiceType}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredServiceLevels.map((level) => {
                                // Calculate total price for this level
                                const basePrice =
                                  Number.parseFloat(level.price || "0") +
                                  Number.parseFloat(
                                    level.nonRefundableFee || "0"
                                  );
                                const shippingFee =
                                  Number.parseFloat(level.inboundFee || "0") +
                                  Number.parseFloat(level.outboundFee || "0");

                                return (
                                  <SelectItem key={level._id} value={level._id}>
                                    {level.serviceLevel} ($
                                    {basePrice.toFixed(2)} + $
                                    {shippingFee.toFixed(2)} shipping)
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Additional Services */}
                  {filteredAdditionalServices.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Additional Services</h4>
                      <div className="space-y-2">
                        {filteredAdditionalServices.map((service) => (
                          <Accordion
                            type="single"
                            collapsible
                            className="border rounded-md"
                            key={service._id}
                          >
                            <AccordionItem value={service._id}>
                              <div className="flex items-center px-4 py-2">
                                <Checkbox
                                  id={`service-${service._id}`}
                                  checked={
                                    selectedAdditionalServices[service._id] ||
                                    false
                                  }
                                  onCheckedChange={(checked) => {
                                    setSelectedAdditionalServices({
                                      ...selectedAdditionalServices,
                                      [service._id]: !!checked,
                                    });

                                    // Clear addons if service is unchecked
                                    if (!checked) {
                                      const newAddons = { ...selectedAddons };
                                      delete newAddons[service._id];
                                      setSelectedAddons(newAddons);
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <label
                                  htmlFor={`service-${service._id}`}
                                  className="flex-1 font-medium cursor-pointer"
                                >
                                  {service.title} (${service.price.toFixed(2)})
                                </label>
                                <AccordionTrigger className="ml-auto" />
                              </div>
                              <AccordionContent className="px-4 pb-2">
                                {service.addons.length > 0 ? (
                                  <div className="pl-6 space-y-2 mt-2">
                                    {service.addons.map((addon) => (
                                      <div
                                        key={addon._id}
                                        className="flex items-center"
                                      >
                                        <Checkbox
                                          id={`addon-${addon._id}`}
                                          checked={
                                            selectedAddons[
                                              service._id
                                            ]?.includes(addon._id) || false
                                          }
                                          onCheckedChange={(checked) => {
                                            const currentAddons =
                                              selectedAddons[service._id] || [];
                                            let newAddons;

                                            if (checked) {
                                              newAddons = [
                                                ...currentAddons,
                                                addon._id,
                                              ];
                                            } else {
                                              newAddons = currentAddons.filter(
                                                (id) => id !== addon._id
                                              );
                                            }

                                            setSelectedAddons({
                                              ...selectedAddons,
                                              [service._id]: newAddons,
                                            });
                                          }}
                                          disabled={
                                            !selectedAdditionalServices[
                                              service._id
                                            ]
                                          }
                                          className="mr-2"
                                        />
                                        <label
                                          htmlFor={`addon-${addon._id}`}
                                          className="flex-1 cursor-pointer"
                                        >
                                          {addon.subTitle} ($
                                          {addon.price.toFixed(2)})
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground pl-6">
                                    No add-ons available for this service.
                                  </p>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Order Total:</h3>
                    <div className="flex items-center">
                      <span className="font-bold text-lg">
                        ${calculateTotalPrice().toFixed(2)}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-1"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Price breakdown</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Price Breakdown</h4>
                            <div className="space-y-1">
                              {getPriceBreakdown().map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span
                                    className={
                                      item.label.startsWith("-") ? "pl-4" : ""
                                    }
                                  >
                                    {item.label}
                                  </span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t pt-1 mt-1">
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>
                                    ${calculateTotalPrice().toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Payment Processor */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-4">Payment Information</h3>
                  <FormField
                    control={form.control}
                    name="processor"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <FormLabel className="sm:text-right">
                          Processor
                        </FormLabel>
                        <div className="col-span-1 sm:col-span-3">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={selectedProcessor}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a processor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-40">
                              {processors?.map((prs) => (
                                <SelectItem
                                  className={`${selectedProcessor === prs?._id ? "bg-green-400" : ""}`}
                                  key={prs?._id}
                                  value={prs?._id}
                                >
                                  {prs?.processorName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Credit Card Details */}
                <div className="pt-2">
                  <h3 className="font-medium mb-4">Credit Card Details</h3>
                  {/* Card Holder Name */}
                  <FormField
                    control={form.control}
                    name="cardHolderName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 mb-4">
                        <FormLabel className="sm:text-right">
                          Card Holder Name
                        </FormLabel>
                        <div className="col-span-1 sm:col-span-3">
                          <FormControl>
                            <Input
                              id="cardHolderName"
                              placeholder="John Doe"
                              max={100}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Card Number */}
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 mb-4">
                        <FormLabel className="sm:text-right">
                          CC Number
                        </FormLabel>
                        <div className="col-span-1 sm:col-span-3">
                          <FormControl>
                            <Input
                              id="cardNumber"
                              inputMode="numeric"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              {...field}
                              onChange={(e) => {
                                // Allow only digits
                                let value = e.target.value.replace(
                                  /[^\d\s]/g,
                                  ""
                                );

                                // Format card number with spaces
                                if (value.length > 0) {
                                  // Remove all spaces first
                                  value = value.replace(/\s/g, "");
                                  // Then add spaces every 4 digits
                                  value =
                                    value.match(/.{1,4}/g)?.join(" ") || "";
                                }

                                field.onChange(value);
                              }}
                              onKeyDown={handleNumericInput}
                              onPaste={(e) => handlePaste(e, true)}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem className="col-span-1 sm:col-span-2 grid grid-cols-2 items-center gap-2">
                          <FormLabel className="sm:text-right">
                            Expiry Date
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                id="expirationDate"
                                inputMode="numeric"
                                placeholder="MM/YY"
                                maxLength={5}
                                {...field}
                                onChange={(e) => {
                                  // Format expiry date - allow only numbers
                                  let value = e.target.value.replace(
                                    /[^\d/]/g,
                                    ""
                                  );

                                  // Handle the slash formatting
                                  const digitsOnly = value.replace(/\D/g, "");
                                  if (digitsOnly.length > 0) {
                                    if (digitsOnly.length > 2) {
                                      value =
                                        digitsOnly.slice(0, 2) +
                                        "/" +
                                        digitsOnly.slice(2, 4);
                                    } else {
                                      value = digitsOnly;
                                    }
                                  }

                                  field.onChange(value);
                                }}
                                onKeyDown={handleNumericInput}
                                onPaste={(e) => handlePaste(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardVerificationCode"
                      render={({ field }) => (
                        <FormItem className="col-span-1 sm:col-span-2 grid grid-cols-2 items-center gap-2">
                          <FormLabel className="sm:text-right">CVC</FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                id="cardVerificationCode"
                                inputMode="numeric"
                                placeholder="123"
                                maxLength={4}
                                {...field}
                                onChange={(e) => {
                                  // Only allow numbers
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                                onKeyDown={handleNumericInput}
                                onPaste={(e) => handlePaste(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  {isSubmitting ? "Processing..." : "Process Payment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process this payment for $
              {calculateTotalPrice().toFixed(2)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-40 overflow-y-auto my-2 border rounded-md p-3">
            <h4 className="font-medium mb-2">Order Summary</h4>
            {getPriceBreakdown().map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span className={item.label.startsWith("-") ? "pl-4" : ""}>
                  {item.label}
                </span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={finalSubmit}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default OrderChargeForm;
