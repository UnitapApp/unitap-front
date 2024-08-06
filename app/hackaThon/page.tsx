"use client";
import { Metadata } from "next";
import { Rubik_Mono_One } from "next/font/google";
import PointNameInput from "./components/PointNameInput";
import AddCondition from "./components/AddCondition";

import { useEffect, useState } from "react";
import { Chain } from "@/types";
import AddedCondition from "./components/AddedCondition";
import { isAddress } from "viem";

const RubikMonoOne = Rubik_Mono_One({
  weight: ["400"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

export interface ConditionDataProps {
  nameOfPoint: string | null;
  conditionName: string | null;
  chain: Chain | null;
  contractAddress: string | null;
  numberOfPoints: number | null;
  selectedMethod: string | null;
}

const initialConditionData = {
  nameOfPoint: null,
  conditionName: null,
  chain: null,
  contractAddress: null,
  numberOfPoints: null,
  selectedMethod: null,
};

const HackaThon = () => {
  const [conditionData, setConditionData] =
    useState<ConditionDataProps>(initialConditionData);

  const [isOpen, setIsOpen] = useState(false);

  const [conditionList, setConditionList] = useState<ConditionDataProps[]>([]);

  const handleSetConditionData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConditionData((prev) => ({
      ...prev,
      [name]: name == "numberOfPoints" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const isCompleteConditionFiled =
    conditionData.chain &&
    conditionData.conditionName &&
    conditionData.contractAddress &&
    conditionData.nameOfPoint &&
    conditionData.numberOfPoints &&
    conditionData.selectedMethod &&
    isAddress(conditionData.contractAddress!);

  const handleAddCondition = () => {
    if (!isCompleteConditionFiled) return;
    setIsOpen(false);
    setConditionList([...conditionList, conditionData]);
    setConditionData(initialConditionData);
  };

  const handleRemoveCondition = (index: number) => {
    setConditionList((prev) => prev.filter((item, i) => i !== index));
  };

  const handleSubmit = () => {
    if (conditionList.length == 0) return;
    console.log(conditionList);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-gray[#13131E] relative flex min-h-[478px] w-full max-w-[572px] flex-col items-center rounded-[20px] border-2 border-gray30 px-5 pt-[60px] md:px-0 ">
        <div className="title-text mb-9 text-center">
          <div
            className={`text-[24px] font-normal ${RubikMonoOne.className} gradient-text-hackaThon`}
          >
            UNITAP HACKATHON
          </div>
          <div className="text-sm font-medium text-gray100">
            Where you can convert users action to
          </div>
          <div className="text-sm font-medium text-gray100">
            point in your platform.
          </div>
        </div>
        <div className="flex min-h-[210px] w-full flex-col items-center">
          <PointNameInput
            conditionData={conditionData}
            handleSetConditionData={handleSetConditionData}
          />

          <AddCondition
            conditionData={conditionData}
            handleSetConditionData={handleSetConditionData}
            setConditionData={setConditionData}
            handleAddCondition={handleAddCondition}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            conditionList={conditionList}
            handleRemoveCondition={(index: number) =>
              handleRemoveCondition(index)
            }
          />
        </div>
        <div
          className={`${conditionList.length > 0 && "cursor-pointer border border-space-green bg-dark-space-green text-space-green"} mb-5 flex h-[43px] w-full max-w-[452px] select-none items-center justify-center rounded-xl border-2 border-gray70 bg-gray50 text-center text-sm font-bold leading-5 text-gray80`}
          onClick={handleSubmit}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default HackaThon;
