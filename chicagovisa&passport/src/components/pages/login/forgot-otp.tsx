import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { useCaseStore } from "@/store/use-case-store";

const ForgotOtpDialog = ({
  open,
  otpState,
  setOtpState,
}: {
  open: boolean;
  otpState: any;
  setOtpState: any;
}) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(90);
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
      await axiosInstance.post("/user/auth/resend-otp", {
        email: accountDetails?.email,
        fullName: accountDetails?.fullName,
      });
    } catch (errror) {}
    setTimer(90);
    setIsResendDisabled(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  async function submitOtp() {
    try {
      const { data } = await axiosInstance.post(
        "/user/auth/forgot/verify-otp",
        {
          otp,
          email: otpState?.email,
        }
      );

      if (data?.success) {
        toast.success("Email verified successfully");
        setOtpState({
          ...otpState,
          showOtpModal: false,
          isVerified: true,
        });
      } else {
        toast.error("Something went wrong, Try again");
      }
    } catch (error: any) {
      setOtpState({
        ...otpState,
        attempts: otpState?.attempts + 1,
      });
      if (
        error?.response?.data?.status === 404 ||
        error?.response?.data?.status === 400
      ) {
        toast.error(
          error?.response?.data?.message || "Invalid OTP, Try again",
          {
            position: "top-center",
          }
        );
      } else {
        toast.error("Something went wrong!", {
          position: "top-center",
        });
      }
      console.log(error);
    }
  }
  useEffect(() => {
    if (otp.length === 4) submitOtp();
  }, [otp]);

  return (
    <Dialog
      open={otpState.showOtpModal}
      onOpenChange={() =>
        setOtpState((p: any) => ({ ...p, showOtpModal: false }))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Enter OTP
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Code sent to <strong>{otpState?.email} </strong>
            {`Please check your email`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-5">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={4}
            className="flex gap-5"
          >
            <InputOTPSlot className="mx-3 rounded-none p-5" index={0} />
            <InputOTPSlot className="mx-3 p-5" index={1} />
            <InputOTPSlot className="mx-3 p-5" index={2} />
            <InputOTPSlot className="mx-3 p-5" index={3} />
          </InputOTP>
        </div>
        <DialogFooter>
          <Button onClick={handleResend} disabled={isResendDisabled}>
            {isResendDisabled ? `Resend (${formatTime(timer)})` : "Resend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotOtpDialog;
