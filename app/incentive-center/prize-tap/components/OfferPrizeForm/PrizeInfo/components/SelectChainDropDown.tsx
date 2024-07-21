"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { useUserProfileContext } from "@/context/userProfile";
import { useOutsideClick } from "@/utils/hooks/dom";
import { useWalletAccount } from "@/utils/wallet";
import { useEffect, useRef, useState } from "react";

interface Prop {
  showErrors: boolean;
}

const SelectChainDropDown = ({ showErrors }: Prop) => {
  const { address } = useWalletAccount();
  const { userProfile } = useUserProfileContext();

  const {
    data,
    chainList,
    selectedChain,
    chainName,
    handleSearchChain,
    filterChainList,
    handleSelectChain,
    isShowingDetails,
  } = usePrizeOfferFormContext();

  const handleSearch = (e: any) => {
    setShowItems(true);
    handleSearchChain(e);
  };

  const [showItems, setShowItems] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleSetShowItems = () => {
    if (isShowingDetails) return;
    !!address && !!userProfile && setShowItems(!showItems);
  };

  return (
    <div className="relative w-full">
      <div ref={ref} className="relative w-full cursor-pointer">
        <div
          onClick={handleSetShowItems}
          className="flex h-[43px] w-full items-center rounded-xl border border-gray50 bg-gray40 px-5"
        >
          {selectedChain?.logoUrl ? (
            <Icon iconSrc={selectedChain.logoUrl} width="24px" />
          ) : null}
          <input
            disabled={isShowingDetails}
            className="w-full bg-transparent px-2 text-sm text-white"
            type="text"
            value={chainName ? chainName : ""}
            placeholder="Search for Chain"
            onChange={handleSearch}
          />
          <Icon
            iconSrc={
              !showItems
                ? "/assets/images/fund/arrow-down.png"
                : "/assets/images/provider-dashboard/arrow-top.svg"
            }
            width="14px"
            height="auto"
          ></Icon>
        </div>
        {showItems && (
          <div className="styled-scroll absolute z-[2] mt-1 max-h-[205px] w-full cursor-pointer overflow-y-scroll rounded-xl border-2 border-gray60 bg-gray40 p-1">
            {filterChainList.length == 0
              ? chainList.map((chain, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setShowItems(false);
                      handleSelectChain(chain);
                    }}
                    className="flex h-[46px] w-full items-center gap-2 rounded-xl px-2 text-sm text-white hover:bg-gray70"
                  >
                    <Icon iconSrc={chain.logoUrl} width="24px" />
                    <p>{chain.chainName}</p>
                  </div>
                ))
              : filterChainList.map((chain, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setShowItems(false);
                      handleSelectChain(chain);
                    }}
                    className="flex h-[46px] w-full items-center gap-2 rounded-xl px-2 text-sm text-white hover:bg-gray70"
                  >
                    <Icon iconSrc={chain.logoUrl} width="24px" />
                    <p>{chain.chainName}</p>
                  </div>
                ))}
          </div>
        )}
      </div>
      {showErrors && !data.selectedChain && (
        <p className="absolute left-1 m-0 p-0 text-[8px] text-error">
          Required
        </p>
      )}
    </div>
  );
};

export default SelectChainDropDown;
