import { IMGS } from "@/lib/constants";
import { useAuthStore } from "@/store/use-auth-store";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

interface OrderConfirmationProps {
  orderNumber: string;
  serviceType: string;
  serviceLevel: string;
  applicantName: string;
  processingTime: string;
  ipAddress: string;
  totalAmount: number;
}

const OrderConfirmationV2: React.FC<OrderConfirmationProps> = ({
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
    <div className="grid md:grid-cols-2 rounded-lg shadow-lg  border mx-auto overflow-hidden bg-white">
      {/* Left side hero image */}
      <div className="relative flex items-center justify-center bg-slate-200">
        <Image
          src={IMGS?.OrderConfirmPageImage} // add a passport/flag bg image in constants
          alt="Passport Background"
          className="object-cover h-[400px] w-full md:h-full"
          width={600}
          height={400}
        />
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Image
            src={IMGS?.Logo}
            alt="Chicago Passport & Visa Expedite Logo"
            width={160}
            height={160}
            className="opacity-90"
          />
        </div> */}
      </div>

      {/* Right side confirmation details */}
      <div className="flex flex-col justify-center gap-4 p-6 bg-red-100T px-5 md:px-10 lg:px-16">
        <h2 className="flex items-center text-center justify-center w-full gap-2 text-green-600 text-xl font-bold">
          Application Order Confirmed <CheckCircle />
        </h2>

        <p className="text-center text-base font-medium">
          Your Order Number is:{" "}
          <span className="font-semibold">{orderNumber}</span>
        </p>

        <p className="text-sm text-gray-700 leading-relaxed">
          Congratulations! Your order for{" "}
          <span className="font-semibold">{serviceType}</span> (
          <span className="font-semibold">{serviceLevel}</span>) has been
          confirmed. A confirmation email has been sent to your registered email
          address.{" "}
          {isLoggedIn ? "Go to Client Portal" : "Login to the Client Portal"} to
          complete all the forms & instructions.
        </p>

        <div className="mt-2 flex flex-col gap-1 text-sm font-medium text-gray-800">
          <span>Applicant: {applicantName}</span>
          <span>IP address: {ipAddress}</span>
          <span>{serviceLevel}</span>
          <span className="text-green-600">{processingTime}</span>
          <span className="text-yellow-600 text-lg font-semibold">
            Your card was charged ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationV2;
