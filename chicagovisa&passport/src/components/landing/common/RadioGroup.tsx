interface Service {
  value: string;
  default?: boolean;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  services: Service[];
  chooseValue: string;
  setChooseValue: (value: string) => void;
}

export default function RadioGroup({ services, chooseValue, setChooseValue }: RadioGroupProps) {
  return (
    <div className="flex items-center gap-[5px] md:gap-[12px] mb-[15px] w-full md:w-auto">
      {services.map((service) => (
        <label key={service.value} className="flex-1 md:flex-none">
          <input
            type="radio"
            name="service"
            value={service.value}
            checked={chooseValue === service.value}
            disabled={service.disabled}
            onChange={() => setChooseValue(service.value)}
            className="peer invisible absolute"
          />
          <span
            className={`rounded-[8px] w-full min-h-[40px]
          px-[10px] md:px-[20px] lg:px-[34px]
          text-white inline-flex items-center 
          text-[12px] md:text-[14px] bg-primary justify-center
          peer-checked:bg-[#be1e2d] peer-checked:shadow-[0_15px_15px_rgba(0,0,0,0.25)]
          ${service.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {service.label}
          </span>
        </label>
      ))}
    </div>
  );
}
