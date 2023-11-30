"use client";
import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { useState } from "react";

const satisfy = { satisfySome: "satisfySome", satisfyAll: "satisfyAll" };

const SelectSatisfyDropdown = () => {
  const [showItems, setShowItems] = useState<boolean>(false);
  const { data, handleSelectSatisfy } = usePrizeOfferFormContext();

  const onSelect = (e: string) => {
    handleSelectSatisfy(e);
    setShowItems(false);
  };

  return (
    <div className="flex relative bg-gray40 rounded-xl my-4 cursor-pointer text-white text-[14px] font-medium">
      <div
        className="flex items-center justify-between w-full h-[44px] px-4"
        onClick={() => setShowItems(!showItems)}
      >
        <p>
          {data.satisfy == "satisfyAll"
            ? "Should satisfy all"
            : "Should satisfy some"}
        </p>
        <Icon
          iconSrc="assets/images/fund/arrow-down.png"
          height="8px"
          width="14px"
        />
      </div>
      {showItems && (
        <div className="text-[14px] font-medium top-12 h-[60px] p-2 justify-center left-0 flex flex-col gap-1 absolute rounded-xl w-full bg-gray40 border border-gray50 ">
          <div
            onClick={() => onSelect(satisfy.satisfyAll)}
            className="px-2 text-gray90 hover:text-white hover:bg-gray60 rounded-xl"
          >
            Should satisfy all
          </div>
          <div
            onClick={() => onSelect(satisfy.satisfySome)}
            className="px-2 text-gray90 hover:text-white hover:bg-gray60 rounded-xl"
          >
            Should satisfy some
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSatisfyDropdown;
