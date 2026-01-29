import * as React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ClipboardIcon } from "lucide-react";

/**
 * CopyText Component
 *
 * A reusable component that displays text with a copy icon, which can be positioned either before or after the text.
 * When the copy icon is clicked, the text is copied to the clipboard.
 *
 * @param {string} text - The text to display and copy.
 * @param {string} className - Optional Tailwind CSS class names passed from the parent component.
 * @param {"before" | "after"} iconPosition - Optional position of the copy icon (before or after the text).
 * @returns {JSX.Element} The rendered component.
 */

interface CopyTextProps {
  text: string;
  className?: string;
  iconPosition?: "before" | "after";
}

const CopyText: React.FC<CopyTextProps> = ({
  text,
  className,
  iconPosition = "after",
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard", {
        position: "bottom-right",
      });
    });
  };

  return (
    <div className={cn("inline-flex items-center space-x-2", className)}>
      {iconPosition === "before" && (
        <button
          onClick={() => copyToClipboard(text)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ClipboardIcon className="size-4 cursor-pointer" />
        </button>
      )}
      <span className="text-sm">{text}</span>
      {iconPosition === "after" && (
        <button
          onClick={() => copyToClipboard(text)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ClipboardIcon className="size-4 cursor-pointer" />
        </button>
      )}
    </div>
  );
};

export default CopyText;
