"use client";
import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Asterisk } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useOrderSummary } from "./use-order-summary";

export default function OrderSummaryV2() {
  const {
    code,
    setCode,
    promo,
    discountedAmount,
    isLoading,
    serviceType,
    serviceLevel,
    serviceLevelTotal,
    additionalServiceTotal,
    govFee,
    openPromoInput,
    setOpenPromoInput,
    generalFormData,
    onlineProcessingFee,
    additionalServices,
    addons,
    handleApplyPromoCode,
    removePromoCode,
    superTotalAmt,
    firstName,
    middleName,
    lastName,
    consularFee,
    isLoadingConsularFees,
    percentageOfTotal,
  } = useOrderSummary();

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
      <Card className="w-full border  rounded-lg bg-white py-3">
        <CardHeader className="pb-0 pt-2 md:pt-0">
          <CardTitle className="flex  gap-2 items-center justify-between text-lg font-semibold">
            <div className="flex flex-col">
              <span className="whitespace-nowrap"> Order Summary</span>{" "}
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
          <div className="flex flex-col gap-2">
            {generalFormData?.serviceLevel ? (
              <>
                <p className="flex justify-between text-base">
                  <span>{serviceLevel?.serviceLevel} :</span>
                  <span className="pr-1">
                    ${Number(serviceLevel?.price).toFixed(2)}
                  </span>
                </p>

                {/* Consular Fee */}
                <p className="flex justify-between text-base">
                  <span>Consular Fee :</span>
                  <span className="pr-1">
                    {isLoadingConsularFees ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : consularFee !== null ? (
                      `$${Number(consularFee).toFixed(2)}`
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
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
              </>
            ) : (
              <div>
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
                    <div
                      key={service._id}
                      className="flex justify-between text-base"
                    >
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
          </div>
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
