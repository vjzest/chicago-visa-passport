"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import { useCaseStore } from "@/store/use-case-store";
import { Badge } from "@/components/ui/badge";
import { useDataStore } from "@/store/use-data-store";
import { Asterisk, Dot } from "lucide-react";
import useHydration from "@/hooks/use-hydration";
import { getCurrentDateInDC } from "@/lib/date";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export default function OrderSummary() {
  const { storeServiceTypes, storeServiceLevels, storeAdditionalServices } =
    useDataStore((state) => state);
  const isHydrated = useHydration();
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<any>(null);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceType, setServiceType] = useState<any>(null);
  const [serviceLevel, setServiceLevel] = useState<any>(null);
  const [serviceLevelTotal, setServiceLevelTotal] = useState(0);
  const [additionalServiceTotal, setAdditionalServiceTotal] = useState(0);
  const [govFee, setGovFee] = useState<number | "">("");
  const [openPromoInput, setOpenPromoInput] = useState(false);
  const { generalFormData, setGeneralFormData, formData } = useCaseStore(
    (state) => state
  );
  const [onlineProcessingFee, setOnlineProcessingFee] = useState(0);
  const { additionalServices, addons } = generalFormData as {
    additionalServices: { _id: string; title: string; price: number }[];
    addons: { [key: string]: { _id: string; title: string; price: number }[] };
  };

  const handleApplyPromoCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Invalid promo code", {
        position: "top-center",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/common/promo/${code}`);
      const promoData = response.data.data;

      // Check if the promo code is active
      if (!promoData.isActive) {
        toast.error("This promo code is not active", {
          position: "top-center",
        });
        return;
      }
      //PENDING show promo amount
      // Check if the current date is within the valid date range
      const startDay = new Date(response?.data.startDate).setHours(0, 0, 0);
      const endDay = new Date(response?.data.endDate).setHours(23, 59, 59);
      const currentDay = getCurrentDateInDC().setHours(0, 0, 0);
      if (endDay < currentDay || startDay > currentDay) {
        toast.error("Invalid Promo Code", {
          position: "top-center",
        });
      }

      // Calculate the total amount to which the promo code will be applied
      const serviceLevelTotal = calculateServiceLevelTotal();

      // Check if the total amount is within the valid range for the promo
      if (
        serviceLevelTotal < promoData.min ||
        serviceLevelTotal > promoData.max
      ) {
        toast.error(
          `This promo code is only valid for Speed of Service fees between $${promoData.min} and $${promoData.max}`,
          {
            position: "top-center",
          }
        );
        return;
      }

      // Calculate the discount amount
      let discountAmount = 0;
      if (promoData?.codeType === "flat") {
        discountAmount = promoData.discount;
      } else if (promoData?.codeType === "off") {
      } else if (promoData?.codeType === "off") {
        discountAmount = (serviceLevelTotal * promoData.discount) / 100;
      }

      // Ensure the discount doesn't exceed the Speed of Service total
      discountAmount = Math.min(discountAmount, serviceLevelTotal);

      setDiscountedAmount(discountAmount);
      setPromo(promoData);
      setGeneralFormData({
        ...generalFormData,
        appliedPromo: promoData,
      });

      toast.success("Promo code applied successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Error occurred while applying promo code",
        {
          position: "top-center",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateServiceLevelTotal = () => {
    const serviceFee = Number(serviceLevel?.price || "0");
    const processingFee =
      Number(serviceLevel?.inboundFee || "0") +
      Number(serviceLevel?.outboundFee || "0");
    const nonRefundableFee = Number(serviceLevel?.nonRefundableFee || "0");
    return (
      (serviceFee + processingFee + nonRefundableFee) *
      (formData?.applications?.length || 1)
    );
  };

  useEffect(() => {
    if (generalFormData?.appliedPromo) {
      const serviceLevelTotal = calculateServiceLevelTotal();
      let discount = generalFormData?.appliedPromo.discount;
      let discountAmount = 0;
      if (generalFormData?.appliedPromo?.codeType === "flat") {
        discountAmount = discount;
      } else if (generalFormData?.appliedPromo?.codeType === "off") {
        discountAmount =
          ((serviceLevelTotal + additionalServiceTotal) * discount) / 100;
      }

      setDiscountedAmount(discountAmount);
      setPromo(generalFormData?.appliedPromo);
    } else {
      setPromo(null);
      setDiscountedAmount(0);
    }
  }, [generalFormData, formData, serviceLevel]);
  useEffect(() => {
    const servicesTotal = (additionalServices || []).reduce(
      (acc, curr) => acc + curr.price,
      0
    );
    const addonsTotal = Object.entries(addons ?? {}).reduce(
      (acc, [key, value]) =>
        acc + value.reduce((acc, curr) => acc + curr.price, 0),
      0
    );
    setAdditionalServiceTotal(servicesTotal + addonsTotal);
  }, [additionalServices, addons]);

  useEffect(() => {
    const fetchServiceType = () => {
      const serviceType = generalFormData?.serviceType
        ? storeServiceTypes?.find(
            ({ _id }) => _id === generalFormData?.serviceType
          )
        : null;
      setServiceType(serviceType);
    };
    const fetchServiceLevel = () => {
      const serviceLevel = generalFormData?.serviceLevel
        ? storeServiceLevels?.find(
            (s) => s?._id === generalFormData?.serviceLevel
          )
        : null;
      setServiceLevel(serviceLevel);
    };
    const fetchOnlineProcessingFee = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/common/online-processing-fee"
        );
        if (data?.success)
          setOnlineProcessingFee(
            data?.data?.chargeOnlineProcessingFee
              ? Number(data?.data?.onlineProcessingFee)
              : 0
          );
      } catch (error) {}
    };

    if (isHydrated) {
      fetchServiceType();
      fetchServiceLevel();
    }
    fetchOnlineProcessingFee();
  }, [generalFormData.serviceType, generalFormData.serviceLevel, isHydrated]);

  useEffect(() => {
    setServiceLevelTotal(calculateServiceLevelTotal());
  }, [generalFormData, serviceType, serviceLevel, formData]);
  useEffect(() => {
    setServiceLevel(
      storeServiceLevels?.find((s) => s?._id === generalFormData?.serviceLevel)
    );
  }, [serviceLevel, storeServiceLevels]);

  const removePromoCode = () => {
    setPromo(null);
    setCode("");
    setDiscountedAmount(0);
    setGeneralFormData({
      ...generalFormData,
      appliedPromo: null,
    });
  };

  const calculateServiceTotal = () => {
    return (
      (parseFloat(serviceLevel?.price) || 0) +
      (parseFloat(serviceLevel?.inboundFee) || 0) +
      (parseFloat(serviceLevel?.outboundFee) || 0) +
      (parseFloat(serviceLevel?.nonRefundableFee) || 0)
    );
  };

  const totalAmount =
    serviceLevelTotal + additionalServiceTotal - discountedAmount;

  const percentageOfTotal = (totalAmount * onlineProcessingFee) / 100;
  const superTotalAmt = totalAmount + percentageOfTotal;

  useEffect(() => {
    setGeneralFormData({
      ...generalFormData,
      totalAmount: superTotalAmt,
    });
  }, [
    superTotalAmt,
    totalAmount,
    percentageOfTotal,
    serviceLevelTotal,
    discountedAmount,
    additionalServiceTotal,
  ]);
  const { firstName, middleName, lastName } = formData?.applicantInfo || {};
  const fetchGovFee = async () => {
    try {
      const { data } = await axiosInstance.get("/common/gov-fee");
      setGovFee(
        serviceLevel?.silentKey === "passport-card" ? 111.36 : data?.data
      );
    } catch (error) {
      console.error("Error fetching government fee:", error);
    }
  };
  useEffect(() => {
    fetchGovFee();
  }, []);

  const updateFormDataWithLatestDbData = (
    currentFormData: any,
    dbAdditionalServices: any[]
  ): any => {
    if (
      !currentFormData ||
      (!currentFormData?.additionalServices && !currentFormData?.addons)
    )
      return false;
    const selectedServiceIds = new Set(
      currentFormData?.additionalServices?.map((service: any) => service._id)
    );

    // Update selected services with latest data
    const updatedSelectedServices = currentFormData?.additionalServices.map(
      (service: any) => {
        const latestService = dbAdditionalServices?.find(
          (dbService) => dbService?._id === service?._id
        );
        return latestService || service;
      }
    );

    // Clean up addons - remove addons for unselected services
    const updatedSelectedAddons = { ...currentFormData.addons };
    Object.keys(updatedSelectedAddons).forEach((serviceId) => {
      if (!selectedServiceIds.has(serviceId)) {
        delete updatedSelectedAddons[serviceId];
      }
    });

    // Calculate new total amount
    const servicesTotal = updatedSelectedServices.reduce(
      (total: any, service: any) => total + service.price,
      0
    );
    const addonsTotal = Object.values(updatedSelectedAddons).reduce(
      (total, addons: any) =>
        total + addons.reduce((sum: any, addon: any) => sum + addon.price, 0),
      0
    );

    return {
      ...currentFormData,
      additionalServices: updatedSelectedServices,
      addons: updatedSelectedAddons,
      totalAmount: servicesTotal + addonsTotal,
    };
  };

  useEffect(() => {
    const fetchAdditionalServices = async () => {
      try {
        if (storeAdditionalServices) {
          const updatedFormData = updateFormDataWithLatestDbData(
            generalFormData,
            storeAdditionalServices
          );
          if (updatedFormData) {
            setGeneralFormData({
              ...generalFormData,
              additionalServices: updatedFormData?.additionalServices,
              addons: updatedFormData?.addons,
            });
          }
        }
      } catch (error) {
        console.log("error ", error);
      }
    };
    fetchAdditionalServices();
  }, [generalFormData?.serviceType]);

  const promoInputRef = useRef<HTMLInputElement>(null);
  const promoButtonRef = useRef<HTMLButtonElement>(null);

  // Function to handle clicks outside the input and button
  const handleClickOutside = (event: MouseEvent) => {
    if (
      promoInputRef.current &&
      !promoInputRef.current.contains(event.target as Node) &&
      promoButtonRef.current &&
      !promoButtonRef.current.contains(event.target as Node) &&
      !code
    ) {
      setOpenPromoInput(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <Card className="w-full border border-gray-300 bg-slate-50/85 shadow-md">
        <CardHeader className="pb-0 pt-2 md:pt-0">
          <CardTitle className="flex  gap-2 items-center justify-between text-lg font-semibold">
            <div className="flex flex-col">
              <span> Order Summary</span>{" "}
              {serviceType?.serviceType && (
                <span className="font-medium text-base text-wrap">
                  {serviceType?.serviceType} Application
                </span>
              )}
            </div>
            <Image src={IMGS?.Logo} alt="Chicago Passport & Visa Expedite logo" className="w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(firstName || middleName || lastName) && (
            <Badge
              variant="default"
              className=" mb-3 break-all font-medium text-base"
            >
              {firstName || " "} {middleName || " "} {lastName || " "}
            </Badge>
          )}
          {generalFormData?.serviceLevel ? (
            <div className="space-y-2">
              <p className="flex justify-between text-base">
                <span>{serviceLevel?.serviceLevel} :</span>
                <span className="pr-1">
                  ${Number(serviceLevel?.price).toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between text-base">
                <span>Non-Refundable Fee :</span>
                <span className="pr-1">
                  ${Number(serviceLevel?.nonRefundableFee).toFixed(2)}
                </span>
              </p>
              {Number(serviceLevel?.inboundFee) > 0 && (
                <p className="flex justify-between text-base">
                  <span>Inbound Shipping :</span>
                  <span className="pr-1">
                    ${Number(serviceLevel?.inboundFee).toFixed(2)}
                  </span>
                </p>
              )}
              {Number(serviceLevel?.outboundFee) > 0 && (
                <p className="flex justify-between text-base">
                  <span>Outbound Shipping :</span>
                  <span className="pr-1">
                    ${Number(serviceLevel?.outboundFee).toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="flex justify-between text-base">
                <span>No service selected :</span>
                <span className="pr-1">$0.00</span>
              </p>
            </div>
          )}
          {generalFormData?.additionalServices?.length > 0 &&
            additionalServices
              .sort((a, b) =>
                a.title === "Passport Card"
                  ? -1
                  : b.title === "Passport Card"
                    ? 1
                    : 0
              )
              .map((service) => {
                return (
                  <>
                    <div className="flex justify-between text-base mt-1">
                      <span className="">{service.title} :</span>
                      <span className="ml-auto pr-1">
                        $
                        {Number(
                          Number(service.price) +
                            (addons?.[service._id]?.length > 0
                              ? Number(
                                  addons?.[service?._id]?.reduce(
                                    (acc, curr) => (acc += Number(curr.price)),
                                    0
                                  )
                                )
                              : 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </>
                );
              })}{" "}
          {percentageOfTotal ? (
            <p className="flex justify-between text-base pr-1">
              <span>Online Processing Fee </span>
              <span>${percentageOfTotal.toFixed(2)}</span>
            </p>
          ) : (
            <></>
          )}
        </CardContent>
        <div className="flex flex-col border-t border-gray-200 ">
          <div className="mt-1 space-y-2">
            <div className=" px-4 py-2 overflow-hidden">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  {promo?.code && (
                    <span className=" text-green-700 text-base">
                      Promo code {promo?.code}
                    </span>
                  )}
                </div>
                {discountedAmount > 0 && (
                  <span className="pr-1 text-base font-medium">
                    -${discountedAmount.toFixed(2)}
                  </span>
                )}
              </div>
              {promo && (
                <button
                  onClick={removePromoCode}
                  className="text-xs text-gray-500 underline"
                >
                  Remove promo code
                </button>
              )}
              <AnimatePresence>
                {!promo && openPromoInput ? (
                  <motion.form
                    initial={{ y: 100 }}
                    exit={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleApplyPromoCode}
                  >
                    <div className="flex">
                      <input
                        ref={promoInputRef}
                        type="text"
                        id="promo-code"
                        placeholder="Enter promo code"
                        value={code}
                        maxLength={20}
                        disabled={isLoading || !generalFormData.serviceLevel}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full rounded-l border border-gray-300 px-3 py-2 uppercase focus:border-blue-300 focus:outline-none focus:ring"
                      />
                      <button
                        ref={promoButtonRef}
                        // onClick={(e) => e.stopPropagation()}
                        type="submit"
                        className="hover:primary/50 rounded-r bg-primary px-4 py-2 text-white disabled:bg-blue-300"
                        disabled={
                          isLoading ||
                          !generalFormData.serviceLevel ||
                          !code.trim()
                        }
                      >
                        {isLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  !promo && (
                    <motion.button
                      initial={{ y: -100 }}
                      exit={{ y: -100 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        setOpenPromoInput(true);
                      }}
                      className="text-sm w-full font-semibold underline"
                    >
                      Have a promo code?
                    </motion.button>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 pt-2">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-base font-medium">Total Amount</p>
              </div>
              {/* <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p> */}
              <p className="text-2xl mr-2 font-bold">
                ${superTotalAmt?.toFixed(2) || "0.00"}
              </p>
            </div>{" "}
            <div className="flex">
              <Asterisk className="text-slate-500" size={"1rem"} />
              <span className="text-slate-500 text-base text-wrap">
                Not including{" "}
                <span className="font-semibold">
                  {" "}
                  $
                  {Number(
                    serviceType?.silentKey === "passport-card" ? 111.36 : govFee
                  ) +
                    Number(
                      generalFormData.additionalServices?.some(
                        (el: any) => el?.title === "Passport Card"
                      )
                        ? serviceType?.silentKey === "child-passport"
                          ? 15
                          : 30
                        : 0
                    )}
                </span>{" "}
                government fee
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
