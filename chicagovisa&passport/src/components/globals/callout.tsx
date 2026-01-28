import { cn } from "@/lib/utils";
import React from "react";

interface CalloutProps {
  content: string | React.JSX.Element;
  className?: string;
}

const Callout: React.FC<CalloutProps> = ({ content, className }) => {
  return (
    <div
      className={cn(
        `callout p-3 text-white font-medium bg-primary/90`,
        className
      )}
    >
      <div className="callout-arrow"></div>
      <div className="callout-content" aria-live="assertive">
        {content}
      </div>
    </div>
  );
};

export default Callout;
