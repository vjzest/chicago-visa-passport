import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFormattedDateAndTime } from "@/lib/utils";

const ActionNotes = ({ application }: { application: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actionNotes = application?.actionNotes as {
    note: string;
    createdAt: string;
  }[];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="text-xl font-semibold"
          onClick={() => setIsOpen(!isOpen)}
        >
          Action Notes
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 w-full">
            <h1 className="text-start font-semibold text-lg mb-2">Notes :</h1>
            <div className=" h-60 w-[90%] overflow-y-auto">
              {actionNotes?.length > 0 ? (
                actionNotes?.map((note, index) => (
                  <div
                    key={index}
                    className={
                      "mb-2 rounded-md  border border-gray-200  p-2 shadow transition-shadow duration-200 hover:shadow-md"
                    }
                  >
                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                      <span>
                        {getFormattedDateAndTime(note?.createdAt).formattedDate}{" "}
                        -{" "}
                        {getFormattedDateAndTime(note?.createdAt).formattedTime}
                      </span>
                      <span></span>{" "}
                    </div>

                    <div className="mb-2">
                      <div className="mb-1 flex items-center gap-4"></div>
                      <div className="min-h-10 overflow-hidden rounded bg-white p-2 text-sm leading-tight text-gray-800 shadow-inner">
                        <span className="break-words">{note?.note}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 mx-auto text-base">
                  No action notes
                </span>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ActionNotes;
