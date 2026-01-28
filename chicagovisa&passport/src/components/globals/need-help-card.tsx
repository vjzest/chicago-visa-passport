import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { IMGS } from "@/lib/constants";

const NeedHelpCard = () => {
  return (
    <Button className="flex w-full items-center justify-center gap-2 rounded bg-primary py-5 text-white">
      <Image src={IMGS?.QuestionMark} alt="?" className="size-7" />
      Help? Click to chat
    </Button>
  );
};

export default NeedHelpCard;
