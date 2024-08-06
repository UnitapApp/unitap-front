"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { Chain } from "@/types";
import { useOutsideClick } from "@/utils/hooks/dom";
import { getFaucetListServer } from "@/utils/serverApis";
import { useWalletAccount } from "@/utils/wallet";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { ConditionDataProps } from "../page";

interface Props {
  setConditionData: React.Dispatch<React.SetStateAction<ConditionDataProps>>;
  conditionData: ConditionDataProps;
}

const ChainList = ({ setConditionData, conditionData }: Props) => {
  const [chainList, setChainList] = useState<Chain[]>([]);
  const handleGetAllChains = async () => {
    const chainsApi = await getFaucetListServer();
    const chains = chainsApi as Array<Chain>;
    setChainList(chains);
  };

  useEffect(() => {
    handleGetAllChains();
  }, []);

  const { address } = useWalletAccount();
  const { userProfile } = useUserProfileContext();
  const [selectedChain, setSelectedChain] = useState<any | null>(null);
  const [chainName, setChainName] = useState<string>("");
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSearchChain = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setChainName(e.target.value);
    setSearchPhrase(e.target.value);
  };

  const filterChainList = useMemo(() => {
    return chainList.filter((chain) =>
      chain.chainName
        .toLocaleLowerCase()
        .includes(searchPhrase.toLocaleLowerCase()),
    );
  }, [chainList, searchPhrase]);

  const handleSelectChain = (chain: Chain) => {
    setSelectedChain(chain);
    setConditionData((prev) => ({ ...prev, chain: chain }));
    setChainName(chain.chainName);
    setSearchPhrase("");
  };

  const handleSearch = (e: any) => {
    setShowItems(true);
    setConditionData((prev) => ({ ...prev, chain: null }));
    handleSearchChain(e);
  };

  const [showItems, setShowItems] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleSetShowItems = () => {
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

          {!selectedChain && conditionData.chain ? (
            <Icon iconSrc={conditionData.chain.logoUrl} width="24px" />
          ) : null}

          <input
            className="w-full bg-transparent px-2 text-sm text-white"
            type="text"
            value={
              chainName
                ? chainName
                : conditionData.chain
                  ? conditionData.chain.chainName
                  : ""
            }
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
    </div>
  );
};

export default ChainList;
