"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHomepageContent } from "@/hooks/use-homepage-content";

// --- Your other imports remain unchanged ---
import { states, services } from "@/components/landing/homepage/data";
import { getCountryName, US_STATES } from "@/data/countries";
import { useCaseStore } from "@/store/use-case-store";
import PassportHeroSelect from "@/components/landing/common/PassportHeroSelect";
import RadioGroup from "@/components/landing/common/RadioGroup";
import VisaOptions from "@/components/landing/common/VisaHeroSelect";
import { generalFetchApi } from "@/lib/endpoints/endpoint";

// --- Interfaces remain unchanged ---
interface CountryOption {
  countryCode: string;
  countryName: string;
}
interface ToCountryOption {
  toCountryCode: string;
  toCountryName: string;
}

export default function Hero() {
  const content = useHomepageContent();
  const texts = content.heroSection;

  const { generalFormData, setGeneralFormData } = useCaseStore();
  const router = useRouter();

  const [chooseValue, setChooseValue] = useState("visa");
  const [activeIndexValue, setActiveIndexValue] = useState(0);

  const [fromCountries, setFromCountries] = useState<CountryOption[]>([]);
  const [toCountries, setToCountries] = useState<ToCountryOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [selectedCitizenOf, setSelectedCitizenOf] = useState(
    generalFormData?.citizenOf || ""
  );
  const [selectedResidingIn, setSelectedResidingIn] = useState(
    generalFormData?.residingIn || "AL"
  );
  const [selectedTravelingTo, setSelectedTravelingTo] = useState(
    generalFormData?.travelingTo || ""
  );
  const [selectedEVisaTravelingTo, setSelectedEVisaTravelingTo] = useState("");

  useEffect(() => {
    const fetchFromCountries = async () => {
      try {
        const response = await generalFetchApi.getEnabledFromCountries();
        if (response?.success && response?.data) {
          setFromCountries(response.data);
          if (!selectedCitizenOf && response.data.length > 0) {
            const defaultFrom =
              response.data.find(
                (c: CountryOption) => c.countryCode === "US"
              ) || response.data[0];
            setSelectedCitizenOf(defaultFrom.countryCode);
          }
        }
      } catch (error) {
        console.error("Error fetching from countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchFromCountries();
  }, []);

  useEffect(() => {
    const fetchToCountries = async () => {
      if (!selectedCitizenOf) return;
      try {
        const response =
          await generalFetchApi.getEnabledToCountries(selectedCitizenOf);
        if (response?.success && response?.data) {
          setToCountries(response.data);
          const currentToValid = response.data.some(
            (c: ToCountryOption) => c.toCountryCode === selectedTravelingTo
          );
          if (!selectedTravelingTo || !currentToValid) {
            setSelectedTravelingTo(
              response.data.length > 0 ? response.data[0].toCountryCode : ""
            );
          }
          const currentEVisaToValid = response.data.some(
            (c: ToCountryOption) => c.toCountryCode === selectedEVisaTravelingTo
          );
          if (!selectedEVisaTravelingTo || !currentEVisaToValid) {
            setSelectedEVisaTravelingTo(
              response.data.length > 0 ? response.data[0].toCountryCode : ""
            );
          }
        }
      } catch (error) {
        console.error("Error fetching to countries:", error);
      }
    };
    fetchToCountries();
  }, [selectedCitizenOf]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveIndexValue(Number(e.target.value));
  };

  const handleCitizenOfChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedCitizenOf(e.target.value);
  };

  const handleResidingInChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedResidingIn(e.target.value);
  };

  const handleVisaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedTravelingTo(e.target.value);
  };

  const handleEVisaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedEVisaTravelingTo(e.target.value);
  };

  return (
    <section id="hero_section" className="bg-brand-light pb-[196px]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-[3px] lg:gap-[10px] bg-white/30 rounded-full px-[5px] lg:px-[18px] min-h-[47px] w-full lg:w-auto">
              {/* 3. All static content is now rendered from the 'texts' object. */}
              <img src={texts.images.glow.src} alt={texts.images.glow.alt} />
              <p className="mb-0 !text-[12px] md:!text-[16px] font-medium">
                {texts.banner.text}
              </p>
            </div>
            <h1 className="mt-[10px] mb-[13px] text-[32px] md:text-[36px] lg:text-[46px] xl:text-[68px]">
              {texts.headings.main}
            </h1>
            <h4 className="text-[16px] xl:text-[18px] mb-[10px] mt-[13px]">
              {texts.headings.sub}
            </h4>
            <div className="max-w-[502px] lg:text-[14px] xl:text-[16px] mb-[10px] rich-text" dangerouslySetInnerHTML={{ __html: texts.description }} />
            <h5 className="text-[14px] lg:text-[16px] mb-[15px] max-w-[300px] md:max-w-full leading-[1.3]">
              {texts.headings.servicePrompt}
            </h5>
            <form>
              <RadioGroup
                services={services}
                chooseValue={chooseValue}
                setChooseValue={setChooseValue}
              />

              {chooseValue === "passport" && (
                <PassportHeroSelect
                  handleChange={handleChange}
                  activeIndexValue={activeIndexValue}
                />
              )}

              {chooseValue === "visa" && (
                <VisaOptions
                  link=""
                  btnText={texts.form.visaButtonText}
                  onSubmit={() => {
                    if (
                      !selectedCitizenOf ||
                      !selectedResidingIn ||
                      !selectedTravelingTo
                    ) {
                      alert(texts.form.validationAlert);
                      return;
                    }
                    setGeneralFormData({
                      ...generalFormData,
                      citizenOf: selectedCitizenOf,
                      residingIn: selectedResidingIn,
                      travelingTo: selectedTravelingTo,
                    });
                    router.push(
                      `/visas/${getCountryName(selectedTravelingTo)?.toLowerCase()}`
                    );
                  }}
                  fields={[
                    {
                      label: texts.form.labels.citizenOf,
                      name: "citizen",
                      value: selectedCitizenOf,
                      onChange: handleCitizenOfChange,
                      options: fromCountries.map((country) => ({
                        value: country.countryCode,
                        label: country.countryName,
                      })),
                    },
                    {
                      label: texts.form.labels.residingIn,
                      name: "residing_in",
                      value: selectedResidingIn,
                      onChange: handleResidingInChange,
                      options: US_STATES.map((state) => ({
                        value: state.code,
                        label: state.name,
                      })),
                    },
                    {
                      label: texts.form.labels.travelingTo,
                      name: "traveling_to",
                      value: selectedTravelingTo,
                      onChange: handleVisaChange,
                      options: toCountries.map((country) => ({
                        value: country.toCountryCode,
                        label: country.toCountryName,
                      })),
                    },
                  ]}
                />
              )}

              {chooseValue === "e-visa" && (
                <VisaOptions
                  link=""
                  btnText={texts.form.eVisaButtonText}
                  onSubmit={() => {
                    if (!selectedCitizenOf || !selectedEVisaTravelingTo) {
                      alert(texts.form.validationAlert);
                      return;
                    }
                    setGeneralFormData({
                      ...generalFormData,
                      citizenOf: selectedCitizenOf,
                      travelingTo: selectedEVisaTravelingTo,
                    });
                    router.push(
                      `/e-visas/${getCountryName(selectedEVisaTravelingTo)?.toLowerCase()}`
                    );
                  }}
                  fields={[
                    {
                      label: texts.form.labels.citizenOf,
                      name: "citizen",
                      value: selectedCitizenOf,
                      onChange: handleCitizenOfChange,
                      options: fromCountries.map((country) => ({
                        value: country.countryCode,
                        label: country.countryName,
                      })),
                    },
                    {
                      label: texts.form.labels.travelingTo,
                      name: "traveling_to",
                      value: selectedEVisaTravelingTo,
                      onChange: handleEVisaChange,
                      options: toCountries.map((country) => ({
                        value: country.toCountryCode,
                        label: country.toCountryName,
                      })),
                    },
                  ]}
                />
              )}
            </form>
            <span className="text-[#1c1c1c] inline-block mt-[18px] font-medium text-[14px]">
              {texts.contact.schedule}
            </span>
          </div>
          <div className="m-0 mt-[25px] md:ml-[-30px] md:mr-[-30px] lg:m-0 xl:ml-[-50px] xl:mr-[-60px]">
            <img src={texts.images.hero.src} alt={texts.images.hero.alt} />
          </div>
        </div>
      </div>
    </section>
  );
}