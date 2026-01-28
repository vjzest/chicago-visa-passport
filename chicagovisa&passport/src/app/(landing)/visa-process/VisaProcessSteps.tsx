import BtnAll from "@/components/landing/common/BtnAll";

interface VisaProcessStepProps {
  bg: string;
  top: string;
  img: string;
  image?: {
    src: string;
  };
  title: string;
  paragraphs?: string[];
  text?: string;
  list?: string[];
  final?: string;
  translateY?: string;
  textColor: string;
  index: number;
}

export default function VisaProcessStep({
  bg,
  top,
  img,
  image,
  title,
  paragraphs,
  text,
  list,
  final,
  translateY,
  textColor,
  index,
}: VisaProcessStepProps) {
  // Defensive check for image source
  const imageSrc = image?.src || "";
  const displayImg = (imageSrc && imageSrc.length > 0) ? imageSrc : img;

  // console.log(`Step ${index + 1} Image Debug:`, {
  //   hasApiImage: !!image?.src,
  //   apiImageUrl: image?.src,
  //   fallbackImg: img,
  //   finalDisplay: displayImg
  // });
  return (
    <div
      className={`
        rounded-[40px] p-[50px] sticky 
        max-[1024px]:rounded-[30px]
        max-[767px]:static max-[767px]:rounded-[20px]
        max-[767px]:p-[30px_20px]
      `}
      style={{
        background: bg,
        top,
        transform: translateY ? `translateY(${translateY})` : undefined,
      }}
    >
      <div
        className="
          grid grid-cols-1 md:grid-cols-12
          md:items-center
          max-[767px]:flex max-[767px]:flex-col-reverse
        "
      >
        <div className="col-span-12 md:col-span-5">
          <img
            src={displayImg}
            alt=""
            className="rounded-[30px] max-[1024px]:rounded-[20px] max-[767px]:mt-[5px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== img) {
                target.src = img;
              }
            }}
          />
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="pl-[25px] max-[1024px]:pl-[10px] max-[767px]:pl-0">
            <h2
              className={` mb-[22px]  max-[767px]:mb-[15px]`}
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: title }}
            ></h2>

            {text ? (
              <div
                className={`max-w-[550px] mb-[16px] rich-text`}
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ) : (
              paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className={`max-w-[550px] mb-[16px]`}
                  style={{ color: textColor }}
                >
                  {p}
                </p>
              ))
            )}

            {list && (
              <ul
                className={` pl-[27px] max-w-[534px] my-[20px] max-[767px]:text-[14px] max-[767px]:my-[10px] max-[767px]:mb-[18px] list-disc`}
                style={{ color: textColor }}
              >
                {list.map((item, i) => (
                  <li key={i} className="mb-[5px]">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {final && (
              <p className={`max-w-[550px] mb-[16px]`} style={{ color: textColor }}>
                {final}
              </p>
            )}

            <div className="flex items-center gap-[10px] max-[767px]:mb-[15px]">
              <BtnAll
                text="Passports"
                path="/us-passport"
                className={`${index} ${index === 0 ? "hover:text-[white]" : ""
                  } max-sm:text-[12px] max-sm:py-[10px] max-sm:px-[20px]`}
              />
              <BtnAll
                text="Visas"
                path="/visas"
                className={`${index} ${index === 0 ? "hover:text-[white]" : ""
                  } max-sm:text-[12px] max-sm:py-[10px] max-sm:px-[20px]`}
              />
              <BtnAll
                text="eVisas"
                path="/us-passport"
                className={`${index} ${index === 0 ? "hover:text-[white]" : ""
                  } max-sm:text-[12px] max-sm:py-[10px] max-sm:px-[20px]`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}