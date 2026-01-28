import Plans from "./Plans";
import { useCaseStore } from "@/store/use-case-store";
import { useRouter } from "next/navigation";


export default function SelectVisaType({
  activePassportIndex,
  setActivePassportIndex,
  title,
  serviceTypes = [],
}: {
  activePassportIndex: number;
  setActivePassportIndex: (index: number) => void;
  title: string;
  serviceTypes: any[];
}) {
  const router = useRouter();
  const { generalFormData, setGeneralFormData } = useCaseStore((state) => state);

  // Check if country selections are missing
  const hasCountrySelections =
    generalFormData?.citizenOf &&
    generalFormData?.residingIn &&
    generalFormData?.travelingTo;

  // Map service types to display format
  const visaTypes = serviceTypes.map((serviceType) => ({
    id: serviceType._id,
    label: serviceType.serviceType,
    serviceTypeId: serviceType._id,
    silentKey: serviceType.silentKey,
  }));


  const handleTypeSelect = (index: number) => {
    setActivePassportIndex(index);
    const selectedVisaType = visaTypes[index];
    if (selectedVisaType) {
      setGeneralFormData({
        ...generalFormData,
        serviceType: selectedVisaType.serviceTypeId,
      });
    }
  };

  return (
    <>
      <div id="get_started" className="">
        <div className="my-[46px] mb-[42px] max-[767px]:my-[35px] max-[767px]:mb-0 max-[767px]:pb-[35px]">
          <h2 className="mb-[30px] text-center text-2xl md:text-3xl font-bold max-w-4xl mx-auto px-4">
            {title || "Select passport type"}
          </h2>

          {/* Show message if no service types available */}
          {!hasCountrySelections && visaTypes.length === 0 && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center shadow-sm">
                <svg
                  className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Country Selection Required
                </h4>
                <p className="text-gray-600 mb-6">
                  Please select your citizenship, residence, and travel destination
                  from the homepage to view available visa types.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-primary text-white px-8 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          )}

          {/* Show message if countries selected but no matching visa types */}
          {hasCountrySelections && visaTypes.length === 0 && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center shadow-sm">
                <svg
                  className="w-12 h-12 text-blue-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No {title.includes("passport") ? "Passport" : "Visa"} Types Available
                </h4>
                <p className="text-gray-600 mb-6">
                  {`Unfortunately, we don't currently offer services for your
                  selected criteria. Please try different selections or
                  contact us for assistance.`}
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-primary text-white px-8 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Change Country Selection
                </button>
              </div>
            </div>
          )}

          {/* Show visa types if available */}
          {visaTypes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-4 max-w-[1400px] mx-auto">
              {visaTypes.map((item, index) => (
                <label
                  key={index}
                  className="relative group cursor-pointer w-[calc(50%-8px)] md:w-[280px] lg:w-[300px]"
                >
                  <input
                    type="radio"
                    name="passport-section"
                    checked={activePassportIndex >= 0 && activePassportIndex === index}
                    onChange={() => handleTypeSelect(index)}
                    className="absolute opacity-0 pointer-events-none"
                  />

                  <div
                    className={`
                      relative flex flex-col justify-end p-5 md:p-6
                      h-[120px] md:h-[130px] rounded-2xl
                      transition-all duration-300 ease-out
                      border-2
                      ${activePassportIndex === index
                        ? "bg-[#122241] border-[#122241] text-white shadow-xl shadow-blue-900/20 translate-y-[-2px]"
                        : "bg-[#e0f2fe] border-transparent text-[#122241] hover:bg-[#d0ebfd] hover:border-blue-200 hover:shadow-lg active:scale-[0.98]"
                      }
                    `}
                  >
                    {/* Radio Indicator */}
                    <div
                      className={`
                        absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${activePassportIndex === index
                          ? "border-white bg-[#122241]"
                          : "border-blue-300/50 bg-white/50 group-hover:border-blue-400"
                        }
                      `}
                    >
                      <div className={`
                          w-2.5 h-2.5 rounded-full bg-white transition-all duration-300
                          ${activePassportIndex === index ? "scale-100" : "scale-0"}
                        `} />
                    </div>

                    <span className="font-bold text-base md:text-lg leading-tight pr-8">
                      {item.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {
        visaTypes.length > 0 && (
          <Plans isShown={activePassportIndex >= 0 && (activePassportIndex === 1 || activePassportIndex === 4)} />
        )
      }
    </>
  );
}
