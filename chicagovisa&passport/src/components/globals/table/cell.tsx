import { cn } from "@/lib/utils";
import React from "react";

/**
 * Cell is a customizable table cell component that displays a value with various styling options.
 *
 * @param {object} props - The properties to customize the cell.
 * @param {string | number} props.value - The value to be displayed in the cell.
 * @param {boolean} [props.capitalize=false] - If true, capitalizes the text.
 * @param {boolean} [props.alignCenter=false] - If true, aligns the text to the center.
 * @param {number} [props.widthInPx] - The width of the cell in pixels.
 * @param {boolean} [props.textWrap=false] - If true, allows text to wrap.
 * @param {string} [props.className=""] - Additional CSS classes for custom styling.
 * @returns {JSX.Element} The styled cell element.
 *
 * @example
 * <Cell value="Example" capitalize={true} alignCenter={true} widthInPx={100} />
 */
const Cell = ({
  children,
  capitalize = false,
  alignCenter = false,
  widthInPx,
  textWrap = false,
  className = "",
}: {
  children: string | number | React.JSX.Element;
  capitalize?: boolean;
  alignCenter?: boolean;
  widthInPx?: number;
  textWrap?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        className,
        !children ? "text-center" : "",
        capitalize ? "!capitalize" : "",
        alignCenter ? "flex justify-center" : "",
        widthInPx ? `w-[${widthInPx}px]` : "",
        textWrap ? "" : "whitespace-nowrap"
      )}
    >
      {children || "-"}
    </div>
  );
};

export default Cell;
