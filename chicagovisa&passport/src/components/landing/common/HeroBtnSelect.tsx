import Link from "next/link";

interface HeroBtnSelectProps {
  text: string;
  path: string;
  activeIndexValue?: number | string;
}

export default function HeroBtnSelect({ text, path, activeIndexValue }: HeroBtnSelectProps) {
  return (
    <Link
      href={`${path}?activeIndex=${Number(activeIndexValue)}`}
      className="text-[14px] bg-[#be1e2d] border border-[#be1e2d] text-white flex items-center justify-center rounded-[6px] transition-all duration-200 flex-none basis-[137px] max-w-[137px] h-[45px] hover:bg-transparent hover:text-heading max-sm:w-full max-sm:basis-full max-sm:max-w-full max-sm:h-[50px] max-sm:min-h-[50px]"
    >
      {text}
    </Link>
  );
}
