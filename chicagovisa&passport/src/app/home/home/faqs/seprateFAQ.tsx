"use client"; // Add this directive at the top
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
import { BackgroundPattern } from "./back-ground-pattern";
import { ENV } from "@/lib/env";
import InfoBox from "@/components/pages/home/info";

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
  {
    id: "item-6",
    question:
      "I am in the military, do I still have to pay the government fee?",
    answer:
      "Military personnel are often eligible for reduced fees or fee exemptions for certain passport services, depending on the circumstances. For example, if you're applying for a passport for official government travel, you may not be required to pay the regular fee.",
  },
  {
    id: "item-7",
    question:
      "Can I travel on vacation with my military passport or do I have to apply for a new tourist passport?",
    answer:
      "A military passport can be used for official government travel, but for personal vacations, you will need to apply for a civilian tourist passport. Make sure to confirm the specific requirements for your destination, as some countries may not accept military passports for leisure travel.",
  },
  {
    id: "item-8",
    question: "Can I use my diplomatic passport to travel on vacation?",
    answer:
      "You cannot typically use a diplomatic passport for vacation travel, as it is issued for official government business. Diplomatic passports are not intended for personal leisure trips, so if you're traveling for vacation, you will need to apply for a regular tourist passport instead.",
  },
  {
    id: "item-9",
    question: "How much is the government fee for a passport book?",
    answer:
      "The government fee for a passport book is currently $130 for adults (16 years and older) and $100 for minors (under 16 years old). These fees cover the cost of the passport application and do not include additional services such as expedited processing or other options that may incur extra charges.",
  },
  {
    id: "item-10",
    question:
      "Did the Passport Agency recently increase the prices on their fees?",
    answer:
      "Yes, the Passport Agency has recently increased its fees. For example, in 2022, the fee for a standard adult passport book was raised from $110 to $130. These fee changes are implemented periodically, so it’s important to check the most up-to-date information before applying.",
  },
  {
    id: "item-11",
    question: "Can I wear my glasses when taking my passport photos?",
    answer:
      "No, you should not wear glasses in your passport photo. The U.S. Department of State recommends removing your glasses to avoid any glare or reflections that might obscure your face. If you must wear them for medical reasons, you will need to provide a doctor’s note, but this is generally discouraged.",
  },
  {
    id: "item-12",
    question: "How often does a passport expire?",
    answer:
      "A standard U.S. passport typically expires every 10 years for adults (ages 16 and older) and every 5 years for minors (under 16 years old). It’s recommended to renew your passport at least six months before it expires, especially if you plan to travel internationally, as many countries require that your passport is valid for at least six months beyond your planned departure date.",
  },
  {
    id: "item-13",
    question: "Where should I go to have my passport documents executed?",
    answer:
      "To have your passport documents executed, you should visit an authorized passport acceptance facility. At Chicago Passport & Visa Expedite, we provide you with the guidance and necessary resources to help you complete your passport application and submit your documents at the appropriate facility.",
  },
  {
    id: "item-14",
    question:
      "Can I hand write the application if I am expediting my passport?",
    answer:
      "While you can handwrite your passport application, it's generally recommended to complete the application online for a faster and more accurate process.",
  },
  {
    id: "item-15",
    question: "Who should apply for a US passport?",
    answer:
      "Anyone who is a U.S. citizen and plans to travel internationally should apply for a U.S. passport. This includes children, adults, and even U.S. nationals who have not yet obtained one.",
  },
  {
    id: "item-16",
    question: "Can I get a US passport with my permanent resident card?",
    answer:
      "No, a permanent resident card (Green Card) cannot be used to apply for a U.S. passport. To get a U.S. passport, you must first become a U.S. citizen through naturalization. Only U.S. citizens are eligible to apply for a passport.",
  },
  {
    id: "item-17",
    question:
      "I need a passport however, I lost my naturalization certificate but I have a copy of it, what do I do?",
    answer:
      "If you've lost your naturalization certificate but have a copy, you can still apply for a U.S. passport, but you will need to submit the copy of your certificate with your application. However, it’s recommended to replace the lost certificate as soon as possible by applying for a replacement with U.S. Citizenship and Immigration Services (USCIS).",
  },
  {
    id: "item-18",
    question: "Can I order a passport online and receive it through the mail?",
    answer:
      "Yes, you can complete the passport application online, but you still need to submit your documents in person at a passport acceptance facility for first-time applicants or if you are making certain changes. After your application is processed, your new passport will be mailed to you. For renewals, you can mail your application, and the passport will be returned by mail.",
  },
  {
    id: "item-19",
    question:
      "Will I get my old passport back with my new passport? I want it back for keepsake.",
    answer:
      "Yes, you will receive your old passport back when you apply for a new one. The old passport will be returned to you with a hole punched through it to indicate that it is no longer valid. If you want to keep it as a keepsake, it’s important to request its return when you apply for a new passport.",
  },
  {
    id: "item-20",
    question: "Can I use my Hospital birth certificate to obtain a passport?",
    answer:
      "A hospital birth certificate is generally not acceptable for obtaining a U.S. passport. You need an official, government-issued birth certificate that includes the registrar's signature, the raised seal, and the date of birth. A hospital-issued certificate is considered a certification of birth and is not sufficient for passport applications.",
  },
  {
    id: "item-21",
    question:
      "Can I use the birth certificate that the midwife gave my parents to obtain a passport?",
    answer:
      "The birth certificate given by a midwife is often considered a certification of birth and may not meet the requirements for a passport. To apply for a passport, you need an official, government-issued birth certificate with a raised seal, registrar’s signature, and other specific details.",
  },
  {
    id: "item-22",
    question:
      "How much identification do I need, if my driver license is not 6 months old?",
    answer:
      "If your driver’s license is not yet six months old, you will need to provide additional forms of identification to apply for a passport. Typically, you can submit a combination of documents, such as a birth certificate and a current photo ID.",
  },
  {
    id: "item-23",
    question: "How will I find out if I have been denied a passport?",
    answer:
      "If your passport application is denied, you will be notified in writing by the U.S. Department of State. The letter will include the reason for the denial and instructions on how to address any issues or take corrective actions. You may be required to provide additional documentation or clarify discrepancies before your passport can be approved.",
  },
  {
    id: "item-24",
    question: "How will I find out if my passport application was suspended?",
    answer:
      "If your passport application is suspended, you will be informed by the U.S. Department of State. This notification typically comes by mail and will explain the reason for the suspension, along with any steps you need to take to resolve the issue. It’s important to carefully review the letter to understand the next steps for lifting the suspension.",
  },
  {
    id: "item-25",
    question: "How soon will I know when my passport is suspended?",
    answer:
      "The U.S. Department of State will notify you as soon as your passport application is suspended, usually through a formal letter. The timeframe for receiving this notification can vary, but it is typically within a few weeks after the suspension occurs.",
  },
  {
    id: "item-26",
    question:
      "Can the Passport Agency give me information about my passport over the phone?",
    answer:
      "Yes, the Passport Agency can provide information about your passport status over the phone, but only if you provide specific details like your application number or other identifying information. For security reasons, they may not be able to give detailed updates without verifying your identity.",
  },
  {
    id: "item-27",
    question:
      "Will the Passport Agency contact me when my passport is ready to be shipped back to me?",
    answer:
      "The Passport Agency will not typically contact you directly when your passport is ready to be shipped. However, you can track the status of your passport online, and once it’s processed, it will be mailed to the address provided on your application.",
  },
  {
    id: "item-28",
    question:
      "I need to give the Passport Agency my new mailing address, is that necessary?",
    answer:
      "Yes, it is important to update the Passport Agency with your new mailing address to ensure that your passport is sent to the correct location. If you've changed your address after applying, notify the agency as soon as possible.",
  },
  {
    id: "item-29",
    question:
      "What happens if I owe child support, can I still get a passport?",
    answer:
      "If you owe child support and the amount exceeds $2,500, the U.S. Department of State may deny your passport application. The government has the authority to block the issuance of a passport for individuals with significant child support arrears. ",
  },
  {
    id: "item-30",
    question: "Can I get a passport if I owe the IRS money?",
    answer:
      "Owing money to the IRS does not automatically prevent you from obtaining a passport. However, if the IRS has filed a certified notice of federal tax lien or if you have a serious delinquency on your taxes, it may cause complications with your passport application.",
  },
  {
    id: "item-31",
    question: "Can I get a passport if I am a convicted felon?",
    answer:
      "Yes, you can still get a passport if you are a convicted felon, provided you meet other requirements for obtaining a passport. However, there are some situations where a felon may be denied a passport, such as if they are currently on parole or probation or if they are under specific court-ordered restrictions, such as not being allowed to travel outside the U.S. ",
  },
  {
    id: "item-32",
    question:
      "If I was denied a passport before, how long is the waiting period before I can apply for another passport?",
    answer:
      "If your passport application was denied, you may be able to reapply immediately, depending on the reason for the denial. However, if the denial was due to legal issues such as unpaid child support, IRS debt, or other restrictions, you will need to resolve those issues before applying again. It’s recommended to address the reasons for the denial and ensure they are cleared up before reapplying to avoid further delays.",
  },
  {
    id: "item-33",
    question: "Can I get a passport to visit Israel and then visit Palestine?",
    answer:
      "Yes, you can obtain a U.S. passport to visit Israel. However, when traveling to Palestine, there may be additional travel restrictions, depending on where you plan to go. The U.S. does not recognize Palestine as an independent state, and while traveling in areas like the West Bank or Gaza Strip, you may face complications with border control and entry points.",
  },
  {
    id: "item-34",
    question: "I want to visit Cuba, what do I need to do?",
    answer:
      "If you’re a U.S. citizen planning to visit Cuba, you’ll need to meet certain criteria as U.S. government restrictions apply to travel to the country. You must qualify under one of the authorized travel categories, such as family visits, educational activities, or support for the Cuban people. Additionally, you’ll need to apply for a Cuban visa and ensure that you comply with both U.S. and Cuban regulations.",
  },
  {
    id: "item-35",
    question:
      "Can I get on a cruise without a passport and just my birth certificate?",
    answer:
      "Yes, for closed-loop cruises (cruises that begin and end at the same U.S. port), you can typically board with just a birth certificate and a government-issued photo ID, such as a driver’s license. However, if you are traveling to foreign ports or taking a cruise that does not meet the closed-loop criteria, you will need a valid passport.",
  },
  {
    id: "item-36",
    question: "Should I still keep my expired passport or dispose of them?",
    answer:
      "It’s recommended to keep your expired passport, especially if it has unused visas or other important information. While it is no longer valid for travel, it can serve as a form of identification, or in some cases, you may need to submit it as part of the process when applying for a new passport. However, if you don’t wish to keep it, you can safely dispose of it or even send it to the passport agency for cancellation.",
  },
  {
    id: "item-37",
    question: "What is an acceptance agent (AA)?",
    answer:
      "An acceptance agent (AA) is an authorized person who helps you submit your passport application. They verify your identity, witness your signature, and accept your passport application and supporting documents on behalf of the U.S. Department of State. Acceptance agents are typically found at post offices, libraries, and other government offices.",
  },
  {
    id: "item-38",
    question: "Where online can I get a government application for a passport?",
    answer:
      "You can get a government passport application online through the U.S. Department of State's official website at travel.state.gov. However, if you need assistance with the application process or want to expedite your passport, Chicago Passport & Visa Expedite can help guide you through the application process, including offering expedited services to get your passport quickly.",
  },
  {
    id: "item-39",
    question: "How can I find the closest Passport Agency in my area?",
    answer:
      "To find the nearest Passport Agency, visit the U.S. Department of State’s website at travel.state.gov, where you can search for a location by entering your city or zip code. If you're looking to expedite your passport, Chicago Passport & Visa Expedite offers assistance in finding the nearest agency and navigating the process for quick passport issuance.",
  },
  {
    id: "item-40",
    question: "Can the Passport Agency issue me a passport book the same day?",
    answer:
      "Yes, the Passport Agency can issue you a passport book the same day if you have a valid emergency situation. At Chicago Passport & Visa Expedite, we specialize in expedited passport services, and we can assist you with making the necessary arrangements for same-day passport issuance at a regional passport agency, ensuring that you can travel without delay.",
  },
  {
    id: "item-41",
    question:
      "Why can't I just send my new passport application without having to visit an acceptance agent?",
    answer:
      "For first-time passport applicants, the U.S. Department of State requires that you submit your application in person at an acceptance agent location to verify your identity and witness your signature. This step ensures that the application is valid and authentic. While you can submit renewals by mail, new applications require this in-person visit for security and verification purposes.",
  },
  {
    id: "item-42",
    question:
      "Why do I have to send in original documents when applying for a passport?",
    answer:
      "When applying for a passport, the U.S. Department of State requires original documents, such as your birth certificate or proof of citizenship, to verify your identity and eligibility. These original documents ensure that the information provided is accurate and authentic. Once your application is processed, your original documents will be returned to you. ",
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <BackgroundPattern />
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-5 sm:mb-16">
            <h1 className="text-[#144066] font-grotesk text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="font-inter mt-6 text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Find answers to your most pressing questions about our passport
              services and processes.
            </p>
            <div className="mt-8">
              <Link href={"/apply"}>
                <Button
                  suppressHydrationWarning={true}
                  variant="default"
                  className="bg-[#006DCC] hover:bg-[#144066] text-white transition-colors duration-300 rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  Start Your Application
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="font-inter mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={openItem}
              onValueChange={setOpenItem}
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-[#F5F5F5] shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left">
                    <span className="font-inter font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2">
                    <p className="font-inter text-gray-600 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <InfoBox />
    </div>
  );
}
