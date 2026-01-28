import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaseStore } from "@/store/use-case-store";
import { useDataStore } from "@/store/use-data-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ServiceTypeSelect = ({
  serviceTypes,
}: {
  serviceTypes: any[];
}) => {
  const router = useRouter();
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );
  const { storeServiceTypes } = useDataStore((state) => state);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  useEffect(() => {
    if (storeServiceTypes.length === 0) return;
    const selected = storeServiceTypes.find(
      (st) => st._id === generalFormData.serviceType
    );
    setSelectedServiceType(selected);
  }, [storeServiceTypes, generalFormData.serviceType]);
  return (
    <div id="serviceTypeSelectCard">
      <h2
        className={`mb-1 mt-2 scroll-mt-5 text-xl w-full font-semibold`}
        id="serviceLevelSelectCard"
      >
        Select Service Type:{" "}
      </h2>

      <div className="bg-slate-50T flex flex-col md:flex-row w-full gap-4 md:gap-10 rounded-md pb-4 pt-1 ">
        <Select
          onValueChange={(value) => {
            setGeneralFormData({
              ...generalFormData,
              serviceType: value,
              serviceLevel: null,
              additionalServices: [],
              addons: null,
              appliedPromo: null,
            });
            const url = new URL(window.location.href);
            url.searchParams.delete("service-type");
            router.replace(url.toString(), { scroll: false });
          }}
          value={generalFormData.serviceType || ""}
        >
          <SelectTrigger className="max-w-[20rem] text-lg font-medium border-2 border-light-blue/50">
            <SelectValue placeholder="Select a service type" />
          </SelectTrigger>
          <SelectContent className="text-lg">
            {serviceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedServiceType && (
          <div className="flex flex-col">
            <h2 className="text-primary font-semibold text-lg">
              PASSPORT INFORMATION
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: selectedServiceType?.description,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
