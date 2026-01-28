import Link from "next/link";

interface BlogRecentCardProps {
  image: string;
  title: string;
  text: string;
  date: string;
  link: string;
}

export default function BlogRecentCard({ image, title, text, date, link }: BlogRecentCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-[25px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[20px] items-center">
        <div className="md:col-span-5">
          <div>
            <img
              src={image}
              alt={title}
              className="w-full h-[218px] md:h-[143px] object-cover rounded-[10px]"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <div>
            <h4 className="max-w-[280px] mb-[7px] leading-[1.2]">{title}</h4>

            <p className="text-[12px] mb-[10px] line-clamp-3">{text}</p>

            <div className="mt-[10px]">
              <div className="flex items-center">
                <p className="text-[14px] text-[#1c1c1c] m-0 flex-1">{date}</p>

                <div className="text-right">
                  <Link href={`/blog/${link}`} className="text-[14px] underline">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
