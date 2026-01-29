import React from "react";
import { Card } from "@/components/ui/card";
import { CircleX, File, Verified } from "lucide-react";
import Link from "next/link";

interface IDoc {
  document: string;
  title: string;
  isVerified: boolean;
  urls: string[];
}

const DocumentCard = ({
  document,
  onVerifyClick,
  isVerified,
  isEditable = true,
}: {
  document: IDoc;
  onVerifyClick: () => void;
  isVerified: boolean;
  isEditable?: boolean;
}) => {
  return (
    <Card className="flex flex-col p-6 gap-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div
        className={`flex items-start gap-4 ${
          isEditable ? "justify-between" : "justify-start"
        }`}
      >
        <p className="font-semibold text-slate-700 text-wrap text-lg truncate text-start">
          {document.title}
        </p>
        {isEditable && (
          <button
            onClick={onVerifyClick}
            className={`rounded-full gap-2 px-3 py-1 flex flex-nowrap items-center ${
              isVerified
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-400 hover:bg-red-500"
            } text-white transition-colors duration-300`}
          >
            {isVerified ? "Verified" : "Unverified"}
            {isVerified ? (
              <Verified size={"1rem"} />
            ) : (
              <CircleX size={"1rem"} />
            )}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {document.urls && document.urls.length > 0 ? (
          document.urls?.map((url, index) => (
            <Link
              key={url}
              href={url}
              target="_blank"
              className="group flex overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center px-3 bg-slate-500 text-white font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex items-center bg-primary text-white gap-2 p-2 group-hover:bg-primary-dark transition-colors duration-300">
                <File size={"1rem"} />
                <span className="uppercase font-medium text-sm">
                  {url.slice(url.lastIndexOf(".") + 1)}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-yellow-500 text-base font-medium">
            No documents uploaded
          </p>
        )}
      </div>
    </Card>
  );
};

export default DocumentCard;
