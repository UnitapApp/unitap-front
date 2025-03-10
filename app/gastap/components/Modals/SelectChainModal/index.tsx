"use client";

import React, { useMemo, useState } from "react";

import { SelectChainModalWrapper } from "./selectChainModal.style";
import ChainItem from "./chainItem";
import { Chain, ChainType } from "@/types";
import Icon from "@/components/ui/Icon";
import {
  searchChainListSimple,
  useGasTapContext,
} from "@/context/gasTapProvider";

const SelectChainModal = ({
  selectedChain,
  setSelectedChain,
  closeModalHandler,
}: {
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain) => any;
  closeModalHandler: () => any;
}) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>("");
  const { changeSearchPhrase, chainListSearchSimpleResult } =
    useGasTapContext();
  const searchPhraseChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
  };

  const chainList = useMemo(() => {
    return searchChainListSimple(
      searchPhraseInput,
      chainListSearchSimpleResult.filter(
        (chain) => chain.chainType !== ChainType.SOLANA,
      ),
    );
  }, [chainListSearchSimpleResult, searchPhraseInput]);

  return (
    <SelectChainModalWrapper className="relative h-auto pt-4">
      <input
        className="z-1 mb-2 w-full rounded-lg border-2 !border-gray30 bg-gray10 p-4 py-3.5 pl-[52px] text-white"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Search Network"
      />
      <Icon
        className="absolute left-4 top-8"
        iconSrc="/assets/images/modal/search-icon.svg"
        width="20px"
        height="20px"
      />
      <div className="chainlist-container styled-scroll max-h-[50vh] overflow-y-auto pr-1">
        {chainList
          .filter((item) => item.chainType === ChainType.EVM)
          .map((chain) => (
            <ChainItem
              data-testid={`select-chain-modal-item-${chain.pk}`}
              key={chain.chainId}
              chain={chain}
              selected={selectedChain?.chainId === chain.chainId}
              onClick={() => {
                setSelectedChain(chain);
                closeModalHandler();
              }}
            />
          ))}
      </div>
    </SelectChainModalWrapper>
  );
};

export default SelectChainModal;
