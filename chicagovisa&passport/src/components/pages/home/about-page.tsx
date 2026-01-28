// "use client";
// import React from "react";
// import Image from "next/image";
// import Features from "@/components/globals/hero-section/features";
// import AboutUs from "../../../../public/about-us/about-us.jpg";
// import ContactForm from "@/components/pages/home/contact-page";
// import { ENV } from "@/lib/env";
// import Link from "next/link";
// import { Button } from "../ui/button";

// const About = () => {
//   return (
//     <>
//       {/* <div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh]">
//         <Image
//           src="/about-us/about2.png"
//           alt="Banner background"
//           layout="fill"
//           objectFit="cover"
//           className="brightness-[0.9]"
//           priority
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h1 className="text-2xl sm:text-3xl md:text-6xl font-grotesk font-bold text-white">
//               About Us
//             </h1>
//           </div>
//         </div>
//       </div> */}

//       <div className="bg-[#F2F9FF] relative w-full min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh]">
//         <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center">
//           {/* Left Side - Text */}
//           <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
//             <h1 className="mt-5 font-grotesk text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#144066] mb-6">
//               About Us
//             </h1>
//           </div>

//           {/* Right Side - Image */}
//           <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-5">
//             <Image
//               src="/about-us/about2.png"
//               alt="Passport Renewal Service"
//               width={390}
//               height={390}
//               className="object-contain max-w-full h-auto"
//               priority
//             />
//           </div>
//         </div>
//       </div>

//       <div>
//         <Features />
//       </div>

//       <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-grotesk font-bold text-[#0A2F6C] leading-tight">
//                 Your Trusted Passport Expediting Service
//               </h1>
//               <p className="text-[#666666] text-sm sm:text-base md:text-[16px] leading-relaxed sm:leading-relaxed font-inter font-normal sm:font-medium">
//                 At Chicago Passport & Visa Expedite, we recognize the need for secure, fast and
//                 dependable passport solutions. As a leading passport courier in
//                 the United States, we specialize in expedited passport
//                 applications for individuals, families, and businesses. Whether
//                 you&apos;re preparing for a last-minute trip, managing an urgent
//                 business assignment abroad, or requiring a quick passport
//                 renewal, we&apos;re here to make the process secure, seamless
//                 and stress-free.
//               </p>

//               <div className="pt-3 sm:pt-4 font-inter">
//                 <Link href={"/apply"}>
//                   <Button
//                     suppressHydrationWarning={true}
//                     className="bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-blue-900 transition-colors"
//                   >
//                     Start Your Application
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
//               <Image
//                 src={AboutUs}
//                 alt="Woman smiling while working on laptop"
//                 fill
//                 sizes="(max-width: 1024px) 100vw, 50vw"
//                 className="object-cover"
//                 style={{ objectPosition: "center" }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <ContactForm />
//     </>
//   );
// };

// export default About;

"use client";
import React from "react";
import Image from "next/image";
import Features from "@/components/globals/hero-section/features";
import AboutUs from "../../../../public/about-us/about-us.jpg";
import ContactForm from "@/components/pages/home/contact-page";
import { ENV } from "@/lib/env";
import Link from "next/link";
import { Button } from "../../ui/button";
import InfoBox from "@/components/pages/home/info";

const About = () => {
  return (
    <div>
      <div className="h-[50vh] bg-[#F2F9FF] relative">
        {/* Main container - changes to column on mobile */}
        <div className="w-[90%] h-full mx-auto hidden lg:flex">
          {/* Desktop Layout */}
          <div className="w-1/2 flex justify-center items-center">
            <h1 className="mt-5 font-grotesk text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#144066] mb-6">
              About Us
            </h1>
          </div>

          <div className="w-1/2 relative">
            <div className="h-[70%] absolute bottom-0">
              <Image
                src="/about-us/about2.png"
                alt="about-banner"
                width={800}
                height={800}
                className="object-contain h-full rounded-lg  "
                priority
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="w-full h-full mx-auto flex flex-col lg:hidden">
          {/* Mobile Text Section */}
          <div className="w-full pt-6 px-4">
            <h1 className="font-grotesk text-3xl font-bold leading-tight text-[#144066] text-center">
              About Us
            </h1>
          </div>

          {/* Mobile Image Section */}
          <div className="flex-1 relative  px-4  ">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/about-us/about2.png"
                alt="about-banner"
                width={500}
                height={500}
                className="object-contain max-h-[300px] rounded-lg absolute bottom-0"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Features />
      </div>

      <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-grotesk font-bold text-[#0A2F6C] leading-tight">
                Your Trusted Passport Expediting Service
              </h1>
              <p className="text-[#666666] text-sm sm:text-base md:text-[16px] leading-relaxed sm:leading-relaxed font-inter font-normal sm:font-medium">
                We are a private business registered with U.S. Passport Agencies
                under the name Travel Center Tours, explicitly authorized by the
                U.S. Government to provide a specific Hand-Carry Expedited
                Passport Services. As an approved, authorized and registered
                commercial courier, we are explicitly permitted to offer this
                specialized service on behalf of U.S. citizens who require
                Hand-Carry Expedited Passport processing through authorized
                channels.
              </p>
              <p className="text-[#666666] text-sm sm:text-base md:text-[16px] leading-relaxed sm:leading-relaxed font-inter font-normal sm:font-medium">
                At Chicago Passport & Visa Expedite, we recognize the need for secure, fast and
                dependable passport solutions. As a leading passport courier in
                the United States, we specialize in expedited passport
                applications for individuals, families, and businesses. Whether
                you&apos;re preparing for a last-minute trip, managing an urgent
                business assignment abroad, or requiring a quick passport
                renewal, we&apos;re here to make the process secure, seamless
                and stress-free.
              </p>

              <div className="pt-3 sm:pt-4 font-inter">
                <Link href={"/apply"}>
                  <Button
                    suppressHydrationWarning={true}
                    className="bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-blue-900 transition-colors"
                  >
                    Start Your Application
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src={AboutUs}
                alt="Woman smiling while working on laptop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: "center" }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <ContactForm />
      <InfoBox />
    </div>
  );
};

export default About;
