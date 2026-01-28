import { IMGS } from "@/lib/constants";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="container-1 mt-5">
      <div className="flex w-full ">
        <div className="flex w-full flex-col items-center rounded-md shadow-full md:flex-row md:justify-evenly">
          <div className="flex w-full flex-col items-center justify-between gap-10 p-0 md:flex-row md:gap-2 md:p-36">
            <div className="flex flex-col">
              <div className="pt-10 md:mt-10 md:min-h-32"></div>
              <div>
                <Image src={IMGS?.Dots} className="w-20 md:w-48" alt="" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-center">
                <Image src={IMGS?.NotFound} className="w-32 md:w-40" alt="" />
              </div>
              <div className="+++++++justify-center flex flex-col items-center gap-3">
                <span className="text-2xl font-semibold text-primary">
                  OOPS !
                </span>
                <span className="text-xl mb-2">Page Not Found!</span>
              </div>
            </div>
            <div className="flex flex-col-reverse">
              <div className="pt-10 md:mt-10 md:min-h-32"></div>
              <div>
                <Image src={IMGS?.Dots} className="w-20 md:w-48" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
