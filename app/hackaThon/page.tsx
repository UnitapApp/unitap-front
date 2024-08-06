"use client";
import { Metadata } from "next";
import { Rubik_Mono_One } from "next/font/google";
import PointNameInput from "./components/PointNameInput";
import AddCondition from "./components/AddCondition";

import { useState } from "react";
import { Chain } from "@/types";

// export const metadata: Metadata = {
//   title: "Unitap | HackaThon",
//   description: "",
// };

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
}

const HackaThon = () => {
  const [conditionData, setConditionData] = useState<ConditionDataProps>({
    nameOfPoint: null,
    conditionName: null,
    chain: null,
    contractAddress: null,
    numberOfPoints: null,
  });

  const handleSetConditionData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    setConditionData((prev) => ({
      ...prev,
      [name]: name == "numberOfPoints" ? value.replace(/[^0-9]/g, "") : value,
    }));
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
          />
        </div>
        <div className="mb-5 flex h-[43px] w-full max-w-[452px] select-none items-center justify-center rounded-xl border-2 border-gray70 bg-gray50 text-center text-sm font-bold leading-5 text-gray80">
          Submit
        </div>
      </div>
    </div>
  );
};

export default HackaThon;
