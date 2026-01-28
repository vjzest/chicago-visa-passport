import { ChangeEventHandler } from "react";
import HeroBtnSelect from "./HeroBtnSelect";

const arrowIcon = "/landing/assets/selected-arrow.svg";

interface PassportHeroSelectProps {
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  activeIndexValue: string | number;
}

export default function PassportHeroSelect({ handleChange, activeIndexValue }: PassportHeroSelectProps) {
  return (
    <>
      <div className="bg-white rounded-[14px] max-w-[508px] p-[6px] relative z-[9] shadow-[0_40px_40px_rgba(0,0,0,0.25)]">
        <div className="rounded-[14px] border border-[#f0efeb] p-[13px] flex items-center gap-[20px] max-sm:flex-col max-sm:pt-[18px] max-sm:px-[13px] max-sm:pb-[13px]">
          <select
            onChange={handleChange}
            className={`flex-1 border-none appearance-none bg-transparent bg-no-repeat bg-right pr-[10px] pl-[10px] text-[14px] text-[--color-text-muted] max-w-[calc(100%-137px)] outline-none max-sm:w-full max-sm:flex-none max-sm:max-w-full`}
            style={{ backgroundImage: `url(${arrowIcon})` }}
          >
            <option value="" disabled>
              Choose
            </option>
            <option value="0">New Passport</option>
            <option value="1">Passport Renewal</option>
            <option value="2">Child Passport</option>
            <option value="3">Lost Passport</option>
            <option value="4">Passport Name Change</option>
            <option value="5">Second Limited Passport</option>
            <option value="6">Additional Requirements for US Passports</option>
          </select>
          <HeroBtnSelect
            text="Get Started"
            path="/us-passport"
            activeIndexValue={activeIndexValue}
          />
        </div>
      </div>
    </>
  );
}
