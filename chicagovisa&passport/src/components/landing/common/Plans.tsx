import { useDataStore } from "@/store/use-data-store";
import { useCaseStore } from "@/store/use-case-store";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { generalFetchApi } from "@/lib/endpoints/endpoint";

interface ConsularFee {
  _id: string;
  countryPairId: string;
  serviceLevelId: string | { _id: string; serviceLevel: string; time: string };
  serviceTypeId: string | { _id: string; serviceType: string; shortHand: string };
  fee: number;
}

export default function Plans({ isShown }: { isShown: boolean }) {
  const router = useRouter();
  const { storeServiceTypes, storeServiceLevels } = useDataStore(
    (state) => state
  );
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );

  const [serviceLevels, setServiceLevels] = useState<any[]>([]);
  const [filteredServiceLevels, setFilteredServiceLevels] = useState<any[]>([]);
  const [consularFees, setConsularFees] = useState<ConsularFee[]>([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  // Transform service levels from store to component format
  useEffect(() => {
    if (storeServiceLevels?.length > 0) {
      const transformedServiceLevels = storeServiceLevels.map((service: any) => ({
        value: service?._id,
        title: service?.serviceLevel,
        price: service?.price,
        description: service?.serviceLevel,
        time: service?.time,
        serviceTypes: service?.serviceTypes,
        nonRefundableFee: service?.nonRefundableFee,
      }));
      setServiceLevels(transformedServiceLevels);
    }
  }, [storeServiceLevels]);

  // Filter service levels based on selected service type
  useEffect(() => {
    if (generalFormData?.serviceType && serviceLevels?.length > 0) {
      const filtered = serviceLevels.filter((serviceLevel) =>
        serviceLevel?.serviceTypes?.some(
          (serviceType: any) => (serviceType?._id || serviceType) === generalFormData?.serviceType
        )
      );
      setFilteredServiceLevels(filtered);
    } else {
      setFilteredServiceLevels(serviceLevels);
    }
  }, [serviceLevels, generalFormData?.serviceType]);

  // Fetch consular fees when country pair (citizenOf and travelingTo) changes
  useEffect(() => {
    const fetchConsularFees = async () => {
      const fromCountry = generalFormData?.citizenOf;
      const toCountry = generalFormData?.travelingTo;

      if (!fromCountry || !toCountry) {
        setConsularFees([]);
        return;
      }

      setIsLoadingFees(true);
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
        setIsLoadingFees(false);
      }
    };

    fetchConsularFees();
  }, [generalFormData?.citizenOf, generalFormData?.travelingTo]);

  // Create a map of consular fees for easy lookup by serviceLevelId + serviceTypeId
  const consularFeeMap = useMemo(() => {
    const map = new Map<string, number>();
    consularFees.forEach((fee) => {
      const serviceLevelId = typeof fee.serviceLevelId === 'object'
        ? fee.serviceLevelId._id
        : fee.serviceLevelId;
      const serviceTypeId = typeof fee.serviceTypeId === 'object'
        ? fee.serviceTypeId._id
        : fee.serviceTypeId;
      const key = `${serviceLevelId}-${serviceTypeId}`;
      map.set(key, fee.fee);
    });
    return map;
  }, [consularFees]);

  // Get consular fee for a specific service level
  const getConsularFee = (serviceLevelId: string): number | null => {
    const serviceTypeId = generalFormData?.serviceType;
    if (!serviceTypeId) return null;

    const key = `${serviceLevelId}-${serviceTypeId}`;
    return consularFeeMap.get(key) ?? null;
  };

  const handleStartOrder = (serviceValue: string) => {
    // Save the selected service level to store before navigation
    setGeneralFormData({
      ...generalFormData,
      serviceLevel: serviceValue,
    });
    // Check if it's a passport service (CitizenOf US or specific service types if needed)
    // For now, assuming if the user is on the passport flow, they selected it in the hero.
    // Ideally, we check generalFormData.citizenOf === "US" or similar.

    // Simple check: If the current page context or state implies passport.
    // However, Plans component is shared.

    // Better logic: Check if the selected service level belongs to a passport service.
    // But for now, we can check generalFormData.

    if (generalFormData?.citizenOf === 'US') {
      router.push("/us-passport/apply");
    } else {
      router.push("/apply");
    }
  };

  return (
    <div>
      <h3 className="text-[26px] text-center font-semibold mb-[10px]">
        Select Speed of Service
      </h3>

      <p className="max-w-[612px] mx-auto mb-[42px] text-center">
        {`Are you 16 years or older and need a passport for the first time? Or
        your adult passport has expired for more than 5 years? You're on the
        right track!`}
      </p>

      <div>
        {generalFormData?.serviceType && filteredServiceLevels.length > 0 ? (
          <div className="flex justify-center flex-wrap border-b border-[#d3d3e5] pb-[83px] mb-[63px] gap-[32px] max-[1024px]:gap-[20px] max-[767px]:gap-[20px] max-[767px]:pb-[45px] max-[767px]:mb-[40px]">
            {filteredServiceLevels.map((service, index) => {
              const isSelected = generalFormData?.serviceLevel === service.value;
              const isPopular = index === 0; // Make first service "Most Popular"
              const consularFee = getConsularFee(service.value);

              return (
                <div
                  key={service.value}
                  className="relative flex-[0_0_calc(25%_-_24px)] max-w-[calc(25%_-_24px)] max-[1024px]:flex-[0_0_calc(50%_-_10px)] max-[1024px]:max-w-[calc(50%_-_10px)] max-[767px]:flex-[0_0_100%] max-[767px]:max-w-full"
                >
                  {/* Most Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-primary whitespace-nowrap text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => {
                      setGeneralFormData({
                        ...generalFormData,
                        serviceLevel: service.value,
                      });
                    }}
                    className={`h-full bg-[#f8f9fd] shadow-lg flex flex-col justify-between rounded-[15px] p-[38px_22px_23px] max-[767px]:p-[30px_20px_20px] cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-center font-semibold !text-[26px] mb-[5px]">
                        {service.title}
                      </h3>

                      <h4 className="text-center font-semibold text-lg mb-[8px]">
                        {service.time}
                      </h4>

                    </div>

                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartOrder(service.value);
                        }}
                        className="w-full bg-[#be1e2d] border border-[#be1e2d] flex h-[48px] rounded-[10px] justify-center items-center text-white font-medium shadow-[0_20px_20px_rgba(0,0,0,0.25)] mt-[20px] hover:bg-transparent hover:text-[#1c1c1c] transition-colors"
                      >
                        Start Order Now
                      </button>

                      <div className="flex items-center justify-between mt-[16px]">
                        <p className="m-0 text-[14px]">Service Fee</p>
                        <span className="text-[22px] font-semibold text-[#1c1c1c]">
                          ${service.price}
                        </span>
                      </div>

                      {/* Consular Fee */}
                      <div className="flex items-center justify-between mt-[8px]">
                        <p className="m-0 text-[14px]">Consular Fee</p>
                        <span className="text-[18px] font-semibold text-[#1c1c1c]">
                          {isLoadingFees ? (
                            <span className="text-gray-400 text-sm">Loading...</span>
                          ) : consularFee !== null ? (
                            `$${consularFee}`
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </span>
                      </div>

                      {/* Total Estimate (Service Fee + Consular Fee) */}
                      {consularFee !== null && (
                        <div className="flex items-center justify-between mt-[12px] pt-[12px] border-t border-gray-200">
                          <p className="m-0 text-[14px] font-medium">Total Estimate</p>
                          <span className="text-[20px] font-bold text-primary">
                            ${(Number(service.price) + consularFee).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full text-center py-10 border-b border-[#d3d3e5] pb-[83px] mb-[63px]">
            <p className="text-gray-500 text-lg">
              Please select a visa type to view available speed of service
              options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
