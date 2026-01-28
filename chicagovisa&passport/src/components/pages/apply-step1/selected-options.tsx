// export default SelectedOptions;
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseStore } from "@/store/use-case-store";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDataStore } from "@/store/use-data-store";
import { useRouter } from "next/navigation";

interface SelectedOptionsProps {
  currentStep: IApplySteps;
  setCurrentStep: (step: IApplySteps) => void;
}

const SelectedOptions: React.FC<SelectedOptionsProps> = ({
  currentStep,
  setCurrentStep,
}) => {
  const { storeServiceTypes, storeServiceLevels } = useDataStore(
    (state) => state
  );
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );
  const router = useRouter();
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [serviceLevels, setServiceLevels] = useState<any[]>([]);
  useEffect(() => {
    try {
      (async () => {
        try {
          setServiceLevels(
            storeServiceLevels?.map((service: any) => {
              return {
                value: service?._id,
                title: service?.serviceLevel,
                price: service?.price,
                time: service?.time,
                description: service?.serviceLevel,
                nonRefundableFee: service?.nonRefundableFee,
              };
            })
          );
          setServiceTypes(
            storeServiceTypes?.map((service: any) => {
              return {
                value: service?._id,
                label: service?.serviceType,
                name: service?.serviceType,
                description: service?.description,
              };
            })
          );
        } catch (error) {
          console.log(error);
        }
      })();
    } catch (error) {}
  }, [storeServiceTypes, storeServiceLevels]);

  const selectedServiceType = serviceTypes?.find(
    (service) => service?.value === generalFormData?.serviceType
  );

  const selectedServiceLevel = serviceLevels?.find(
    (service) => service?.value === generalFormData?.serviceLevel
  );

  if (!selectedServiceType && !selectedServiceLevel) {
    return null;
  }
  return (
    <section className=" mb-5 md:my-5 w-full">
      <h2 className="mb-2 text-xl font-semibold text-black">
        Selected Options
      </h2>
      <div className="grid cursor-default grid-cols-1 gap-6 rounded-md bg-slate-100 p-4 text-center md:grid-cols-2">
        <AnimatePresence>
          {selectedServiceType && (
            <motion.div
              key={"selectedServiceType"}
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
              }}
            >
              <Card className=" h-full  text-black shadow">
                <CardHeader className="p-3">
                  <CardTitle className="relative text-lg font-semibold text-slate-500">
                    Service Type
                    <Trash2
                      onClick={() => {
                        setGeneralFormData({
                          ...generalFormData,
                          serviceType: null,
                          serviceLevel: null,
                          additionalServices: null,
                          addons: null,
                          appliedPromo: null,
                        });
                        const url = new URL(window.location.href);
                        url.searchParams.delete("service-type");
                        router.replace(url.toString(), { scroll: false });
                      }}
                      className="absolute right-0 top-0 cursor-pointer text-red-500"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <span className="flex w-full items-center justify-center gap-3 text-center text-xl font-medium">
                    {selectedServiceType?.label}
                  </span>
                  <div
                    className="text-left w-full whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{
                      __html: selectedServiceType?.description,
                    }}
                  ></div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {selectedServiceLevel && (
            <motion.div
              key={"selectedServiceLevel"}
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
              }}
            >
              <Card className=" text-black shadow h-full">
                <CardHeader className="p-3">
                  <CardTitle className="relative  text-lg font-semibold text-slate-500">
                    Speed of Service
                    <Trash2
                      onClick={() =>
                        setGeneralFormData({
                          ...generalFormData,
                          serviceLevel: null,
                          appliedPromo: null,
                        })
                      }
                      className="absolute right-0 top-0 cursor-pointer text-red-500"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <span className="flex w-full items-center justify-center gap-3 text-center text-xl font-semibold text-gray-800">
                    {selectedServiceLevel?.title}
                  </span>
                  <span className="font-normal text-base mt-3 text-slate-500">
                    {selectedServiceLevel?.time}
                  </span>
                  <span className="mt-2 flex items-center font-semibold text-slate-500">
                    ($
                    {/* {selectedServiceLevel?.price} */}
                    {Number(selectedServiceLevel?.price + "") +
                      (Number(selectedServiceLevel?.nonRefundableFee + "") ||
                        0)}
                    *{" "}
                    <span className="text-sm italic text-slate-400">
                      + Gov fee
                    </span>
                    )
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SelectedOptions;
