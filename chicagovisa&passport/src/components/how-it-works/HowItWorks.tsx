

import Image from "next/image";
import Link from "next/link";
import { ENV } from "@/lib/env";
import { Button } from "../ui/button";

type ProcessStep = {
  id: string;
  imageSrc: string;
  title: string;
  description: string[];
  imageWidth?: number;
  imageHeight?: number;
};

const steps: ProcessStep[] = [
  {
    id: "STEP 1",
    imageSrc: "/assets/1.gif",
    title: "Place Your Order And Start Your Passport Process Online",
    description: [
      "Our secure, quick and simple online registration form takes only a few minutes to complete.We'll ask a few questions about you and your upcoming travel plans, along with requesting payment.",
    ],
    imageWidth: 0,
    imageHeight: 0,
  },
  {
    id: "STEP 2",
    imageSrc: "/assets/2.gif",
    title: "Collect Your Required Documents",
    description: [
      "Once you've completed the necessary passport application forms and gathered a photo, and supporting documents, you'll ship them to one of our designated processing locations Your documents will be submitted to the Passport Agency by one of our registered couriers.",
    ],
    imageWidth: 0,
    imageHeight: 0,
  },
  {
    id: "STEP 3",
    imageSrc: "/assets/3.gif",
    title: "Get Ready To Receive Your Passport",
    description: [
      "We'll ship your US Passport to you and notify you when someone needs to be present for delivery confirmation.",
    ],
    imageWidth: 0,
    imageHeight: 0,
  },
];

export default function HowItWorks({ content }: { content?: any }) {
  const cmsSteps = content?.steps || [];

  const displaySteps = steps.map((step, index) => {
    const cmsStep = cmsSteps[index];
    return {
      ...step,
      title: cmsStep?.title || step.title,
      description: cmsStep?.text ? [cmsStep.text] : step.description
    };
  });

  return (
    <section className="w-full bg-white">
      <div className="px-8 sm:px-6 lg:px-16 py-3 sm:py-8 lg:py-10">
        <div className="text-left mb-5 sm:mb-12">
          <h2 className="cursor-default font-grotesk text-3xl sm:text-4xl lg:text-[48px] font-bold text-black mb-4 sm:mb-3 leading-tight sm:leading-[76.8px] text-left">
            {content?.heading ? `${content.heading.line1} ${content.heading.line2}` : "How It Works"}
          </h2>
          <div className="font-inter flex flex-col sm:flex-row sm:items-center w-full gap-4 sm:gap-0">
            <p className="font-inter cursor-default text-base sm:text-lg text-gray-600">
              Simple Steps To Start Processing Your U.S. Passport
            </p>
            <Button
              asChild
              suppressHydrationWarning={true}
              className="text-white bg-[#006DCC] hover:bg-[#144066] rounded-full px-4 py-2 text-sm w-full sm:w-auto sm:ml-auto transition-all duration-300 ease-in-out"
            >
              <Link href={"/apply"}>Select A Passport Service</Link>
            </Button>
          </div>
        </div>

        <div className="font-inter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col w-full bg-white rounded-2xl border border-blue-100 transition-all duration-300"
            >
              <div className="rounded-tl-2xl rounded-tr-2xl bg-blue-50 transition-all duration-300 mb-6 w-full h-[150px] relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    loading="lazy"
                    src={step.imageSrc || "/placeholder.svg"}
                    alt={`${step.title} illustration`}
                    width={step.imageWidth}
                    height={step.imageHeight}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div className="p-1 inline-flex font-bold ml-4 items-center bg-blue-50 rounded-lg px-2 text-xs text-black sm:mb-5 self-start">
                {step.id}
              </div>
              <div className="flex-1 px-4 pb-2">
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-black mb-2 leading-tight">
                  {step.title}
                </h3>
                <div className="space-y-4">
                  {step.description.map((text, i) => (
                    <p
                      key={i}
                      className="text-gray-600 py-2 text-sm leading-relaxed"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
