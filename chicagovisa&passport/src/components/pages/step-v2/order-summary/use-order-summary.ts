import { FormEvent, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { useCaseStore } from "@/store/use-case-store";
import { useDataStore } from "@/store/use-data-store";
import useHydration from "@/hooks/use-hydration";
import { getCurrentDateInDC } from "@/lib/date";
import { generalFetchApi } from "@/lib/endpoints/endpoint";

export const useOrderSummary = () => {
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
            if (promo || discountedAmount !== 0) {
                setPromo(null);
                setDiscountedAmount(0);
            }
        }
    }, [generalFormData?.appliedPromo, formData, serviceLevel]);
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
            } catch (error) { }
        };

        if (isHydrated) {
            fetchServiceType();
            fetchServiceLevel();
        }
        fetchOnlineProcessingFee();
    }, [generalFormData.serviceType, generalFormData.serviceLevel, isHydrated]);

    useEffect(() => {
        setServiceLevelTotal(calculateServiceLevelTotal());
    }, [serviceLevel, formData?.applications?.length]);
    useEffect(() => {
        setServiceLevel(
            storeServiceLevels?.find((s) => s?._id === generalFormData?.serviceLevel)
        );
    }, [generalFormData?.serviceLevel, storeServiceLevels]);

    // Consular fees state and logic
    const [consularFees, setConsularFees] = useState<any[]>([]);
    const [isLoadingConsularFees, setIsLoadingConsularFees] = useState(false);

    // Fetch consular fees when country pair changes
    useEffect(() => {
        const fetchConsularFees = async () => {
            const fromCountry = generalFormData?.citizenOf;
            const toCountry = generalFormData?.travelingTo;

            if (!fromCountry || !toCountry) {
                setConsularFees([]);
                return;
            }

            setIsLoadingConsularFees(true);
            try {
                const response = await generalFetchApi.getConsularFees({
                    fromCountryCode: fromCountry,
                    toCountryCode: toCountry,
                });

                if (response?.success && response?.data) {
                    setConsularFees(response.data);
                } else {
                    setConsularFees([]);
                }
            } catch (error) {
                console.error("Error fetching consular fees:", error);
                setConsularFees([]);
            } finally {
                setIsLoadingConsularFees(false);
            }
        };

        fetchConsularFees();
    }, [generalFormData?.citizenOf, generalFormData?.travelingTo]);

    // Get consular fee for selected service level and service type
    const consularFee = useMemo(() => {
        const serviceLevelId = generalFormData?.serviceLevel;
        const serviceTypeId = generalFormData?.serviceType;
        if (!serviceLevelId || !serviceTypeId || consularFees.length === 0)
            return null;

        const fee = consularFees.find((f: any) => {
            const feeServiceLevelId =
                typeof f.serviceLevelId === "object"
                    ? f.serviceLevelId._id
                    : f.serviceLevelId;
            const feeServiceTypeId =
                typeof f.serviceTypeId === "object"
                    ? f.serviceTypeId._id
                    : f.serviceTypeId;
            return (
                feeServiceLevelId === serviceLevelId &&
                feeServiceTypeId === serviceTypeId
            );
        });

        return fee?.fee ?? null;
    }, [
        consularFees,
        generalFormData?.serviceLevel,
        generalFormData?.serviceType,
    ]);

    const removePromoCode = () => {
        setPromo(null);
        setCode("");
        setDiscountedAmount(0);
        setGeneralFormData({
            ...generalFormData,
            appliedPromo: null,
        });
    };

    // Calculate consular fee total (per application)
    const consularFeeTotal = consularFee ?? 0;

    const totalAmount =
        serviceLevelTotal + additionalServiceTotal + consularFeeTotal - discountedAmount;

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

    return {
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
    };
};
