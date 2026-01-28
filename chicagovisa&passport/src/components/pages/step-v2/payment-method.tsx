"use client";

import React, { useState, useEffect, Dispatch, FormEvent } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import creditCardType from "credit-card-type";
import { useRouter, usePathname } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, AlertCircle, Lock } from "lucide-react";
import { useCaseStore } from "@/store/use-case-store";
import { toast } from "sonner";
import axiosInstance from "@/lib/config/axios";
import Image from "next/image";
import { IMGS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentSuccessDialog from "./payment-success-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { formatName } from "@/lib/utils";
import { validateData } from "./application-form-section";
import { getUserDeviceInfo } from "@/lib/utils/device-info";
import { isFloat32Array } from "node:util/types";

const cardValidations = {
  "american-express": { cardLength: 15, cvvLength: 4 },
  mastercard: { cardLength: 16, cvvLength: 3 },
  visa: { cardLength: 16, cvvLength: 3 },
  discover: { cardLength: 16, cvvLength: 3 },
  jcb: { cardLength: 16, cvvLength: 3 },
  "diners-club": { cardLength: [14, 16], cvvLength: 3 },
  maestro: { cardLength: 16, cvvLength: 3 },
  rupay: { cardLength: 16, cvvLength: 3 },
};

const formSchema = z.object({
  paymentMethod: z.enum(["card", "nmi"]),
  cardHolderName: z.string().min(1, "Name is required"),
  // cardNumber: z.string().min(1, "Card number is required"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine((value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 14; // Minimum card length
    }, "Card number must be at least 14 digits")
    .refine((value) => {
      const input = value.replace(/\D/g, "");
      const [detected] = creditCardType(input);

      if (detected?.type) {
        const validation =
          cardValidations[detected.type as keyof typeof cardValidations];

        if (validation?.cardLength) {
          const maxLength = Array.isArray(validation.cardLength)
            ? Math.max(...validation.cardLength)
            : validation.cardLength;
          return input.length <= maxLength;
        }
        return true;
      } else {
        return input.length <= 19;
      }
    }, "Invalid Credit Card Number"),
  // expirationDate: z.string().min(1, "Expiry year is required"),
  expirationDate: z
    .string()
    .min(1, "Expiry date is required")
    .refine((value) => {
      // Check if the format is correct (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(value)) {
        return false;
      }

      const [month, year] = value.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);

      // Validate month is between 1 and 12
      if (expMonth < 1 || expMonth > 12) {
        return false;
      }

      // Check if card is expired
      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        return false;
      }

      return true;
    }, "Card has expired or invalid date format"),
  cardVerificationCode: z.string().min(3, "Enter valid CVV"),
});

