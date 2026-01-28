interface TravelTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TravelTabs({ activeTab, setActiveTab }: TravelTabsProps) {
  const tabs = [
    { label: "Passport", value: "passport" },
    { label: "Visa", value: "visa" },
    { label: "E Visa", value: "evisa" },
  ];

  return (
    <div className="mb-[46px] flex items-center justify-center gap-[16px] max-sm:gap-[10px] max-sm:mb-[25px]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`cursor-pointer px-[44px] h-[52px] bg-[#122241] text-white font-medium rounded-[10px] transition-all duration-200 
          max-sm:px-[28px] max-sm:h-[45px] max-sm:text-[14px]
          ${
            activeTab === tab.value
              ? "bg-[#be1e2d] shadow-[0_15px_15px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
