import { Clock, CircleX, CircleAlert } from "lucide-react";
import React from "react";

interface Props {
  status: "ongoing" | "rejected" | "pending" | "expert Review";
  title: string;
  messages: string[] | string;
}

const DocUploadMessage = ({ status, title, messages }: Props) => {
  return (
    <div
      className={`mx-auto flex w-3/5 min-w-fit items-center justify-center gap-4 rounded-md p-4 py-2 mb-4  ${
        status === "ongoing"
          ? "border-2  bg-yellow-400 text-slate-700"
          : status === "rejected"
            ? "bg-red-400 text-white"
            : "bg-orange-400 text-white"
      }
      `}
    >
      <div className="flex items-center justify-center gap-4 w-4/5">
        {status === "ongoing" ? (
          <Clock size={"2rem"} />
        ) : status === "rejected" ? (
          <CircleX size={"2rem"} />
        ) : (
          <CircleAlert size={"2rem"} />
        )}
        <div className="flex flex-col ">
          <p className="text-base font-semibold text-center md:whitespace-nowrap">
            {title}
          </p>

          {Array.isArray(messages) ? (
            <ul className="list-none pl-0">
              {messages.map((message, index) => (
                <li key={index} className="font-medium w-full text-center">
                  {`${message}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-medium text-center w-full">
              Message: {messages}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocUploadMessage;
