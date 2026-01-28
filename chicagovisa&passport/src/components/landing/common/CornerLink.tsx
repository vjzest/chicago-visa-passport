import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface CornerLinkProps {
  to: string;
  img: string | StaticImageData;
}

export default function CornerLink({ to, img }: CornerLinkProps) {
  return (
    <div
      className="
        absolute right-0 bottom-0 w-[50px] h-[50px]
        bg-white rounded-tl-[20px]
        flex items-center justify-center
      "
    >
      <div
        className="
          absolute w-[20px] h-[20px]
          right-full bottom-0
          scale-x-[-1]
          bg-[radial-gradient(circle_at_100%_0%,transparent_19px,#ffffff_calc(20px+1px))]
        "
      />

      <div
        className="
          absolute w-[20px] h-[20px]
          right-0 bottom-full
          scale-x-[-1]
          bg-[radial-gradient(circle_at_100%_0%,transparent_19px,#ffffff_calc(20px+1px))]
        "
      />

      <Link href={to}>
        <Image src={img} alt="arrow" width={50} height={50} />
      </Link>
    </div>
  );
}
