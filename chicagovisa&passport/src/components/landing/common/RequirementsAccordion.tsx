import { useState } from "react";

interface RequirementContent {
  text?: string;
  list?: string[];
  cta?: {
    text: string;
    link: string;
  };
}

interface Requirement {
  section_title: string;
  content: RequirementContent;
}

interface RequirementsAccordionProps {
  country: string;
  requirements: Requirement[];
  description?: string;
}

export default function RequirementsAccordion({
  country,
  requirements,
  description,
}: RequirementsAccordionProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="pb-[50px] md:pb-[84px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[20px]">
        <div className="col-span-12 md:col-span-5">
          <div className="sticky top-[20px]">
            <h2>{country} Requirements</h2>
            {description && (
              <div
                className="mt-[15px] max-w-[456px] rich-text"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 flex flex-col gap-[10px] max-w-[624px] ml-auto w-full">
          {requirements.map((req, i) => (
            <SingleAccordion
              key={i}
              title={req.section_title}
              content={req.content}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SingleAccordionProps {
  title: string;
  content: RequirementContent;
  defaultOpen?: boolean;
}

function SingleAccordion({ title, content, defaultOpen = false }: SingleAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);



  return (
    <div
      className={`rounded-[20px] cursor-pointer transition-all duration-200 
      ${open ? "bg-[#122241] *:text-white" : "bg-[#f8f9fd]"}`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-[23px]  py-[25px] px-[34px] max-[1024px]:px-[20px] max-[767px]:gap-[15px] max-[767px]:p-[20px] "
      >
        <span
          className={`
            w-[24px] h-[24px] flex justify-center items-center rounded-full border border-[#1c1c1c]
            ${open ? "border-white" : ""}
          `}
        >
          {open ? "−" : "+"}
        </span>

        <h3
          className={`
            mb-0 flex-1
            max-[1024px]:text-[18px]
            max-[767px]:text-[16px]
            ${open ? "text-white" : ""} 
          `}
        >
          {title}
        </h3>
      </div>

      {open && (
        <div
          className="
      pl-[82px] pr-[41px] pb-[20px]
      max-[1024px]:pl-[20px]
      text-white
    "
        >
          {content.text && (
            <div
              dangerouslySetInnerHTML={{ __html: content.text }}
              className="
              [&_p]:text-white 
              [&_p]:text-[16px]
              [&_ul]:list-disc 
              [&_ul]:pl-[20px]
              [&_ul]:text-white
              [&_ul]:text-[16px]
              [&_li]:text-white
              max-[767px]:[&_li]:text-[14px]
              [&_li]:mb-[10px]
              [&_a]:text-white 
              [&_a]:mb-[7px] 
              [&_a]:inline-block 
              [&_a]:underline 
              [&_a:hover]:text-[#be1e2d]
              rich-text
            "
            />
          )}

          {content.list && (
            <ul
              className="
          pl-[20px] flex flex-col gap-[8px] mt-[10px]
          max-[767px]:text-[14px] max-[767px]:mt-[15px]
          list-disc
        "
            >
              {content.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {content?.cta?.text && (
            <a href={content.cta.link} className="btn-all mt-2 inline-block">
              {content.cta.text}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
