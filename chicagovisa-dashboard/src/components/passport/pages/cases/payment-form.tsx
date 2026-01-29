"use client";

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
import { Loader2 } from "lucide-react";
import { processorApi } from "@/services/end-points/end-point";
import { toast } from "sonner";

// Define the payment form schema
const PaymentFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(100000, "Amount must be less than 100,000"),
  processor: z.string({
    required_error: "Please select a payment processor",
  }),
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
  expiry: z
    .string()
    .min(1, "Expiry date is required")
    .refine((value) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value), {
      message: "Please enter a valid expiry date (MM/YY)",
    }),
  cvc: z
    .string()
    .min(1, "CVC is required")
    .refine((value) => /^[0-9]{3,4}$/.test(value), {
      message: "Please enter a valid CVC code (3-4 digits)",
    }),
});

type PaymentFormValues = z.infer<typeof PaymentFormSchema>;

type PaymentFormProps = {
  refetch: () => void;
  buttonText?: string;
  billingInfo: any;
  caseId: any;
};

export function PaymentForm({
  refetch,
  buttonText = "Charge Customer",
  billingInfo,
  caseId,
}: PaymentFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processors, setProcessors] = useState<any[]>([]);
  const [activeProcessor, setActiveProcessor] = useState<string>("");

  // Format expiry date from caseDetails
  const formatExpiryDate = (expirationDate: string) => {
    if (!expirationDate || expirationDate.length < 4) return "";

    // Extract month and year from expirationDate (format "MMYY")
    const month = expirationDate.substring(0, 2);
    const year = expirationDate.substring(2, 4);

    return `${month}/${year}`;
  };

  // Format card number with spaces
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "";

    // Remove existing spaces
    const digitsOnly = cardNumber.replace(/\s/g, "");

    // Add spaces every 4 digits
    return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Get CVC from caseDetails (assuming it's stored as cvv)
  const getCVC = (caseDetails: any) => {
    if (billingInfo.cardVerificationCode) {
      return billingInfo.cardVerificationCode;
    }
    return "";
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      processor: "",
      // Set default values from caseDetails if available
      cardNumber: billingInfo?.cardNumber
        ? formatCardNumber(billingInfo.cardNumber)
        : "",
      expiry: billingInfo?.expirationDate
        ? formatExpiryDate(billingInfo.expirationDate)
        : "",
      cvc: getCVC(billingInfo.cardVerificationCode),
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PaymentFormValues) {
    // Format the card number for display
    try {
      const formattedValues = {
        ...values,
        cardNumber: values.cardNumber
          .replace(/\s/g, "")
          .replace(/(\d{4})/g, "$1 ")
          .trim(),
      };
      const response = await processorApi.chargeCustomerManually(
        formattedValues,
        caseId
      );
      if (!response.success) throw new Error(response.message);
      setIsDialogOpen(false);
      refetch();
      toast.success("Charged client for $" + values.amount, {
        description: `Payment has been processed successfully`,
        duration: 7000,
      });
    } catch (error: any) {
      toast.error("Payment Failed", {
        description: error?.response?.data?.message || "Something went wrong",
        duration: 7000,
      });
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

  //handler for getting all processor
  const fetchProcessorIds = async () => {
    const response = await processorApi.GetAllProcessorId();
    setProcessors(response?.data);
  };
  // get active procesoor
  const fetchActiveProcessor = async () => {
    const response = await processorApi.getActiveProcessor(caseId);
    setActiveProcessor(response.data.paymentProcessor);

    // Updating the form value
    form.setValue("processor", response.data.paymentProcessor);
  };

  //handler for the payment processor
  useEffect(() => {
    fetchProcessorIds();
    fetchActiveProcessor();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-44 mx-auto" size="sm">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Charge Customer</DialogTitle>
          <DialogDescription>
            Enter payment details to process a customer charge.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-2">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">Description</FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          id="description"
                          placeholder="Payment description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">Amount</FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <FormControl>
                        <Input
                          id="amount"
                          inputMode="decimal"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers and one decimal point
                            const sanitizedValue = value.replace(/[^\d.]/g, "");

                            // Ensure only one decimal point
                            const parts = sanitizedValue.split(".");
                            const formattedValue =
                              parts.length > 2
                                ? `${parts[0]}.${parts.slice(1).join("")}`
                                : sanitizedValue;

                            e.target.value = formattedValue;

                            if (formattedValue === "") {
                              field.onChange(undefined);
                            } else {
                              field.onChange(parseFloat(formattedValue));
                            }
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

              {/* Payment Processor */}
              <FormField
                control={form.control}
                name="processor"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">Processor</FormLabel>
                    <div className="col-span-1 sm:col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={activeProcessor}
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
                              className={`${activeProcessor === prs?._id ? "bg-green-400" : ""}`}
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

              {/* Credit Card Details */}
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-4">Credit Card Details</h3>

                {/* Card Number */}
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 mb-4">
                      <FormLabel className="sm:text-right">CC Number</FormLabel>
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
                                  value
                                    .match(new RegExp(".{1,4}", "g"))
                                    ?.join(" ") || "";
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
                    name="expiry"
                    render={({ field }) => (
                      <FormItem className="col-span-1 sm:col-span-2 grid grid-cols-2 items-center gap-2">
                        <FormLabel className="sm:text-right">
                          Expiry Date
                        </FormLabel>
                        <div>
                          <FormControl>
                            <Input
                              id="expiry"
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
                    name="cvc"
                    render={({ field }) => (
                      <FormItem className="col-span-1 sm:col-span-2 grid grid-cols-2 items-center gap-2">
                        <FormLabel className="sm:text-right">CVC</FormLabel>
                        <div>
                          <FormControl>
                            <Input
                              id="cvc"
                              inputMode="numeric"
                              placeholder="123"
                              maxLength={4}
                              {...field}
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/\D/g, "");
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
  );
}

export default PaymentForm;
