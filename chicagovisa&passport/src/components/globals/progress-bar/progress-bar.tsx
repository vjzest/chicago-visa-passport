import React from "react";
import ProgressBarIcon from "./progress-bar-icon";

interface Props {
  setCurrent: React.Dispatch<
    React.SetStateAction<
      "" | "uploadDocuments" | "expertReview" | "shippingLabel"
    >
  >;
  current: "" | "uploadDocuments" | "expertReview" | "shippingLabel";
  finished: {
    uploadDocuments: boolean;
    expertReview: boolean;
  };
}

const ProgressBar: React.FC<Props> = ({ setCurrent, current, finished }) => {
  return (
    <div className="flex items-center justify-center whitespace-nowrap rounded-2xl px-12 py-8 pb-20 shadow-full">
      <ProgressBarIcon
        color={finished.uploadDocuments ? "bg-green-400" : "bg-primary"}
        onClick={() => setCurrent("uploadDocuments")}
        text="Upload your necessary documents"
        iconClass="bx bx-upload"
      />
      <div className="h-[0.15rem] w-[30vw] bg-primary"></div>
      <ProgressBarIcon
        color={
          finished.expertReview
            ? "bg-green-400"
            : finished.uploadDocuments
              ? "bg-primary"
              : "bg-slate-300"
        }
        onClick={() => setCurrent("expertReview")}
        text="An acceptance agent will review your documents"
        iconClass="bx bx-notepad"
      />
      <div className="h-[0.15rem] w-[30vw] bg-primary"></div>
      <ProgressBarIcon
        color={finished.expertReview ? "bg-primary" : "bg-slate-300"}
        onClick={() => setCurrent("shippingLabel")}
        text="Create your shipping label"
        iconClass="bx bx-package"
      />
    </div>
  );
};

export default ProgressBar;
