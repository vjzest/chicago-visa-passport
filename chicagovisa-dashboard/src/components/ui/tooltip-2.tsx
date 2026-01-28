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
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="text-sm max-w-[20rem] break-all">
          {typeof text === "string" ? (
            <p>{text}</p>
          ) : (
            <div>
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
