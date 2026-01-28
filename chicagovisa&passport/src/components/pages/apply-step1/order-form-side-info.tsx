import { IMGS } from "@/lib/constants";
import { Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

const OrderFormSideInfo = () => {
  return (
    <div className="flex flex-col gap-3 !text-base ">
      <div className="flex flex-col border shadow-lg rounded-md">
        <div className="flex justify-between p-2">
          <h2 className="font-semibold text-primary">
            HAVE QUESTIONS OR NEED SUPPORT?
          </h2>
          <Image
            src={IMGS.UsaFlagLogo}
            width={40}
            alt="jet passports american flag logo"
            height={40}
          />
        </div>
        <Image
          src={IMGS.LadyGivingPassport}
          width={500}
          alt="chat"
          height={500}
        />
        <div className="flex items-center gap-2 justify-center py-4">
          <div className="bg-light-blue text-white rounded-full p-2">
            <Phone size={"1rem"} />
          </div>
          <a href="tel:2024749999" className="font-semibold text-xl">
            202-474-9999
          </a>{" "}
        </div>
      </div>
      <div className="flex flex-col border p-4 shadow-lg">
        <h2 className="font-semibold text-primary">IMPORTANT</h2>
        <p>
          By filling out this order form you are choosing to expedite your Visa.
          Please contact us with any questions about our services prior to
          registering.
        </p>
      </div>
      <div className="flex flex-col border p-4 shadow-lg rounded-b-md">
        <p>
          After registering, your application processsing begins. You will be
          given online forms and instructions to follow. A Visa specialist will
          be available to help you every step of the way with your Visa
          Application. The processing of your application will start when we
          receive your complete and correct documents at our office.
        </p>
      </div>
    </div>
  );
};

export default OrderFormSideInfo;
