"use client";

import { useHomepageContent } from "@/hooks/use-homepage-content";

import BtnAll from "@/components/landing/common/BtnAll";


export default function ComparisonTable() {
  const content = useHomepageContent();
  const texts = content.comparisonSection;

  return (
    <section
      id="comparison_section"
      className="pb-[69px] bg-[linear-gradient(to_top,#f8f9fd,rgba(248,249,253,0))] max-sm:pb-[50px]"
    >
      <div className="container">
        <div className="text-center">
          <h2 className="max-w-[539px] mx-auto">
            {texts.header.headingLines[0]} <br /> {texts.header.headingLines[1]}
          </h2>
          <p className="max-w-[379px] mx-auto mt-[13px] mb-[30px]">
            {texts.header.subheading}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-transparent mb-[32px]">
            <thead>
              <tr>
                <th className="pl-0 pb-[18px]"></th>
                <th className="pl-0 pb-[18px]">
                  <div className="font-medium text-[22px] max-md:text-[18px]">
                    <img
                      src={texts.table.headers.ours.logo?.src || texts.table.headers.ours.logoSrc}
                      alt={texts.table.headers.ours.logo?.alt || texts.table.headers.ours.logoAlt}
                    />
                  </div>
                </th>
                <th className="pl-0 pb-[18px]">
                  <div className="font-medium text-[22px] max-md:text-[18px]">
                    {texts.table.headers.theirs}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {texts.table.rows.map((row: any, index: number) => (
                <tr key={index} className="border-b border-[#D3D3E5]">
                  <td className="py-[16px] bg-transparent text-[22px] font-medium max-md:text-[16px] max-sm:min-w-[240px]">
                    {row.label}
                  </td>
                  <td className="py-[16px] bg-transparent max-sm:min-w-[240px]">
                    <div className="flex items-center gap-[20px] text-[18px] max-md:text-[14px] max-sm:gap-[13px]">
                      <img
                        src={texts.table.icons.check.src}
                        alt={texts.table.icons.check.alt}
                      />
                      {row.ours}
                    </div>
                  </td>
                  <td className="py-[16px] bg-transparent max-sm:min-w-[240px]">
                    <div className="flex items-center gap-[20px] text-[18px] max-md:text-[14px] max-sm:gap-[13px]">
                      <img
                        src={texts.table.icons.cross.src}
                        alt={texts.table.icons.cross.alt}
                      />
                      {row.theirs}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <BtnAll text={texts.button.text} path={texts.button.path} />
        </div>
      </div>
    </section>
  );
}
