"use client";

import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";

const SetDuration = () => {
  const { handleSetDuration, setDuration } = usePrizeOfferFormContext();
  return (
    <div className="w-full justify text-gray100 text-[12px] flex overflow-hidden bg-gray30 border border-gray50 rounded-xl h-[43px] items-center">
      <div
        onClick={() => handleSetDuration(false)}
        className={`w-full cursor-pointer border-r-2 border-r-gray50 h-[100%] flex items-center justify-center ${
          !setDuration ? "bg-gray40 text-white" : ""
        }`}
      >
        Set End Date & Time
      </div>
      <div
        onClick={() => handleSetDuration(true)}
        className={`w-full cursor-pointer  h-[100%] flex items-center justify-center ${
          setDuration ? "bg-gray40 text-white" : ""
        }`}
      >
        Set Duration
      </div>
    </div>
  );
};

export default SetDuration;