export function CardsPaymentMethod({
  forms,
  setTriggerSubmit,
  isOfflineLink: isOfflineLinkProp,
}: {
  forms: any;
  formData: any;
  setCurrentStep: (step: IApplySteps) => void;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
  isOfflineLink?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    formData,
    travelPlansOrderFormData,
    generalFormData,
    sourceInfoData,
    accountDetails,
    billingData,
    isOfflineLink: storeIsOfflineLink,
  } = useCaseStore((state) => state);

  const isOfflineLink = isOfflineLinkProp !== undefined ? isOfflineLinkProp : storeIsOfflineLink;
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentTries, setPaymentTries] = useState(0);
  const [paymentFailed, setPaymentFailed] = useState<string | boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [disclaimer, setDisclaimer] = useState("");
  const [tnc, setTnc] = useState({ content: "", verbiage: "" });
  const [openTnc, setOpenTnc] = useState(false);
  const [tncAccepted, setTncAccepted] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] =
    useState<boolean>(false);
  const [cardType, setCardType] = useState("");
  const [inputValue, setInputValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: billingData?.paymentMethod || "card",
      cardHolderName: billingData?.cardHolderName || "",
      cardNumber: billingData?.cardNumber || "",
      expirationDate: billingData?.expirationDate || "",
      cardVerificationCode: billingData?.cardVerificationCode || "",
    },
    shouldFocusError: true,
  });

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length === 4 || input.length === 3) {
      form.clearErrors("cardVerificationCode");
    }
    if (cardType) {
      const validation =
        cardValidations[cardType as keyof typeof cardValidations];
      if (validation) {
        if (input.length <= validation.cvvLength) {
          form.setValue("cardVerificationCode", input);
        }
      }
    } else {
      // If card type is not detected, allow up to 4 digits (maximum possible CVV length)
      if (input.length <= 4) {
        form.setValue("cardVerificationCode", input);
      }
    }
  };

  const handleExpiryField = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d/]/g, "");

    // Handle backspace
    if (e.target.value.length < inputValue.length) {
      if (value.length === 2) {
        value = value.slice(0, 1);
      }
    }

    // Format MM/YY
    if (value.length >= 2) {
      const month = value.slice(0, 2);
      const year = value.slice(2).replace("/", "");
      value = `${month}/${year}`;
    }

    // Limit length
    value = value.slice(0, 5);

    setInputValue(value);
    form.setValue("expirationDate", value);

    // Validation
    if (value.length === 5) {
      const [month, year] = value.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const enteredMonth = parseInt(month);
      const enteredYear = parseInt(year);

      if (
        enteredMonth > 0 &&
        enteredMonth <= 12 &&
        (enteredYear > currentYear ||
          (enteredYear === currentYear && enteredMonth >= currentMonth))
      ) {
        form.clearErrors("expirationDate");
      } else {
        form.setError("expirationDate", {
          type: "manual",
          message: "Card has expired or invalid date format",
        });
      }
    }
  };
  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case "visa":
        return <Image width={40} src={IMGS?.Visa} alt="Visa" />;
      case "mastercard":
        return <Image width={40} src={IMGS?.MsCard} alt="Mastercard" />;
      case "american-express":
        return <Image width={40} src={IMGS?.Amx} alt="American Express" />;
      case "discover":
        return <Image width={40} src={IMGS?.Discover} alt="Discover" />;
      case "jcb":
        return <Image width={40} src={IMGS?.Jcb} alt="JCB" />;
      case "diners-club":
        return <Image width={40} src={IMGS?.DcCard} alt="Diners Club" />;
      case "maestro":
        return <Image width={40} src={IMGS?.MesCard} alt="Maestro" />;
      case "rupay":
        return <Image width={40} src={IMGS?.Rupay} alt="RuPay" />;
      default:
        return <Image width={40} src={IMGS?.Card} alt="Card" />;
    }
  };

  const validateAllTabs = () => {
    // Check if service level is selected
    if (!generalFormData?.serviceLevel) {
      toast.error("Please select a Speed of Service", {
        position: "top-center",
      });
      return false;
    }

    const validationError = validateData(forms, formData, 2);
    if (validationError) {
      document.getElementById("steps-guide-header")?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });

      setTriggerSubmit(0);
    } else {
      return true;
    }
    return false;
  };

  const handleFinalSubmit = async (billingData: z.infer<typeof formSchema>) => {
    let formattedExpiry = (billingData?.expirationDate || "").split("/").join("");

    setIsPaymentProcessing(true);
    try {
      // const registrationToken = localStorage.getItem("registrationToken");
      setPaymentTries((prev) => prev + 1);
      const { data } = await axiosInstance.post(
        "/common/cases",
        {
          ...formData,
          departureDate: generalFormData.departureDate ?? "",
          billingAddress: formData?.isBillingSameAsShipping
            ? formData?.shippingInformation
            : formData?.billingInformation,
          contingentCaseId: localStorage.getItem("contingentcaseid"),
          travelPlansInfo: travelPlansOrderFormData,
          sourceInfo: sourceInfoData,
          billingInfo: useCaseStore.getState().isOfflineLink
            ? undefined
            : { ...billingData, expirationDate: formattedExpiry },
          accountDetails,
          // applicationDetails: {
          //   applicantInfo: formData?.applicantInfo,
          // },
          caseInfo: {
            stateOfResidency: generalFormData?.residingIn,
            serviceLevel: generalFormData?.serviceLevel,
            serviceType: generalFormData?.serviceType,
            fromCountryCode: generalFormData?.citizenOf,
            toCountryCode: generalFormData?.travelingTo,
            additionalServices:
              generalFormData?.additionalServices?.map(
                (service: { _id: string }) => {
                  return {
                    service: service._id,
                    addons:
                      generalFormData?.addons?.[service._id]?.map(
                        (elem: { _id: string }) => elem._id
                      ) || [],
                  };
                }
              ) || [],
          },
          appliedPromo: generalFormData?.appliedPromo,
          deviceInfo: getUserDeviceInfo(),
          isOfflineLink: useCaseStore.getState().isOfflineLink,
          token: useCaseStore.getState().offlinePaymentToken, // Send token for backend verification
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${registrationToken}`,
        //   },
        // }
      );
      if (!data?.success) {
        if (data?.data?.dataRecorded) {
          setOpenConfirmation(false);
          setIsPaymentProcessing(false);
          setPaymentFailed(data?.data?.paymentResponse?.message);
          toast.error("Payment failed");
        } else {
          throw new Error(data?.message);
        }
      }
      sessionStorage.setItem("success", data?.data?.paymentToken);
      sessionStorage.removeItem("registrationToken");
      if (!localStorage.getItem("user_token")) {
        localStorage.setItem("user_token", data?.data?.accessToken);
      }
      localStorage.removeItem("contingentcaseid");
      setOpenConfirmation(false);
      // setCurrentStep("order-confirmation");

      useCaseStore.setState({
        generalFormData: {},
        travelPlansOrderFormData: { hasPlans: false },
        sourceInfoData: {},
        formStatus: {},
        accountDetails: {
          caseId: "",
          fullName: "",
          phone: "",
          email: "",
          emailVerified: false,
          consentToUpdates: true,
        },
        importantData: {
          name: billingData?.cardHolderName,
          email: formData?.contactInformation?.email1 || "",
          caseId: data?.data?._id,
        },
        billingData: {
          paymentMethod: "card",
          cardHolderName: "",
          cardNumber: "",
          expirationDate: "",
          cardVerificationCode: "",
        },
        formData: {},
      });
      if (pathname.includes("us-passport")) {
        router.replace(
          `/us-passport/order-confirmation/${data?.data?.newCase?._id}/${data?.data?.newCase?.caseNo}`
        );
      } else {
        router.replace(
          `/apply/order-confirmation/${data?.data?.newCase?._id}/${data?.data?.newCase?.caseNo}`
        );
      }
    } catch (error: any) {
      if (paymentTries >= 7) {
        router.replace("/apply/payment-failed");
      }
      if (error?.response?.data?.data?.paymentResponse.message) {
        setPaymentFailed(error?.response?.data?.data?.paymentResponse.message);
      }
      if (error?.response?.data?.data?.dataRecorded) {
        setOpenConfirmation(false);
        toast.error("Payment failed");
      } else {
        toast.error(
          error?.response?.data?.message ||
          "some error occurred please check all fields are filed correctly"
        );
      }
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const fetchTnc = async () => {
    try {
      const { data } = await axiosInstance.get("common/terms-and-conditions");
      if (!data?.success) throw new Error(data?.message);
      setTnc(data?.data);
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    }
  };

  const fetchPaymentDisclaimer = async () => {
    try {
      const { data } = await axiosInstance.get("/common/payment-disclaimer");
      if (!data?.success) throw new Error(data?.message);
      setDisclaimer(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchTnc();
    fetchPaymentDisclaimer();
  }, []);

  const submitPaymentForm = async (e: FormEvent) => {
    e.preventDefault();

    // If offline link, skip validation and proceed
    if (useCaseStore.getState().isOfflineLink) {
      setOpenConfirmation(true);
      return;
    }

    const otherTabsSuccess = validateAllTabs();
    form.handleSubmit(() => { });
    const paymentFormSuccess = await form.trigger();
    if (otherTabsSuccess && paymentFormSuccess) {
      setOpenConfirmation(true);
    }
  };

  return (
    <>
      <Dialog open={openConfirmation} onOpenChange={setOpenConfirmation}>
        <DialogContent className="w-60">
          <DialogHeader>
            <DialogTitle className="text-xl">{`Payment Confirmation`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              {disclaimer.replace(
                "{amount}",
                `$${generalFormData?.totalAmount?.toFixed(2)}`
              )}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setOpenConfirmation(false)}
              disabled={isPaymentProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleFinalSubmit(form?.getValues())}
              disabled={isPaymentProcessing}
            >
              {isPaymentProcessing ? (
                <span className="flex gap-3 justify-center items-center">
                  Processing payment
                  <Loader2 className="animate-spin mr-2 size-4" />
                </span>
              ) : (
                "Yes, Confirm Payment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(paymentFailed)}
        onOpenChange={(bool) => setPaymentFailed(bool ? "Failed" : false)}
      >
        <DialogContent className="flex w-4/5 flex-col items-center gap-4 md:w-1/4">
          <Image
            src={IMGS.PaymentFailed}
            height={300}
            width={300}
            className="size-40"
            alt="payment failed"
          />
          <span className="text-center text-lg font-semibold text-slate-600">
            Sorry. There was an error while processing your payment.
          </span>
          <div className=" w-full rounded-lg bg-red-100 p-4 text-center shadow">
            <span className="block text-lg font-bold text-red-600">
              {paymentFailed}
            </span>
          </div>
          <span className="text-wrap text-center text-base text-slate-500">
            Don’t worry, we have saved all your details and our expert will
            reach out to you to help you complete your order. Thank you.
          </span>
          <span className="mt-2 text-center text-sm text-slate-500">
            {Number(paymentFailed) >= 200 && Number(paymentFailed) < 240
              ? "Try checking your payment details and correcting them if needed."
              : "Please try again or use a different card for payment."}
          </span>
          {!(Number(paymentFailed) >= 200 && Number(paymentFailed)) && (
            <Button
              disabled={isPaymentProcessing}
              onClick={() => handleFinalSubmit(form?.getValues())}
              className="mt-4"
            >
              {isPaymentProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  <span>Retrying...</span>
                </div>
              ) : (
                "Retry Payment"
              )}
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          className="mt-0 border border-gray-100 p-6 rounded-md"
          onSubmit={submitPaymentForm}
        >
          {/* <CardHeader className="!mx-0  !px-0  pt-0">
            <CardTitle className="text-xl text-primary">
              Payment Method
            </CardTitle>
            <CardDescription>
              {`Select your preferred payment method.`}
            </CardDescription>
          </CardHeader> */}
          <CardContent className="!mx-0 grid gap-6 !px-0">
            {isOfflineLink ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
                <p className="font-semibold">
                  Offline Payment Link Verified.
                </p>
                <p className="text-sm">
                  You can proceed to complete this order without entering card details.
                </p>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="cardHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Card Holder Name{" "}
                        <span className=" font-normal text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Card Holder Name"
                          {...field}
                          maxLength={100}
                          onChange={(e) => {
                            const formattedValue = formatName(e.target.value, {
                              allowNonConsecutiveSpaces: true,
                              allowUppercaseInBetween: true,
                            });
                            field.onChange(formattedValue);
                            // Trigger validation after the value is set
                            setTimeout(() => form.trigger("cardHolderName"), 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex md:flex-row flex-col-reverse justify-between md:items-center">
                        <FormLabel className="whitespace-nowrap">
                          Credit / Debit Card{" "}
                          <span className=" font-normal text-red-500">*</span>
                        </FormLabel>
                        <div className=" w-full justify-end">
                          <span className="flex gap-2 items-center justify-end">
                            <Image width={70} src={IMGS?.NMISeal} alt="Visa" />
                            <div className="flex items-center gap-1">
                              <Lock
                                size={"1.8rem"}
                                strokeWidth={4}
                                className="text-green-500"
                              />
                              <div className="flex-flex-col text-slate-600">
                                <p className="font-medium">AES-256</p>
                                <p className="-mt-1">Encrypted</p>
                              </div>
                            </div>
                          </span>
                        </div>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <div className="flex items-center rounded border p-2 -mt-2">
                            <CreditCard className="mr-2 " />
                            <Input
                              {...field}
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="w-full rounded-md border-none font-mono"
                              onChange={(e) => {
                                const onlyDigits = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                const [detected] = creditCardType(onlyDigits);

                                if (detected?.type) {
                                  setCardType(detected.type);
                                  const validation =
                                    cardValidations[
                                    detected.type as keyof typeof cardValidations
                                    ];

                                  if (validation?.cardLength) {
                                    const maxLength = Array.isArray(
                                      validation.cardLength
                                    )
                                      ? Math.max(...validation.cardLength)
                                      : validation.cardLength;
                                    if (onlyDigits.length > maxLength) return;
                                  }
                                } else {
                                  setCardType("");
                                  if (onlyDigits.length > 19) return;
                                }

                                field.onChange(onlyDigits);

                                form.trigger("cardNumber");
                              }}
                              value={field.value.replace(/(\d{4})(?=\d)/g, "$1 ")}
                            />
                            {form.watch("cardNumber") ? (
                              <div className="flex w-fit md:w-full justify-end">
                                {getCardTypeIcon(cardType)}
                              </div>
                            ) : (
                              <div className="hidden md:flex w-full justify-end">
                                <span className="flex items-center justify-end gap-1">
                                  <Image width={40} src={IMGS?.Visa} alt="Visa" />
                                  <Image
                                    width={40}
                                    src={IMGS?.MsCard}
                                    alt="Mastercard"
                                  />
                                  <Image
                                    width={40}
                                    src={IMGS?.Amx}
                                    alt="American Express"
                                  />
                                  <Image
                                    width={40}
                                    src={IMGS?.DcCard}
                                    alt="Diners Club"
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                          <FormMessage className="mt-2" />
                          <div className="flex md:hidden w-full justify-end mt-1">
                            <span className="flex items-center justify-end gap-1">
                              <Image width={40} src={IMGS?.Visa} alt="Visa" />
                              <Image
                                width={40}
                                src={IMGS?.MsCard}
                                alt="Mastercard"
                              />
                              <Image
                                width={40}
                                src={IMGS?.Amx}
                                alt="American Express"
                              />
                              <Image
                                width={40}
                                src={IMGS?.DcCard}
                                alt="Diners Club"
                              />
                            </span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Expiration Date{" "}
                          <span className=" font-normal text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM / YY"
                            {...field}
                            onChange={handleExpiryField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardVerificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CVC <span className=" font-normal text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="CVC"
                            {...field}
                            onChange={handleCVVChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

          </CardContent>
          <div className=" mb-2 flex items-center gap-2  text-sm">
            <Checkbox
              onCheckedChange={(bool) =>
                bool ? setTncAccepted(true) : setTncAccepted(false)
              }
              className="size-5"
            />

            <DynamicVerbiage
              verbiage={tnc?.verbiage}
              amount={generalFormData?.totalAmount}
              onOpenTnc={() => setOpenTnc(true)}
            />
          </div>

          <Dialog open={openTnc} onOpenChange={setOpenTnc}>
            <DialogContent>
              <DialogTitle>Terms and conditions</DialogTitle>
              <div className="max-h-[80vh] overflow-y-auto pr-4 md:max-h-[70vh] md:max-w-[60vw]">
                <p
                  dangerouslySetInnerHTML={{ __html: tnc?.content || "" }}
                  className="break-all"
                ></p>
              </div>
              <Button
                onClick={() => setOpenTnc(false)}
                className="mx-auto"
                variant={"outline"}
                size={"sm"}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
          <CardFooter className="!mx-0 !px-0 ">
            {isPaymentProcessing ? (
              <Button className="w-full " disabled>
                Processing payment...
              </Button>
            ) : (
              <Button disabled={!tncAccepted} className="w-full" type="submit">
                {isOfflineLink ? "Complete Order" : `Process my order for $${generalFormData?.totalAmount?.toFixed(2)}`}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
      <PaymentSuccessDialog
        isButtonEnabled={isButtonEnabled}
        isProcessing={isProcessing}
        setIsButtonEnabled={setIsButtonEnabled}
        setIsProcessing={setIsProcessing}
        open={isSuccessModalOpen}
      />
    </>
  );
}

interface DynamicVerbiageProps {
  verbiage: string;
  amount: number;
  onOpenTnc: () => void;
}

export const DynamicVerbiage: React.FC<DynamicVerbiageProps> = ({
  verbiage,
  amount,
  onOpenTnc,
}) => {
  const parseVerbiage = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\{.*?\}|\[.*?\])/);
    return parts.map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const key = part.slice(1, -1);
        if (key === "amount") {
          return (
            <span key={index} className="font-semibold">
              ${amount?.toFixed(2)}
            </span>
          );
        }
        return part;
      } else if (part.startsWith("[") && part.endsWith("]")) {
        const linkText = part.slice(1, -1);
        return (
          <span
            key={index}
            onClick={onOpenTnc}
            className="cursor-pointer font-medium text-primary hover:underline"
          >
            {linkText}
          </span>
        );
      }
      return part;
    });
  };

  return <p className="text-sm text-gray-700">{parseVerbiage(verbiage)}</p>;
};
