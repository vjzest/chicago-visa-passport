import React, { Dispatch, useEffect, useRef, useState } from "react";
import DynamicForm from "@/components/pages/apply-step1/dynamic-form";
import { useCaseStore } from "@/store/use-case-store";
import useHydration from "@/hooks/use-hydration";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardsPaymentMethod } from "./payment-method";
import { MoveLeft } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import axiosInstance from "@/lib/config/axios";
import AdditionalServicesCards from "../apply-v2/additional-services-cards";
import { Button } from "@/components/ui/button";
import { useHomepageContent } from "@/hooks/use-homepage-content";

const ShippingFormSection = ({
  forms,
  setCurrentStep,
  triggerSubmit,
  setTriggerSubmit,
  isOfflineLink = false,
}: {
  forms: IForm[];
  setCurrentStep: (step: IApplySteps) => void;
  triggerSubmit: number | null;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
  isOfflineLink?: boolean;
}) => {
  // START: Added useHomepageContent hook
  const content = useHomepageContent();
  const t = content?.usPassportApplication?.step2;
  // END: Added useHomepageContent hook

  const isHydrated = useHydration();
  const { formData, setFormData, generalFormData } = useCaseStore(
    (state) => state
  );
  const { storeAdditionalServices } = useDataStore((state) => state);
  const [additionalServices, setAdditionalServices] = useState<
    IAdditionalService[]
  >([]);
  const [filteredAdditionalServices, setFilteredAdditionalServices] = useState<
    IAdditionalService[]
  >([]);
  // const [triggerSubmit, setTriggerSubmit] = useState<null | number>(null);
  const [formError, setFormError] = useState(false);
  const formRefs = useRef<{ [key: string]: React.RefObject<HTMLFormElement> }>(
    {}
  );

  useEffect(() => {
    forms?.forEach((form) => {
      formRefs.current[form.id] = React.createRef();
    });
  }, [forms]);

  useEffect(() => {
    setAdditionalServices(storeAdditionalServices || []);
  }, [storeAdditionalServices]);

  useEffect(() => {
    if (generalFormData.serviceType) {
      let _additionalServices = additionalServices?.filter((service) =>
        service?.serviceTypes?.some(
          (type) => type?._id === generalFormData?.serviceType
        )
      );

      setFilteredAdditionalServices(_additionalServices);
    } else {
      setFilteredAdditionalServices(additionalServices);
    }
  }, [additionalServices, generalFormData?.serviceType]);

  const handleFormSubmit = (formId: string, data: any) => { };

  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);

  const shippingInfoForm = forms?.find(
    (form) => form?.id === "shippingInformation"
  );
  const billingInfoForm = shippingInfoForm
    ? {
      ...shippingInfoForm,
      id: "billingInformation",
      name: "Billing Information",
    }
    : null;

  return (
    <div className="space-y-6 max-md:px-5 max-lg:px-10">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6 mt-5 ">
        <button
          onClick={() => setCurrentStep("application")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <MoveLeft className="w-5 h-5" />
          <span className="font-medium">
            {/* Back to Step 1 (Visa type, Applicant and Contact information) */}
            {t?.backButton}
          </span>
        </button>
      </div>

      <div className="">
        <h2 className="text-xl font-semibold text-primary mb-4 ">
          {/* {`Speed of service, Applicant's Shipping Information / Payment For
          Services`} */}
          {t?.title}
        </h2>
      </div>

      <div className=" bg-white p-10 rounded-md">
        {/* Additional Services Section */}
        {generalFormData?.serviceType &&
          filteredAdditionalServices.length > 0 && (
            <AdditionalServicesCards services={filteredAdditionalServices} />
          )}

        {/* Shipping Address Section */}
        <div className=" ">
          <h3 className="text-lg font-semibold text-primary mt-5 mb-2">
            {/* Shipping Address */}
            {t?.shippingAddress}
          </h3>

          <div className="border border-gray-100 p-6 rounded-md">
            {shippingInfoForm && (
              <div id="shippingAddressDiv" className="space-y-4">
                <DynamicForm
                  setFormError={setFormError}
                  formInfo={shippingInfoForm}
                  tabIndex={0}
                  onSubmit={(data) =>
                    handleFormSubmit(shippingInfoForm?.id, data)
                  }
                  triggerSubmit={triggerSubmit}
                  setTriggerSubmit={setTriggerSubmit}
                  ref={formRefs?.current?.[shippingInfoForm?.id]}
                  fieldsPerRowArray={[1, 1, 3]}
                />
              </div>
            )}

            <div className="flex  items-center space-x-3 my-4">
              <Checkbox
                id="sameAddress"
                checked={isBillingSameAsShipping}
                onCheckedChange={(checked) => {
                  setIsBillingSameAsShipping(checked as boolean);
                  if (checked)
                    setFormData({
                      ...formData,
                      billingInformation: formData?.shippingInformation,
                      isBillingSameAsShipping: true,
                    });
                  else
                    setFormData({
                      ...formData,
                      isBillingSameAsShipping: false,
                      billingInformation: {},
                    });
                }}
              />
              <Label
                htmlFor="sameAddress"
                className="text-sm text-gray-700 cursor-pointer"
              >
                {/* Billing address same as shipping address? */}
                {t?.billingSameAsShipping}
              </Label>
            </div>

            {/* Billing Address Section (conditionally rendered) */}
            {!isBillingSameAsShipping && billingInfoForm && (
              <div className=" ">
                <h3 className="text-lg font-semibold text-primary mt-4 mb-4">
                  {/* Billing Address */}
                  {t?.billingAddress}
                </h3>
                <div className="space-y-4">
                  <DynamicForm
                    setFormError={setFormError}
                    formInfo={billingInfoForm}
                    tabIndex={0}
                    onSubmit={(data) =>
                      handleFormSubmit(billingInfoForm?.id, data)
                    }
                    triggerSubmit={triggerSubmit}
                    setTriggerSubmit={setTriggerSubmit}
                    ref={formRefs?.current?.[billingInfoForm?.id]}
                    fieldsPerRowArray={[1, 1, 3]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="">
          <h3 className="text-lg font-semibold text-primary mt-5 mb-2">
            {/* Payment Method */}
            {t?.paymentMethod}
          </h3>
          {isHydrated && (
            <CardsPaymentMethod
              setCurrentStep={setCurrentStep}
              forms={forms}
              formData={formData}
              setTriggerSubmit={setTriggerSubmit}
              isOfflineLink={isOfflineLink}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default ShippingFormSection;
