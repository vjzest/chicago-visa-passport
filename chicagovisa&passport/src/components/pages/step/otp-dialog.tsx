import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { useCaseStore } from "@/store/use-case-store";

const OtpDialog = ({
  open,
  email,
  caseId,
  otpState,
  setOtpState,
}: {
  open: boolean;
  email: string;
  caseId: string;
  otpState: any;

  setOtpState: any;
}) => {
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { accountDetails } = useCaseStore((state) => state);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleResend = async () => {
    try {
      await axiosInstance.post("/user/auth/resend-verification", {
        email: email || accountDetails.email,
        caseId: caseId || accountDetails.caseId,
      });
      toast.success("Verification Email resent successfully");
    } catch (error) {
      toast.error("Failed to resend Verification Email");
    }
    setTimer(60);
    setIsResendDisabled(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={otpState.showOtpModal}
      onOpenChange={() =>
        setOtpState((p: any) => ({ ...p, showOtpModal: false }))
      }
    >
      <DialogContent className="max-w-sm rounded-lg bg-white p-6 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Check your Inbox
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Verification Link have been sent to{" "}
            <strong>{accountDetails?.email}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="text-center text-gray-600">
          Didn’t receive a Verification link?
          <div className="mt-2">
            <button
              onClick={handleResend}
              disabled={isResendDisabled}
              className={`underline ${isResendDisabled ? "text-gray-400" : "text-blue-600"}`}
            >
              Request Again {isResendDisabled && `(${formatTime(timer)})`}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
