"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axiosInstance from "@/lib/config/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type IFAQ = {
  id: string | number;
  question: string;
  answer: string;
};

type faqProps = {
  data: IFAQ[];
};

const Faq = () => {
  const [faqList, setFaqList] = useState<IFAQ[]>([]);
  const fetchFaqs = async () => {
    try {
      const { data } = await axiosInstance.get("/common/faq");
      if (!data?.success) throw new Error(data?.message);
      setFaqList(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    fetchFaqs();
  }, []);
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {faqList.map((item, index) => (
          <div
            className="flex items-center justify-center"
            key={`item-${index + 1}`}
          >
            <AccordionItem
              value={`item-${index + 1}`}
              className="w-11/12 px-3 hover:bg-accent"
            >
              <AccordionTrigger className="text-lg no-underline hover:no-underline  md:text-xl">
                {item?.question}
              </AccordionTrigger>
              <AccordionContent>{item?.answer}</AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
