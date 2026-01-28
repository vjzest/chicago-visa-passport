import { getFormattedDateAndTime } from "@/lib/utils";
import React from "react";

const NoteBox2: React.FC<{
  content: {
    note: string;
    createdAt: string;
    host: string;
    isAutoNote?: boolean;
  };
}> = ({ content }) => {
  const { formattedDate, formattedTime } = getFormattedDateAndTime(
    content?.createdAt
  );

  return (
    <div className="mb-2 break-inside-avoid rounded-md border border-gray-200 bg-gray-50 p-2 shadow transition-shadow duration-200 hover:shadow-md">
      <div className="mb-1 flex justify-between  text-xs text-gray-500">
        <span>
          {formattedDate} at {formattedTime}
        </span>
        <span>
          <strong>{content?.host}</strong>
        </span>
      </div>

      <div className="mb-2">
        <div className="min-h-10 overflow-hidden rounded bg-white p-2 text-sm leading-tight text-gray-800 shadow-inner">
          <span
            className="break-words"
            dangerouslySetInnerHTML={{ __html: content.note }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteBox2;
