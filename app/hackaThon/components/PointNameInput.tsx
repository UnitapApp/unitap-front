"use client";
import React, { useState } from "react";
import { ConditionDataProps } from "../page";
interface Props {
  conditionData: ConditionDataProps;
  handleSetConditionData: (e: any) => void;
}
const PointNameInput = ({ conditionData, handleSetConditionData }: Props) => {
  const [isDisplayInput, setIsDisplayInput] = useState<boolean>(false);

  const handleDisplayInput = () => {
    setIsDisplayInput(!isDisplayInput);
  };
  return (
    <div className="rounded-2xs input-wrapper relative mb-3 w-full max-w-[452px] cursor-pointer select-none text-white">
      <div
        className="hackaThonBgGradient relative z-20 mb-2 flex h-9 w-full items-center justify-between rounded-[10px] px-4"
        onClick={handleDisplayInput}
      >
        <div className="flex gap-2 text-sm font-bold leading-[19.07px] text-white">
          <span>1</span>
          <span>Name of point</span>
        </div>
        <div
          className={`${isDisplayInput ? "rotate-0" : "-rotate-90"} transition-all `}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.423 7.57895C12.0368 7.57895 12.422 8.24179 12.118 8.77511L8.69483 14.7807C8.38791 15.3191 7.6117 15.3191 7.30478 14.7807L3.88162 8.77511C3.57763 8.24179 3.96276 7.57895 4.57664 7.57895H7.16842V0.842105C7.16842 0.377023 7.54064 0 7.9998 0C8.45897 0 8.83119 0.377023 8.83119 0.842105V7.57895H11.423Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div
        className={`grid grid-rows-[0fr] overflow-hidden rounded-xl transition-all duration-300 ${isDisplayInput ? "grid-rows-[1fr] border border-[#212130]" : "grid-rows-[0fr] border-none border-[#212130]"} `}
      >
        <div className="flex overflow-hidden">
          <div className="h-[43px] w-full">
            <input
              placeholder="Unitap XP"
              name="nameOfPoint"
              className=" h-full w-full bg-[#1E1E2C] pl-2 text-xs font-normal leading-[16.34px] placeholder-gray80"
              value={conditionData.nameOfPoint ?? ""}
              onChange={handleSetConditionData}
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointNameInput;
