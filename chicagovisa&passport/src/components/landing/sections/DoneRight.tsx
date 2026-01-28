"use client";
import { useHomepageContent } from "@/hooks/use-homepage-content";
export default function DoneRight() {
  const content = useHomepageContent();
  const texts = content.doneRightSection;

  return (
    <section
      id="done_right"
      className="bg-[linear-gradient(to_top,#122241_50%,#ffffff_50%)]"
    >
      <div className="container">
        <div className="bg-[#c7e6fd] rounded-[40px] p-[61px] mt-[55px] max-lg:rounded-[30px] max-sm:rounded-[20px] max-sm:p-[30px_20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[20px] md:gap-[30px]">
            <div className="order-2 md:order-1">
              <img src={texts.image.src} alt={texts.image.alt} />
            </div>
            <div className="pl-0 md:pl-[20px] order-1 md:order-2">
              <h2>
                {texts.content.headingLines.map((line: any, index: number) => (
                  <span key={index}>
                    {line}
                    {index < texts.content.headingLines.length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="max-w-[500px] mt-[15px]">
                {texts.content.paragraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}