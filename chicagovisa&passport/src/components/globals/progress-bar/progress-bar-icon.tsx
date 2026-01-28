import React from "react";

interface Props {
  onClick: () => void;
  iconClass: string;
  text: string;
  color: string;
}
const ProgressBarIcon: React.FC<Props> = ({ text, iconClass, color }) => {
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div
        className={
          "flex size-12 items-center justify-center rounded-full text-white " +
          color
        }
      >
        <i className={`${iconClass} text-xl`}></i>
      </div>
      <p className="absolute top-14 h-fit w-20 text-wrap text-center text-[0.7rem] font-medium leading-3">
        {text}
      </p>
    </div>
  );
};

export default ProgressBarIcon;
