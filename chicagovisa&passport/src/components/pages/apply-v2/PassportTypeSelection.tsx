import React from "react";
import { useCaseStore } from "@/store/use-case-store";
import { useRouter } from "next/navigation";

const PassportTypeSelection: React.FC<{ serviceTypes: any[] }> = ({
  serviceTypes,
}) => {
  const router = useRouter();
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );

  // Check if country selections are missing
  const hasCountrySelections =
    generalFormData?.citizenOf &&
    generalFormData?.residingIn &&
    generalFormData?.travelingTo;

  const passportTypeIcons = {
    "new-passport": (
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
    ),
    "name-change": (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
    ),
    renewal: (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    ),
    "lost-passport": (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    ),
    "child-passport": (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    ),
    "passport-card": (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
    ),
    "damaged-passport": (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-600"
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
      </div>
    ),
  };

  const passportTypes = serviceTypes.map((serviceType) => ({
    id: serviceType.silentKey,
    label: serviceType.label,
    serviceTypeId: serviceType.value,
    description: serviceType?.description,
    icon:
      passportTypeIcons[
      serviceType?.silentKey as keyof typeof passportTypeIcons
      ] || passportTypeIcons["new-passport"],
  }));

  const handleTypeSelect = (passportType: any) => {
    setGeneralFormData({
      ...generalFormData,
      serviceType: passportType.serviceTypeId,
      serviceLevel: null,
      additionalServices: [],
      addons: null,
      appliedPromo: null,
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("service-type");
    router.replace(url.toString(), { scroll: false });
  };

  const selectedServiceType = passportTypes.find(
    (type) => type.serviceTypeId === generalFormData?.serviceType
  );

  return (
    <div className="space-y-6" id="serviceTypeSelectCard">
      {/* Information Banner */}
      {generalFormData?.serviceType && (
        <div className="bg-primary/5 border border-primary rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-1 mt-0.5">
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-1">VISA TYPE</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedServiceType?.description,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Visa Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Visa Type:
        </h3>

        {/* Show message if no service types available */}
        {!hasCountrySelections && passportTypes.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-yellow-500 mx-auto mb-3"
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
            <h4 className="font-semibold text-gray-900 mb-2">
              Country Selection Required
            </h4>
            <p className="text-gray-600 mb-4">
              Please select your citizenship, residence, and travel destination
              from the homepage to view available visa types.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        )}

        {/* Show message if countries selected but no matching visa types */}
        {hasCountrySelections && passportTypes.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-blue-500 mx-auto mb-3"
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
            <h4 className="font-semibold text-gray-900 mb-2">
              No Visa Types Available
            </h4>
            <p className="text-gray-600 mb-4">
              {`Unfortunately, we don't currently offer visa services for your
              selected country combination. Please try different selections or
              contact us for assistance.`}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Change Country Selection
            </button>
          </div>
        )}

        {/* Show visa types if available */}
        {passportTypes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {passportTypes.map((type) => {
              const isSelected =
                generalFormData?.serviceType === type.serviceTypeId;

              return (
                <button
                  key={type.serviceTypeId}
                  onClick={() => handleTypeSelect(type)}
                  className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md min-h-[100px] flex flex-col items-center justify-center
                  ${isSelected
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
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
                  )}

                  {/* Icon */}
                  <div className="mb-2 flex justify-center">
                    {React.cloneElement(type.icon, {
                      className: `${type.icon.props.className} ${isSelected ? "text-green-600" : ""
                        }`,
                    })}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <h4
                      className={`font-medium text-xs leading-tight
                    ${isSelected ? "text-green-900" : "text-gray-900"}`}
                    >
                      {type.label}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassportTypeSelection;
