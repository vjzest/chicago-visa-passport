"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ENV } from "@/lib/env";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "item-1",
    question: "Who is Chicago Passport & Visa Expedite?",
    answer:
      "Chicago Passport & Visa Expedite is a private company registered with U.S. Passport Agencies under the name Travel Center Tours, authorized to offer hand-carry commercial courier services on behalf of U.S. citizens who require passports. They specialize in expedited passport applications for individuals, families, and businesses, offering services such as passport renewals, new passports, child passports, replacements for lost passports, and name changes. Their goal is to provide secure, fast, and dependable passport solutions, ensuring a seamless and stress-free process for their clients.",
  },
  {
    id: "item-2",
    question: "What does it mean to expedite a passport?",
    answer:
      "Expediting a passport means speeding up the processing time so you receive your passport sooner than the standard government timeline. Chicago Passport & Visa Expedite offers expedited passport services, helping you obtain your passport in as little as 24 hours, depending on your needs and eligibility.",
  },
  {
    id: "item-3",
    question: "What is a passport book?",
    answer:
      "A passport book is an official government-issued travel document that allows you to travel internationally. It includes your personal details, photo, and travel history, and it is required for entry into most countries.",
  },
  {
    id: "item-4",
    question: "Do I need a passport if I want to travel to another state?",
    answer:
      "No, a passport is not required for domestic travel within the United States. However, starting May 7, 2025, you will need a REAL ID-compliant driver’s license or another TSA-approved form of identification to board domestic flights. A passport can also be used as a valid ID for domestic air travel.",
  },
  {
    id: "item-5",
    question:
      "Can I travel on vacation with my military passport or do I have to apply for a new tourist passport?",
    answer:
      "You can travel with your military passport if you're on official military orders. However, for personal or vacation travel, a regular tourist passport is usually required. If your military passport is not suitable for leisure travel, you will need to apply for a tourist passport.",
  },
];

const FAQPage = () => {
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  const handleItemClick = (itemId: string) => {
    setOpenItem(openItem === itemId ? undefined : itemId);
  };

  return (
    <section className="w-full mb-12">
      <div className="px-8 sm:px-6 lg:px-16 py-3 sm:py-4 lg:py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left Column - Header */}
          <div className="rounded-class">
            <div className="rounded-class relative w-full h-[350px] flex items-center justify-center text-center">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center rounded-class"
                style={{ backgroundImage: "url('/assets/faqq.jpg')" }}
              />

              {/* Overlay for better readability */}
              <div className="rounded-class absolute inset-0 bg-black bg-opacity-45"></div>

              {/* Content */}
              <div className="relative z-10 text-white px-6">
                <h1 className="font-grotesk text-2xl sm:text-3xl md:text-4xl font-bold">
                  Frequently Asked Questions
                </h1>
                <p className="mt-2 text-sm max-w-lg mx-auto font-inter">
                  Find answers to your most pressing questions about our
                  passport services and processes.
                </p>
                <div className="pt-4 flex justify-center">
                  <Link href={"/apply?service-type=new-adult-passport"}>
                    <Button
                      suppressHydrationWarning={true}
                      variant="default"
                      className="text-sm bg-[#006DCC] text-white px-6 py-3 rounded-full hover:bg-[#144066] transition"
                    >
                      Start Your Application
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div>
            <Accordion
              type="single"
              collapsible
              className="space-y-4"
              value={openItem}
              onValueChange={setOpenItem}
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-gray-100 rounded-lg border-none cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleItemClick(faq.id)}
                >
                  <div className="flex justify-between items-center">
                    <AccordionTrigger className="font-inter text-sm text-left font-semibold hover:no-underline text-gray-900 px-6 py-4 flex-1 [&[data-state=open]>svg]:hidden [&>svg]:hidden pointer-events-none">
                      {faq.question}
                    </AccordionTrigger>

                    <div className="px-4 pointer-events-none">
                      <Plus
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          openItem === faq.id ? "rotate-45" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>

                  <AccordionContent className="font-inter text-gray-600 text-sm leading-relaxed px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
