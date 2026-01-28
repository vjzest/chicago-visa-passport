"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ENV } from "@/lib/env";

const SERVICES = {
  "New Passport": "new-adult-passport",
  "Passport Renewal": "passport-renewal",
  "Child Passport": "child-passport",
  "Name Change": "passport-name-change",
  "Lost/Stolen Passport": "lost/stolen-passport",
  "Damaged Passport": "damaged-passport",
  "Passport Card": "passport-card",
};

const ServiceSelect = ({
  serviceTitle,
}: {
  serviceTitle: keyof typeof SERVICES;
}) => {
  const serviceKey = SERVICES[serviceTitle];
  const [selectedService, setSelectedService] = useState(serviceKey);
  const applyUrl = `${ENV.APPLY_URL}/apply?service-type=${selectedService}`;
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        id="serviceTypeSelectCard"
        className="bg-deep-blue rounded-[20px] p-4 border flex flex-col items-center"
      >
        <h2
          className="mb-2 mt-2 scroll-mt-10 text-xl font-semibold text-white text-center"
          id="serviceTypeSelectCard "
        >
          Select a service
        </h2>
        <select
          defaultValue={serviceKey}
          onChange={(e) => setSelectedService(e.target.value)}
          className="mb-3 w-80 max-w-[90%] p-2 rounded-[10px] border"
        >
          <option value="" disabled>
            Select Service Type
          </option>
          <option value="new-adult-passport">New Passport</option>
          <option value="passport-renewal">Passport Renewal</option>
          <option value="child-passport">Child Passport</option>
          <option value="passport-name-change">Name Change</option>
          <option value="lost/stolen-passport">Lost/Stolen Passport</option>
          <option value="damaged-passport">Damaged Passport</option>
          <option value="passport-card">Passport Card</option>
        </select>{" "}
      </div>
      <div className="text-center mb-8 sm:mb-12">
        <Link
          href={applyUrl}
          className="inline-block bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-[#144066] transition"
        >
          Start Application
        </Link>
      </div>
    </div>
  );
};

export default ServiceSelect;
