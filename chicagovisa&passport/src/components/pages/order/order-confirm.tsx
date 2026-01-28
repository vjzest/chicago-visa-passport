import { IMGS } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useAuthStore } from "@/store/use-auth-store";

interface OrderConfirmationProps {
  orderNumber: string;
  serviceType: string;
  serviceLevel: string;
  applicantName: string;
  processingTime: string;
  ipAddress: string;
  totalAmount: number;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  serviceType,
  serviceLevel,
  applicantName,
  processingTime,
  ipAddress,
  totalAmount,
}) => {
  const { isLoggedIn } = useAuthStore((state) => state);
  return (
    <div className="flex flex-col items-center justify-between gap-y-4 rounded-lg bg-primary py-6 md:px-6 text-white shadow-md md:flex-row">
      <div className="flex w-full flex-col items-center justify-center gap-y-4  md:flex-row md:justify-evenly">
        <div className="flex w-full justify-center  md:w-1/5">
          <Image
            src={IMGS?.confirmOrder}
            alt="Order Icon"
            className="rounded-[50%]"
            width={100}
            height={100}
          />
        </div>
        <div className="px-4 md:block flex flex-col items-center">
          <div className="flex items-center gap-2 text-base md:text-xl font-bold text-green-400">
            <span>Application Order Confirmed </span>
            <CheckCircle />
          </div>
          <p className="mt-1 text-base md:text-lg font-medium">
            Your Order Number is :{" "}
            <span className="font-semibold">{orderNumber}</span>
          </p>
          <p className="text-sm md:text-base mt-3 md:mt-1 font-light">
            Congratulations! Your order for{" "}
            <span className="font-semibold">{serviceType}</span> (
            <span className="font-semibold">{serviceLevel}</span>) has been
            confirmed. A confirmation email has been sent to your registered
            email address.
            {isLoggedIn
              ? " Go to Client Portal"
              : " Login to the Client Portal"}{" "}
            and complete all the forms & instructions.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-base md:text-lg items-center md:items-end px-4">
        <span className="text-center font-semibold">
          Applicant: {applicantName}
        </span>
        <span className="text-center text-base ">
          <span>IP address : </span>
          <span className="font-medium">{ipAddress}</span>
        </span>
        <span className="text-center font-medium">{serviceLevel}</span>
        <span className="text-center font-medium text-green-300">
          {processingTime}
        </span>
        <span className="text-center text-base md:text-xl font-semibold text-yellow-500">
          Your card was charged ${totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderConfirmation;
