"use client";
import React from "react";

import { useCaseStore } from "@/store/use-case-store";
import { ContactUsCard } from "@/components/globals";

const SupportPage = () => {
  const { userData } = useCaseStore((state) => state);

  return (
    <section>
      <ContactUsCard userData={userData} />
    </section>
  );
};

export default SupportPage;
