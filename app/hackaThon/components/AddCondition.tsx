"use client";
import React, { useState } from "react";
import AddConditionModal from "./AddConditionModal";
import { ConditionDataProps } from "../page";
import AddedCondition from "./AddedCondition";

interface Props {
  conditionData: ConditionDataProps;
  handleSetConditionData: (e: any) => void;
  setConditionData: React.Dispatch<React.SetStateAction<ConditionDataProps>>;
  handleAddCondition: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conditionList: ConditionDataProps[];
  handleRemoveCondition: (index: number) => void;
}

const AddCondition = ({
  conditionData,
  handleSetConditionData,
  setConditionData,
  handleAddCondition,
  isOpen,
  setIsOpen,
  conditionList,
  handleRemoveCondition,
}: Props) => {
  const [isDisplayInput, setIsDisplayInput] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDisplayInput = () => {
    setIsDisplayInput(!isDisplayInput);
  };

  const openAddConditionModal = () => {
    if (!conditionData.nameOfPoint) {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="rounded-2xs input-wrapper relative mb-3 w-full max-w-[452px] select-none text-white">
      <div
        className="hackaThonBgGradient relative z-20 mb-2 flex h-9 w-full cursor-pointer items-center justify-between rounded-[10px] px-4"
        onClick={handleDisplayInput}
      >
        <div className="flex gap-2 text-sm font-bold leading-[19.07px] text-white">
          <span>2</span>
          <span>Add Condition to Get Points</span>
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
        className={`mt-5 grid grid-rows-[0fr] overflow-hidden rounded-xl transition-all duration-300 ${isDisplayInput ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-none"} `}
      >
        <div className="flex flex-col overflow-hidden ">
          <AddedCondition
            conditionList={conditionList}
            handleRemoveCondition={handleRemoveCondition}
          />
          <div
            onClick={openAddConditionModal}
            className={`.addConditionBtn ${!conditionData.nameOfPoint ? "opacity-50" : "cursor-pointer"} addConditionBtn flex h-[43px] w-full items-center justify-center gap-3 rounded-xl border border-gray70`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99967 14.6668C11.6663 14.6668 14.6663 11.6668 14.6663 8.00016C14.6663 4.3335 11.6663 1.3335 7.99967 1.3335C4.33301 1.3335 1.33301 4.3335 1.33301 8.00016C1.33301 11.6668 4.33301 14.6668 7.99967 14.6668Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33301 8H10.6663"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.6668V5.3335"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-xs font-medium">Add Condition</div>
          </div>
        </div>
      </div>
      <AddConditionModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        conditionData={conditionData}
        handleSetConditionData={handleSetConditionData}
        setConditionData={setConditionData}
        handleAddCondition={handleAddCondition}
      />
    </div>
  );
};

export default AddCondition;
