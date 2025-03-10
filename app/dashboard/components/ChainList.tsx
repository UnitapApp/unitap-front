import Icon from "@/components/ui/Icon";
import { Chain } from "@/types/gastap";
import { useOutsideClick } from "@/utils/hooks/dom";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  setRequirementParamsList: any;
  requirementParamsList: any;
  allChainList: Chain[] | undefined;
  selectedChain: Chain | undefined;
  setSelectedChain: (chain: Chain | undefined) => void;
}

const ChainList = ({
  setRequirementParamsList,
  requirementParamsList,
  allChainList,
  selectedChain,
  setSelectedChain,
}: Props) => {
  const handleSelectChain = (chian: Chain) => {
    setSelectedChain(chian);
    setRequirementParamsList({
      ...requirementParamsList,
      ["CHAIN"]: chian.pk,
    });
    setShowItems(false);
    setChainName(chian.chainName);
  };

  const [chainName, setChainName] = useState<string | undefined>();

  const [filterChainName, setFilterChainName] = useState<Chain[] | undefined>(
    allChainList,
  );

  const [showItems, setShowItems] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!requirementParamsList || !allChainList) return;
    if (!requirementParamsList.CHAIN) return;
    const chain = allChainList!.find(
      (item) => item.pk === requirementParamsList.CHAIN,
    );
    setSelectedChain(chain!);
    setChainName(chain!.chainName);
  }, [requirementParamsList]);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleSearch = (e: string) => {
    setSelectedChain(undefined);
    setChainName(e);
    setShowItems(true);
    setFilterChainName(
      allChainList?.filter(
        (chain) =>
          chain.chainName.toLocaleLowerCase().includes(e) ||
          chain.chainId.includes(e),
      ),
    );
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setShowItems(!showItems)}
        className="flex h-[43px] cursor-pointer items-center justify-between gap-2 rounded-xl border-gray50 bg-gray40 px-3"
      >
        {selectedChain && (
          <Icon iconSrc={selectedChain.logoUrl} height="24px" width="24px" />
        )}
        <input
          className="h-full w-full bg-inherit"
          placeholder="Please select chain..."
          value={chainName ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Icon
          iconSrc="/assets/images/fund/arrow-down.png"
          height="8px"
          width="14px"
        />
      </div>
      {showItems && (
        <div className="absolute z-10 max-h-[200px] w-full overflow-x-hidden overflow-y-scroll rounded-lg border-2 border-gray60 bg-gray40">
          {filterChainName?.map((chain) => (
            <div
              onClick={() => handleSelectChain(chain)}
              key={chain.chainPk}
              className="cursor-pointer rounded-lg p-2 hover:bg-gray70"
            >
              <div className="flex items-center gap-2 text-white">
                <Icon iconSrc={chain.logoUrl} height="24px" width="24px" />
                {chain.chainName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainList;
