import Image from "next/image";
import React from "react";
import { IMGS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ReferralCard = () => {
  return (
    <div className="h-fit w-full rounded-lg bg-light-blue p-4 md:w-fit">
      <div className="">
        <h3 className="py-2 text-center text-lg font-semibold text-white md:text-start">
          Register now to benefit from <br /> referel program
        </h3>
      </div>
      <div className="flex w-full justify-center px-3 py-5">
        <Image
          alt="passport"
          src={IMGS?.Passport}
          className="sm:w-full"
          height={120}
        />
      </div>
      <div className="flex flex-col gap-2 px-3 py-5">
        <label htmlFor="select" className="text-white">
          Type
        </label>
        <Select>
          <SelectTrigger className="w-full rounded">
            <SelectValue placeholder="Individual" />
          </SelectTrigger>
          <SelectContent className="rounded">
            <SelectGroup>
              {/* <SelectLabel>Individuals</SelectLabel> */}
              <SelectItem value="Individuals">Individuals</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5 flex size-full justify-center">
        <Button className="flex gap-2 rounded-full">
          <i className="bx bx-check"></i> Proceed
        </Button>
      </div>
    </div>
  );
};

export default ReferralCard;
