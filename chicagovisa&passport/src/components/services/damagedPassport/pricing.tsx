import { services } from "@/data/services";
import Link from "next/link";

const Pricing = () => {
  const service = services["damaged-passport"];

  return (
    <div className="w-full bg-[#F2F9FF] px-6 md:px-10 py-10">
      <h2 className="font-grotesk text-2xl md:text-3xl font-bold text-[#222222] mb-4 text-center md:text-left">
        {service.pricing.title}
      </h2>
      <p className="text-[#666666] mb-8 text-sm text-center md:text-left">
        {service.pricing.subTitle}
      </p>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {service.pricing.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-6 flex flex-col shadow-md transition-all hover:shadow-lg"
          >
            <div className="mb-3">
              <h3 className="text-[#222222] font-bold text-lg mb-1 font-grotesk">
                {item.title}
              </h3>
              <p className="text-[#666666] text-sm">{item.processingTime}</p>
            </div>

            <div className="border-b-[1.5px] border-[#CCCCCC] mb-3"></div>

            <div className="mt-auto space-y-3">
              <p className="text-lg font-bold text-[#222222] mt-2">
                {item.price}
              </p>
              <p className="text-[#666666] text-sm">{item.fees}</p>

              <div className="mt-4">
                <Link
                  href={item.button.link}
                  className="block text-center text-sm bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
