import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type Tooltip2Props = {
  text: string | { [key: string]: number };
  children: React.ReactNode;
};

const Tooltip2: React.FC<Tooltip2Props> = ({ text, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="relative " asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="!absolute w-[15rem] top-16 max-w-[30rem]">
          {typeof text === "string" ? (
            <p className="break-words">{text}</p>
          ) : (
            <div className=" whitespace-nowrap">
              {Object.entries(text).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong>: {value}
                </p>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Tooltip2;
