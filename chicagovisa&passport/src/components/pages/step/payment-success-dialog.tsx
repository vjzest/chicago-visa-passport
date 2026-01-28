import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccessDialog = ({
  open,
  isButtonEnabled,
  isProcessing,
  setIsButtonEnabled,
  setIsProcessing,
}: {
  open: boolean;
  isButtonEnabled: boolean;
  isProcessing: boolean;
  setIsButtonEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setIsButtonEnabled(true);
      setIsProcessing(false);
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, countdown]);

  const progress: number = ((5 - countdown) / 5) * 100;
  return (
    <Dialog open={open}>
      <DialogContent className="p-6 sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {!isProcessing && (
            <CircleCheckBig
              size={68}
              className="text-green-600"
              strokeWidth={3}
            />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {isProcessing ? "Payment Processing" : "Payment Successful"}
          </h2>
          <p className="text-gray-600">
            {isProcessing
              ? "Please wait while we process your payment..."
              : "Thank you! Your payment has been processed successfully. Please continue to complete the registration."}
          </p>
          {isProcessing && (
            <div className="relative size-20">
              <svg className="size-full" viewBox="0 0 100 100">
                <circle
                  className="stroke-current text-gray-200"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="progress-ring stroke-current text-green-500"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (progress / 100) * 251.2}
                ></circle>
              </svg>
              <div className="absolute left-0 top-0 flex size-full items-center justify-center">
                <span className="text-2xl font-bold">{countdown}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6 w-full ">
          <div className="flex w-full justify-center ">
            <Button
              type="button"
              className={`rounded-md px-6 py-2 text-sm font-medium text-white ${
                isButtonEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
              disabled={!isButtonEnabled}
              onClick={() => {
                router.replace("/success");
              }}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <DialogOverlay className="bg-white/30 blur-3xl" />
    </Dialog>
  );
};

export default PaymentSuccessDialog;
