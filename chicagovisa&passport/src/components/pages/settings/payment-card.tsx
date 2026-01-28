import { Wifi } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CreditCardProps {
  card: { cardNumber: string; holderName: string; expire: string };
}

const PaymentCard: React.FC<CreditCardProps> = ({ card }) => {
  return (
    <div className="w-full rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 p-4 shadow-lg ">
      <div className="relative">
        <div className="absolute right-0 rotate-90 text-2xl text-white ">
          ...
        </div>
        <div className="absolute left-0 top-0 ml-2 mt-2 text-white">
          <Wifi />
        </div>
      </div>
      <div className="mt-16 flex flex-col justify-between text-center text-white">
        <div className="text-xl  font-semibold tracking-widest">
          {card?.cardNumber}
        </div>
        <div className="mt-4 flex  items-center justify-around">
          <div>
            <div className="mt-2 text-sm">Card Holder</div>
            <div className=" font-semibold">{card?.holderName}</div>
          </div>
          <div>
            <div className="mt-2 text-sm">Expires</div>
            <div className=" font-semibold">{card?.expire}</div>
          </div>
          <div className="h-5 w-9 rounded-lg bg-gradient-to-r from-red-600 to-yellow-400"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
