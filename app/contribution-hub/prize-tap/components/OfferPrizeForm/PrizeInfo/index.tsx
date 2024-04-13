"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProviderFormPaginationProp } from "@/types";
import SelectChainDropDown from "./components/SelectChainDropDown";
import Pagination from "@/app/contribution-hub/components/pagination";
import SelectTokenOrNft from "./components/SelectTokenOrNft";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import { ClaimButton } from "@/components/ui/Button/button";

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
      className={`flex w-full animate-fadeIn flex-col items-center justify-center`}
    >
      <div
        className={`mb-5 flex min-h-[340px] w-full max-w-[452px] select-none flex-col items-center gap-5 ${data.isNft ? "mb-[45px]" : ""
          } ${!address ? "opacity-[.5]" : "opacity-1"}`}
      >
        <section className="relative w-full">
          <div
            className={`flex gap-2 border bg-gray40 text-xs text-gray80 ${showErrors && !data.provider ? "border-error" : "border-gray50 "
              } h-[43px] w-full max-w-[452px] items-center justify-between overflow-hidden rounded-xl pr-4`}
          >
            <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-gray100">
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
            <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
              Required
            </p>
          )}
        </section>

        <SelectChainDropDown showErrors={showErrors} />

        <SelectTokenOrNft showErrors={showErrors} isRightChain={isRightChain} />

        <section className="relative w-full">
          <div
            className={`flex gap-2 border bg-gray40 text-xs text-gray100 ${showErrors && !data.description
                ? "border-error"
                : "border-gray50 "
              } h-[63px] w-full max-w-[452px] items-center justify-between overflow-hidden rounded-xl pr-4`}
          >
            <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 ">
              <p>Description</p>
            </div>
            <textarea
              placeholder="will be shown on card"
              className="h-full max-h-[55px] w-full border-none bg-gray40 bg-none p-1 !outline-none focus:ring-0"
              name="description"
              onChange={handleChange}
              disabled={isShowingDetails || !address}
              value={data.description ? data.description : ""}
            />

            <p>{data.description?.length}/100</p>
          </div>
          {showErrors && !data.description && (
            <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
              Required
            </p>
          )}
        </section>
      </div>

      {address && !isRightChain && data.selectedChain ? (
        <ClaimButton
          onClick={handleCheckConnection}
          height="2.8rem"
          className="!w-full max-w-[452px] text-white "
          $fontSize="14px"
          data-testid="fund-action"
        >
          Switch Network
        </ClaimButton>
      ) : address && !isRightChain && !data.selectedChain ? (
        <ClaimButton
          height="2.8rem"
          className="!w-full  max-w-[452px] text-white "
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
          className="!w-full  max-w-[452px] text-white "
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
            tokenContractStatus.checking || nftContractStatus.checking
          }
        />
      )}
    </div>
  );
};

export default PrizeInfo;
