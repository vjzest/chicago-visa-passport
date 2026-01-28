import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCaseStore } from "@/store/use-case-store";
import { Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdditionalServicesSkeleton from "./additional-service-skeleton";

interface IAddon {
  _id: string;
  subTitle: string;
  price: number;
}

interface IAdditionalService {
  _id: string;
  title: string;
  price: number;
  description: string;
  addons: IAddon[];
}

const AdditionalServicesCards = ({
  services,
}: {
  services: IAdditionalService[];
}) => {
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );
  const [manuallyClosedServices, setManuallyClosedServices] = useState<
    string[]
  >([]);

  const handleAdditionalServiceToggle = (serviceId: string) => {
    const service = services?.find((s) => s._id === serviceId);
    if (!service) return;

    const isSelected = generalFormData?.additionalServices?.some(
      (s: IAdditionalService) => s._id === serviceId
    );

    if (isSelected) {
      // Remove service and its addons
      const updatedAddons = { ...generalFormData?.addons };
      delete updatedAddons?.[serviceId];

      setGeneralFormData({
        ...generalFormData,
        additionalServices: generalFormData?.additionalServices?.filter(
          (s: IAdditionalService) => s._id !== serviceId
        ),
        addons: updatedAddons,
      });
      // Remove from manually closed list if unchecked
      setManuallyClosedServices((prev) =>
        prev.filter((id) => id !== serviceId)
      );
    } else {
      // Add service
      setGeneralFormData({
        ...generalFormData,
        additionalServices: [
          ...(generalFormData?.additionalServices || []),
          service,
        ],
      });
      // Automatically show addons when service is checked
      setManuallyClosedServices((prev) =>
        prev.filter((id) => id !== serviceId)
      );
    }
  };

  const handleAddonToggle = (serviceId: string, addon: IAddon) => {
    const currentAddons = generalFormData?.addons?.[serviceId] || [];
    const isSelected = currentAddons?.some(
      (a: IAddon) => a?._id === addon?._id
    );

    const updatedAddons = {
      ...generalFormData?.addons,
      [serviceId]: isSelected
        ? currentAddons?.filter((a: IAddon) => a._id !== addon?._id)
        : [
            ...currentAddons,
            {
              _id: addon?._id,
              title: addon?.subTitle,
              price: addon?.price,
            },
          ],
    };

    setGeneralFormData({
      ...generalFormData,
      addons: updatedAddons,
    });
  };

  return (
    <div className="mb-3 mt-2 space-y-4">
      <h2 className="-mb-2 text-xl font-semibold">Additional Services</h2>

      {!services && <AdditionalServicesSkeleton />}
      {services.length === 0 && (
        <div className="mb-5 w-full text-xl text-slate-300">
          * No Additional Service for the selected Service Type
        </div>
      )}
      {services?.map((service) => {
        const isServiceChecked = generalFormData?.additionalServices?.some(
          (s: IAdditionalService) => s?._id === service?._id
        );
        const isManuallyClosed = manuallyClosedServices.includes(service._id);

        return (
          <Card key={service?._id} className="relative lg:w-2/3">
            <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="size-6"
                  id={service?._id}
                  checked={isServiceChecked}
                  onCheckedChange={() =>
                    handleAdditionalServiceToggle(service?._id)
                  }
                />
                <label
                  htmlFor={service?._id}
                  className="cursor-pointer text-base font-medium"
                >
                  {service?.title}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Info className="size-5 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-b-4 border-b-primary bg-slate-50 p-4 text-base">
                    <p className="max-w-[20rem] break-words">
                      {service?.description}
                    </p>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold">
                  ${service?.price}
                </span>
              </div>
            </CardHeader>
            <AnimatePresence>
              {isServiceChecked &&
                !isManuallyClosed &&
                service.addons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="bg-gray-50 px-4 pb-2">
                      <h3 className="mb-1 pt-1 font-medium">Addons:</h3>
                      {service?.addons?.map((addon) => {
                        const addonSelected = generalFormData?.addons?.[
                          service?._id
                        ]?.some((a: IAddon) => a?._id === addon?._id);
                        return (
                          <div
                            key={addon?._id}
                            className="flex items-center justify-between pl-2"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={addon?._id}
                                checked={addonSelected}
                                onCheckedChange={() =>
                                  handleAddonToggle(service?._id, addon)
                                }
                                disabled={!isServiceChecked}
                              />
                              <label htmlFor={addon?._id} className="text-sm">
                                {addon?.subTitle}
                              </label>
                            </div>
                            <span className="text-sm font-medium">
                              ${addon?.price}
                            </span>
                          </div>
                        );
                      })}
                    </CardContent>
                  </motion.div>
                )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
};

export default AdditionalServicesCards;
