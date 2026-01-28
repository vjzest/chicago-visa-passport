import { services } from "@/data/services";
import Link from "next/link";

const government = () => {
  const service = services["passport-name-change"];

  return (
    <div className="w-full px-10 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-6 font-grotesk">
        {service.government.title}
      </h2>
      <div className="text-[#666666] text-sm font-semibold mb-8 space-y-2">
        {service.government.subTitle}
      </div>

      {/* Instructions Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-[#222222] mb-4 font-inter">
          {service.government.instruction}
        </h3>

        <div className="space-y-3 mt-4">
          {service.government.paymentInstructions.map((instruction) => (
            <div
              key={instruction.id}
              className="flex items-start gap-3 bg-[#F5F5F5] p-3 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-[#006DCC] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[#666666] flex-1 text-sm">{instruction.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div>
        <Link
          href={service.government.button.link}
          className="text-sm bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition"
        >
          {service.government.button.text}
        </Link>
      </div>
    </div>
  );
};

export default government;
