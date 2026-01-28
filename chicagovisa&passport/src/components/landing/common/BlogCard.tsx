import Link from "next/link";

interface BlogCardProps {
  image: string;
  title: string;
  text: string;
  date: string;
  link: string;
}

export default function BlogCard({ image, title, text, date, link }: BlogCardProps) {
  return (
    <div className="bg-white p-[19px] rounded-[20px] h-full flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full h-[218px] object-cover rounded-[10px]"
      />

      <h4 className="mt-[21px] mb-[13px] max-w-[300px] leading-[1.3]">
        {title}
      </h4>

      <p className="text-[14px] mb-[22px]">{text}</p>

      <div className="mt-auto">
        <div className="flex items-center">
          <p className="text-[#1c1c1c] text-[14px] m-0 flex-1">{date}</p>

          <div className="text-right">
            <Link href={`/blog/${link}`} className="text-[14px] underline">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
