import React from "react";
import { ConditionDataProps } from "../page";
import { shortenAddress } from "@/utils";

interface Props {
  conditionList: ConditionDataProps[];
  handleRemoveCondition: (index: number) => void;
}

const AddedCondition = ({ conditionList, handleRemoveCondition }: Props) => {
  return (
    <div className="w-full max-w-[456px]">
      {conditionList.length > 0 &&
        conditionList.map((condition, index) => (
          <div
            key={index}
            className="relative mb-3 h-[88px] w-full rounded-xl border border-gray70 bg-gray30 p-4"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => handleRemoveCondition(index)}
            >
              <path
                d="M9.79079 1.21936C10.0697 0.940416 10.0697 0.488155 9.79079 0.209209C9.51184 -0.0697365 9.05958 -0.0697365 8.78064 0.209209L5 3.98985L1.21936 0.209209C0.940416 -0.0697365 0.488155 -0.0697365 0.209209 0.209209C-0.0697365 0.488155 -0.0697365 0.940416 0.209209 1.21936L3.98985 5L0.209209 8.78064C-0.0697365 9.05958 -0.0697365 9.51185 0.209209 9.79079C0.488155 10.0697 0.940416 10.0697 1.21936 9.79079L5 6.01015L8.78064 9.79079C9.05958 10.0697 9.51184 10.0697 9.79079 9.79079C10.0697 9.51185 10.0697 9.05958 9.79079 8.78064L6.01015 5L9.79079 1.21936Z"
                fill="#67677B"
              />
            </svg>

            <div className="flex items-center gap-2">
              <img src={condition.chain?.logoUrl} height="24px" width="24px" />
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold leading-5 text-white">
                  {condition.nameOfPoint}
                </p>
                <div className="h-1 w-1 rounded-full bg-gray90"></div>
                <p className="left-4 text-xs font-normal text-gray100">
                  {shortenAddress(condition.contractAddress)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex cursor-pointer items-center justify-between">
              <div className="text-xs font-normal text-gray100">
                {condition.selectedMethod}
              </div>
              <div className="flex h-[22px] items-center justify-center rounded-md border border-gray70 bg-gray50 px-3 text-2xs font-medium leading-[14px] text-gray100">
                {condition.numberOfPoints} points
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AddedCondition;
