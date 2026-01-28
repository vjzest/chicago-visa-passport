import React from "react";
import ReferralCard from "../cards/referral-card";
import ContactUsCard from "../contact-us/contact-us";

const MediaResourceNonUsCitizen = ({
  title,
  p1,
  p2,
  p3,
}: {
  title: string;
  p1: string;
  p2: string;
  p3: string;
}) => {
  return (
    <main className="container-2 mt-5 ">
      <div>
        <h2 className="w-full text-3xl font-semibold">{title} </h2>
      </div>
      <div className="flex w-full items-center justify-center py-8">
        <div className="m:p-8 flex w-full flex-col items-center gap-8 rounded-md p-4 shadow-full  md:flex-row md:justify-evenly">
          {/* First Card */}
          <div className="min-h-[26rem] flex-1 p-4">
            <h1 className="w-full text-2xl font-semibold">{title}</h1>
            <div className=" flex min-h-80 flex-col gap-4 pt-3 md:justify-between  md:gap-0">
              <p className="flex-1 ">{p1}</p>

              <p className="flex-1">{p2}</p>

              <p className="flex-1">{p3}</p>
            </div>
          </div>
          {/* Second Card */}
          <div className="flex size-full flex-1 items-center justify-center md:w-1/4">
            <ReferralCard />
          </div>
          {/* Third Card */}
        </div>
      </div>
      <ContactUsCard />
    </main>
  );
};

export default MediaResourceNonUsCitizen;
