"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ProviderFormPaginationProp } from "@/types";
import SelectChainDropDown from "./components/SelectChainDropDown";
import Pagination from "@/app/contribution-hub/pagination";
import SelectTokenOrNft from "./components/SelectTokenOrNft";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import { ClaimButton } from "@/components/ui/Button/button";

export const PrizeInfoDescription = {
  id: 0,
  prevIcon:
    "/assets/images/provider-dashboard/prizerForm-step-diamond-green.svg",
  activeIcon: "/assets/images/provider-dashboard/prizeForm-step-diamond.png",
  nextIcon: "/assets/images/provider-dashboard/prizeForm-step-diamond.svg",
  title: "Prize info",
  description: "Your prize information",
};

const PrizeInfo = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    data,
    handleChange,
    page,
    canGoStepTwo,
    updateChainList,
    isShowingDetails,
    nftContractStatus,
    tokenContractStatus,
  } = usePrizeOfferFormContext();
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const { address, isConnected } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const chainId = chain?.id;
  const { switchChain } = useNetworkSwitcher();
  const { setIsWalletPromptOpen } = useGlobalContext();

  const isRightChain = useMemo(() => {
    if (!isConnected || !chainId || !data.selectedChain) return false;
    return chainId === Number(data.selectedChain.chainId);
  }, [data.selectedChain, isConnected, chainId]);

  const handleCheckConnection = useCallback(async () => {
    if (!isConnected) {
      setIsWalletPromptOpen(true);
      return;
    }
    if (!chainId || !data.selectedChain || !address) return;
    if (!isRightChain) {
      await switchChain(Number(data.selectedChain.chainId));
      return;
    }
  }, [
    isConnected,
    chainId,
    data.selectedChain,
    address,
    isRightChain,
    switchChain,
    setIsWalletPromptOpen,
  ]);

  const handleNextPage = () => {
    const res = canGoStepTwo();
    setShowErrors(!res);
    res && handleChangeFormPageNext();
  };

  useEffect(() => {
    updateChainList();
  }, []);

  return (
    <div
      className={`flex flex-col justify-center w-full items-center animate-fadeIn`}
    >
      <div
        className={`flex flex-col select-not min-h-[340px] mb-5 gap-5 w-full items-center max-w-[452px] ${
          data.isNft ? "mb-[45px]" : ""
        } ${!address ? "opacity-[.5]" : "opacity-1"}`}
      >
        <section className="w-full relative">
          <div
            className={`flex gap-2 text-gray80 text-[12px] bg-gray40 border ${
              showErrors && !data.provider ? "border-error" : "border-gray50 "
            } rounded-xl h-[43px] pr-4 items-center justify-between overflow-hidden w-full max-w-[452px]`}
          >
            <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center justify-center ">
              <p>Provider</p>
            </div>
            <input
              type="text"
              placeholder="will be shown on card"
              className="provider-dashboard-input"
              name="provider"
              onChange={handleChange}
              disabled={isShowingDetails || !address}
              value={data.provider ? data.provider : ""}
            />
            <p>{data.provider?.length}/30</p>
          </div>
          {showErrors && !data.provider && (
            <p className="text-error text-[10px] m-0 mt-[2px] p-0 absolute left-1">
              Required
            </p>
          )}
        </section>

        <SelectChainDropDown showErrors={showErrors} />
        <SelectTokenOrNft showErrors={showErrors} isRightChain={isRightChain} />
        <section className="w-full relative">
          <div
            className={`flex gap-2 text-gray80 text-[12px] bg-gray40 border ${
              showErrors && !data.description
                ? "border-error"
                : "border-gray50 "
            } rounded-xl h-[63px] items-center justify-between pr-4 w-full max-w-[452px] overflow-hidden`}
          >
            <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center justify-center">
              <p>Description</p>
            </div>
            <input
              type="text"
              placeholder="will be shown on card"
              className="provider-dashboard-input"
              name="description"
              onChange={handleChange}
              disabled={isShowingDetails || !address}
              value={data.description ? data.description : ""}
            />
            <p>{data.description?.length}/100</p>
          </div>
          {showErrors && !data.description && (
            <p className="text-error text-[10px] m-0 mt-[2px] p-0 absolute left-1">
              Required
            </p>
          )}
        </section>
      </div>
      {address && !isRightChain && data.selectedChain ? (
        <ClaimButton
          onClick={handleCheckConnection}
          height="2.8rem"
          className="!w-full text-white max-w-[452px] "
          $fontSize="14px"
          data-testid="fund-action"
        >
          Switch Network
        </ClaimButton>
      ) : address && !isRightChain && !data.selectedChain ? (
        <ClaimButton
          height="2.8rem"
          className="!w-full  text-white max-w-[452px] "
          $fontSize="14px"
          data-testid="fund-action"
          disabled={true}
        >
          Please select chain
        </ClaimButton>
      ) : !address ? (
        <ClaimButton
          onClick={handleCheckConnection}
          height="2.8rem"
          className="!w-full  text-white max-w-[452px] "
          $fontSize="14px"
          data-testid="fund-action"
        >
          Connect Wallet
        </ClaimButton>
      ) : (
        <Pagination
          handleChangeFormPagePrev={handleChangeFormPagePrev}
          handleNextPage={handleNextPage}
          page={page}
          isDisabled={
            nftContractStatus.checking || tokenContractStatus.checking
          }
        />
      )}
    </div>
  );
};

export default PrizeInfo;
