import { ChangeEventHandler, FormEvent } from "react";
import HeroBtnSelect from "./HeroBtnSelect";

const arrowIcon = "/landing/assets/selected-arrow.svg";

interface FieldOption {
  value: string;
  label: string;
}

interface Field {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: FieldOption[];
}

interface VisaOptionsProps {
  fields: Field[];
  link: string;
  btnText: string;
  onSubmit?: () => void;
}

export default function VisaOptions({ fields, link, btnText, onSubmit }: VisaOptionsProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("submit");
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-[10px] items-end max-sm:flex-col">
      <div className="flex flex-1 gap-[10px] max-sm:w-full">
        {fields.map((field, index) => (
          <div key={index} className="flex-1">
            <span className="text-[12px] text-[#1c1c1c] mb-[5px] inline-block">
              {field.label}
            </span>

            <select
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              className="
    w-full h-[46px]
    pr-[30px] pl-[10px]
    border-none outline-none
    rounded-[5px]
    bg-white
    appearance-none
    text-[#1c1c1c]

    bg-no-repeat
    bg-[length:10px_auto]
    bg-[position:90%_center]
  "
              style={{ backgroundImage: `url(${arrowIcon})` }}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {onSubmit ? (
        <button
          onClick={handleSubmit}
          className="bg-[#be1e2d] hover:bg-[#a01a27] text-white rounded-[8px] px-[20px] py-[12px] min-h-[46px] font-medium text-[14px] whitespace-nowrap transition-colors"
        >
          {btnText}
        </button>
      ) : (
        <HeroBtnSelect text={btnText} path={link} />
      )}
    </div>
  );
}
