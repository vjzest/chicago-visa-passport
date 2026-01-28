import Link from "next/link";

interface BtnAllProps {
  text: string;
  path: string;
  className?: string;
}

export default function BtnAll({ text, path, className = "" }: BtnAllProps) {
  return (
    <Link
      href={path}
      className={`
    inline-block bg-[#be1e2d] border border-[#be1e2d] text-white 
    font-medium rounded-[10px] shadow-[0_20px_20px_rgba(0,0,0,0.25)]
    py-[12px] px-[31px] lg:text-[18px]
    hover:bg-transparent hover:text-[#1c1c1c]
    text-[14px] md:text-[16px]
    ${className}
  `}
    >
      {text}
    </Link>
  );
}
