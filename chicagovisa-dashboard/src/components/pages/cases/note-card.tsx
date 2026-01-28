import { cn, getFormattedDateAndTime } from "@/lib/utils";
import { Edit, Trash } from "lucide-react";
import React from "react";

const NoteBox: React.FC<{
  onEditClick: () => void;
  onDeleteClick: () => void;
  content: {
    _id: string;
    note: string;
    createdAt: string;
    host: string;
    isAutoNote?: boolean;
  };
}> = ({ content, onEditClick, onDeleteClick }) => {
  const { formattedDate, formattedTime } = getFormattedDateAndTime(
    content?.createdAt
  );

  const sanitizeNote = (text: string) => {
    if (!text) return text;
    // Remove (Token: [alphanumeric_token]) pattern
    return text.replace(/\s*\(Token:\s*[a-zA-Z0-9]+\)/gi, "");
  };

  if (!content.note || content.note.trim() === "") {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-2 rounded-md  border border-gray-200  p-2 shadow transition-shadow duration-200 hover:shadow-md",
        {
          "bg-slate-200": content?.host === "user",
        }
      )}
    >
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>
          {formattedDate} - {formattedTime}
        </span>
        <span>
          <strong>{content?.host}</strong>
        </span>{" "}
      </div>

      <div className="mb-2">
        <div className="mb-1 flex justify-between items-center gap-4">
          <span className="font-semibold">
            {content?.isAutoNote ? "Auto-Note" : "Manual-Note"}
          </span>
          <div className="flex gap-2">
            {!content?.isAutoNote && (
              <Edit
                className="cursor-pointer"
                onClick={onEditClick}
                size={"1rem"}
                color="blue"
              />
            )}
            {!content?.isAutoNote && (
              <Trash
                className="cursor-pointer"
                onClick={onDeleteClick}
                size={"1rem"}
                color="red"
              />
            )}
          </div>
        </div>
        <div className="min-h-10 flex items-center overflow-hidden rounded bg-white p-2 pb-0 text-sm leading-tight text-gray-800 shadow-inner">
          <span
            className="break-words"
            dangerouslySetInnerHTML={{ __html: sanitizeNote(content.note) }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteBox;
