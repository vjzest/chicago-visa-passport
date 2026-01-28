import Link from "next/link";

interface BtnHashLinkProps {
  text: string;
  path: string;
}

export default function BtnHashLink({ text, path }: BtnHashLinkProps) {
  return (
    <Link
      href={path}
      className="
    inline-block bg-[#be1e2d] border border-[#be1e2d] text-white 
    font-medium rounded-[10px] shadow-[0_20px_20px_rgba(0,0,0,0.25)]
    py-[12px] px-[31px] text-[18px]
    hover:bg-transparent hover:text-[#1c1c1c]
    max-lg:text-[16px] max-sm:text-[14px]
  "
    >
      {text}
    </Link>
  );
}
