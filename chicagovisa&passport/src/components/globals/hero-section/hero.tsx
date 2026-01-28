"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCaseStore } from "@/store/use-case-store";
import { Button } from "@/components/ui/button";
import { Plane, CreditCard } from "lucide-react";
import { CountryCombobox } from "./country-combobox";
import { StateCombobox } from "./state-combobox";

const Hero = ({ content }: { content?: any }) => {
  const router = useRouter();
  const { generalFormData, setGeneralFormData } = useCaseStore();

  // Set default values: US for citizen, IL for residing in (Illinois), CN for traveling to
  const [selectedCitizenOf, setSelectedCitizenOf] = useState(
    generalFormData?.citizenOf || "US"
  );
  const [selectedResidingIn, setSelectedResidingIn] = useState(
    generalFormData?.residingIn || "AL"
  );
  const [selectedTravelingTo, setSelectedTravelingTo] = useState(
    generalFormData?.travelingTo || "CN"
  );
  const [activeTab, setActiveTab] = useState<"Passport" | "Visa" | "E Visa">(
    "Visa"
  );

  const handleGetVisaOptions = () => {
    if (activeTab === "Visa") {
      if (!selectedCitizenOf || !selectedResidingIn || !selectedTravelingTo) {
        alert("Please select all fields");
        return;
      }
      // Store visa selection in generalFormData
      setGeneralFormData({
        ...generalFormData,
        citizenOf: selectedCitizenOf,
        residingIn: selectedResidingIn,
        travelingTo: selectedTravelingTo,
      });
      router.push("/apply");
    } else if (activeTab === "Passport") {
      // Navigate to passport services
      router.push("/apply");
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-white">
      {/* Green indicator with text */}
      <div className="absolute top-8 left-8 z-20 hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-800">
          {content?.banner?.text || "Fast, Secure & Easy Passport Solutions"}
        </span>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-6">
              <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-black">
                {content?.headings?.main ? (
                  <span dangerouslySetInnerHTML={{ __html: content.headings.main }} />
                ) : (
                  <>
                    Chicago
                    <br />
                    <span className="block">Passport & Visa</span>
                    <span className="block">Expedite Services</span>
                  </>
                )}
              </h1>

              <p className="font-inter text-base md:text-lg text-gray-700 max-w-xl">
                {content?.headings?.sub || "Apply online now or visit our Chicago office to apply in person."}
              </p>

              <p className="font-inter text-sm md:text-base text-gray-600 max-w-xl">
                {content?.description || "Travel documents made simple - secure, fast, and stress-free passport and visa services right here in Chicago. Whether online or in person, we get you ready to go without the wait."}
              </p>

              {/* Tabs */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 text-sm md:text-base">
                  Select Your Service and Passport or Visa Type that you Need:
                </h3>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => setActiveTab("Passport")}
                    variant={activeTab === "Passport" ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 ${activeTab === "Passport"
                        ? "bg-[#1e3a5f] text-white hover:bg-[#2a4a7f]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Passport
                  </Button>
                  <Button
                    onClick={() => setActiveTab("Visa")}
                    variant={activeTab === "Visa" ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 ${activeTab === "Visa"
                        ? "bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Visa
                  </Button>
                  <Button
                    onClick={() => setActiveTab("E Visa")}
                    variant={activeTab === "E Visa" ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 ${activeTab === "E Visa"
                        ? "bg-[#1e3a5f] text-white hover:bg-[#2a4a7f]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    E Visa
                  </Button>
                </div>

                {/* Visa Selection Form */}
                {activeTab === "Visa" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <CountryCombobox
                      label="Citizen Of:"
                      value={selectedCitizenOf}
                      onValueChange={setSelectedCitizenOf}
                      placeholder="Select country..."
                    />

                    <StateCombobox
                      label="Residing In:"
                      value={selectedResidingIn}
                      onValueChange={setSelectedResidingIn}
                      placeholder="Select state..."
                    />

                    <CountryCombobox
                      label="Traveling To:"
                      value={selectedTravelingTo}
                      onValueChange={setSelectedTravelingTo}
                      placeholder="Select country..."
                    />
                  </div>
                )}

                {/* Get Visa Options Button */}
                {activeTab === "Visa" && (
                  <Button
                    onClick={handleGetVisaOptions}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md px-8 py-6 text-base font-semibold"
                  >
                    {content?.form?.visaButtonText || "Get Visa Options"}
                  </Button>
                )}

                {activeTab === "Passport" && (
                  <Button
                    onClick={handleGetVisaOptions}
                    className="bg-[#1e3a5f] hover:bg-[#2a4a7f] text-white rounded-md px-8 py-6 text-base font-semibold"
                  >
                    {content?.form?.passportButtonText || "Get Passport Options"}
                  </Button>
                )}
              </div>

              {/* Call now section */}
              <div className="text-sm md:text-base font-medium text-gray-800 pt-4">
                CALL NOW | Mon-Fri: 8:30am-5:00pm Sat-Sun: Closed
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/passport.webp"
                  alt="Chicago Passport and Visa Services"
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />

                {/* Floating badges */}
                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-sm">
                    Expedited Service
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-sm">Visa Assistance</span>
                </div>

                {/* Travelers helped badge */}
                <div className="absolute bottom-6 left-6 bg-white px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-green-400 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Over 10,000 Travelers</p>
                      <p className="text-xs text-gray-600">
                        Helped - And Counting!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
