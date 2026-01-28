import { QuestionMarkIcon } from "@radix-ui/react-icons";
import React from "react";

const FieldTooltip = ({ message }: { message: string }) => {
  return (
    <QuestionMarkIcon
      onClick={() => alert(message)}
      className="rounded-full opacity-80 cursor-pointer bg-sky-600 w-fit h-fit p-1 text-xl text-white"
    />
  );
};

export default FieldTooltip;
