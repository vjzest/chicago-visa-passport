"use client";
import React, { useState } from "react";
import { services } from "@/data/services";
import Link from "next/link";

const Requirement = () => {
  const service = services["damaged-passport"];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  // Split items into two columns
  const leftColumn = service.requirements.items.filter(
    (_, index) => index % 2 === 0
  );
  const rightColumn = service.requirements.items.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <div className="w-full px-6 md:px-10 py-10">
      <h2 className="font-grotesk text-2xl md:text-3xl font-bold text-[#222222] mb-4 text-center md:text-left">
        {service.requirements.title}
      </h2>
      <p className="text-[#666666] mb-8 text-center md:text-left">
        {service.requirements.description}
      </p>

      {/* Two-column responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {leftColumn.map((item) => (
            <div key={item.id} className="bg-[#F5F5F5] shadow-md rounded-lg">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F0F0F0] transition"
              >
                <span className="text-[#222222] font-bold text-sm flex-1 pr-4">
                  {item.title}
                </span>
                <span className="text-2xl text-[#666666] flex-shrink-0">
                  {expandedId === item.id ? "×" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedId === item.id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.description && (
                  <div className="p-3">
                    <p className="text-[#666666] text-sm">{item.description}</p>
                  </div>
                )}
                {Array.isArray(item?.points) &&
                  item.points.map((point: string, index: number) => (
                    <div key={index} className="px-3 py-1.5 flex items-start">
                      <span className="mr-2 text-[#666666]">•</span>
                      <p className="text-[#666666] text-sm">{point}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightColumn.map((item) => (
            <div key={item.id} className="bg-[#F5F5F5] shadow-md rounded-lg">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F0F0F0] transition"
              >
                <span className="text-[#222222] font-bold text-sm flex-1 pr-4">
                  {item.title}
                </span>
                <span className="text-2xl text-[#666666] flex-shrink-0">
                  {expandedId === item.id ? "×" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedId === item.id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.description && (
                  <div className="p-3">
                    <p className="text-[#666666] text-sm">{item.description}</p>
                  </div>
                )}
                {Array.isArray(item?.points) &&
                  item.points.map((point: string, index: number) => (
                    <div key={index} className="px-3 py-1.5 flex items-start">
                      <span className="mr-2 text-[#666666]">•</span>
                      <p className="text-[#666666] text-sm">{point}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 flex justify-center md:justify-start">
        <Link
          href={service.requirements.requirementButton.link}
          className="text-sm bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition"
        >
          {service.requirements.requirementButton.text}
        </Link>
      </div>
    </div>
  );
};

export default Requirement;
