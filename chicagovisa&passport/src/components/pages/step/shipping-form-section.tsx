import { Card } from "@/components/ui/card";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import DynamicForm from "@/components/pages/apply-step1/dynamic-form";
import { useCaseStore } from "@/store/use-case-store";
import useHydration from "@/hooks/use-hydration";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardsPaymentMethod } from "./payment-method";
import { MoveLeft } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";

const ShippingFormSection = ({
  forms,
  setCurrentStep,
  triggerSubmit,
  setTriggerSubmit,
}: {
  forms: IForm[];
  setCurrentStep: (step: IApplySteps) => void;
  triggerSubmit: number | null;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
}) => {
  const isHydrated = useHydration();
  const { formData, setFormData, generalFormData } = useCaseStore(
    (state) => state
  );
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const { storeServiceTypes } = useDataStore((state) => state);
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
    if (storeServiceTypes?.length < 1 || !generalFormData?.serviceType) return;
    const selectedType = storeServiceTypes.find(
      (st) => st._id === generalFormData?.serviceType
    );
    setSelectedServiceType(selectedType?.serviceType);
  }, [storeServiceTypes, generalFormData?.serviceType]);

  const handleFormSubmit = (formId: string, data: any) => {};

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
    <>
      <h3 className="text-lg text-light-blue uppercase">
        <span className="font-semibold">PASSPORT TYPE</span> :{" "}
        {selectedServiceType}
      </h3>
      <div>
        <span
          onClick={() => {
            setCurrentStep("application");
          }}
          className="flex cursor-pointer items-center gap-3 py-2 text-primary"
        >
          <MoveLeft />{" "}
          <span className="text-base font-semibold">Previous Step</span>
        </span>
      </div>
      <Card className="h-fit w-full bg-slate-50" id="applicant-tab">
        <div
          id="shippingAddressDiv"
          className="mx-auto max-w-2xl space-y-6  p-6 "
        >
          {shippingInfoForm && (
            <div key={shippingInfoForm?.id} className="mb-0 mt-5  scroll-mt-5 ">
              <h2 className=" text-xl font-semibold text-primary">
                Shipping Address
              </h2>
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

          <div className="flex items-center space-x-2 ">
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
            <Label htmlFor="sameAddress">
              Billing address same as shipping address?
            </Label>
          </div>
          {!isBillingSameAsShipping && (
            <div>
              {!isBillingSameAsShipping && billingInfoForm && (
                <div key={billingInfoForm?.id} className="my-5">
                  <h2 className="text-xl font-semibold text-primary">
                    Billing Address
                  </h2>
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
              )}
            </div>
          )}

          {isHydrated && (
            <CardsPaymentMethod
              setCurrentStep={setCurrentStep}
              forms={forms}
              formData={formData}
              setTriggerSubmit={setTriggerSubmit}
            />
          )}
        </div>
        {/* <CardFooter className="mt-5 flex justify-end">
          <Button onClick={handleContinue} className="!px-16">
            Continue
          </Button>
        </CardFooter> */}
      </Card>
    </>
  );
};

export default ShippingFormSection;
