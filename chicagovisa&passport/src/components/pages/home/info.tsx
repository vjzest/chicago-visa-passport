import React from "react";

interface InfoBoxProps {
  message?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  message = "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
}) => {
  return (
    <div className="mb-5 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
        <div className="">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-5">
                <p className="text-blue-900 font-inter text-base leading-relaxed text-center w-full">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
