import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import React, { useState } from "react";
import { IAccountDetails, useCaseStore } from "@/store/use-case-store";
import { Input } from "@/components/ui/input";
import useCheckToken from "@/hooks/use-check-token";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Checkbox } from "@/components/ui/checkbox";

const ContactInfoFormSection = ({
  setCurrentStep,
}: {
  forms: IForm[];
  setCurrentStep: (
    step: "application" | "contact-info" | "shipping" | "billing"
  ) => void;
}) => {
  const { token } = useCheckToken([]);
  const { accountDetails, setAccountDetails, verifiedEmail } = useCaseStore(
    (state) => state
  );
  const [otpState, setOtpState] = useState({
    email: "",
    fullName: "",
    otp: "",
    isVerified: false,
    showOtpModal: false,
    attempts: 0,
  });

  const handleContinue = () => {
    setCurrentStep("shipping");
    document.getElementById("steps-guide-header")?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  };

  const handleAccountDetailsChange = (
    field: keyof IAccountDetails,
    value: string | boolean
  ) => {
    setAccountDetails({ ...accountDetails, [field]: value });
  };

  return (
    <>
      <Card>
        {!token && (
          <div className="mx-auto w-full max-w-2xl py-8">
            <h2 className="mb-4 text-xl font-semibold">
              Contact info / Account details
            </h2>
            <div className="space-y-4">
              <Input
                value={accountDetails?.fullName}
                onChange={(e) =>
                  handleAccountDetailsChange("fullName", e.target.value)
                }
                type="text"
                placeholder="Enter Full Name"
              />
              <div className="flex gap-2">
                <PhoneInput
                  country={"us"}
                  value={accountDetails?.phone}
                  onChange={(phone: any) =>
                    handleAccountDetailsChange("phone", `+${phone}`)
                  }
                  inputProps={{
                    required: true,
                    className:
                      "w-full p-2 pl-12 border focus:border-primary rounded",
                  }}
                />
                <Input
                  value={accountDetails?.email}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value !== verifiedEmail || !value) {
                      setOtpState({ ...otpState, isVerified: false });
                      setAccountDetails({
                        ...accountDetails,
                        emailVerified: false,
                      });
                    } else if (value && value === verifiedEmail) {
                      setOtpState({ ...otpState, isVerified: true });
                      setAccountDetails({
                        ...accountDetails,
                        emailVerified: true,
                      });
                    } else {
                      setOtpState({ ...otpState, isVerified: false });
                      setAccountDetails({
                        ...accountDetails,
                        emailVerified: false,
                      });
                    }
                    handleAccountDetailsChange("email", e.target.value);
                  }}
                  required
                  type="email"
                  placeholder="Enter Your Email"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentToUpdates"
                  checked={accountDetails.consentToUpdates}
                  onCheckedChange={(checked) =>
                    handleAccountDetailsChange("consentToUpdates", checked)
                  }
                />
                <label
                  htmlFor="consentToUpdates"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to receive email and text updates regarding my Visa
                  application
                </label>
              </div>
            </div>
          </div>
        )}
        <CardFooter className="mt-5 flex justify-end">
          <Button onClick={handleContinue} className="!px-16">
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ContactInfoFormSection;
