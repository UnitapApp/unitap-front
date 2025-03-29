"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProviderFormPaginationProp } from "@/types";
import SelectChainDropDown from "./components/SelectChainDropDown";
import Pagination from "@/app/dashboard/_components/pagination";
import SelectTokenOrNft from "./components/SelectTokenOrNft";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import { ClaimButton } from "@/components/ui/Button/button";
import { SwitchNetworkModal } from "@/components/containers/modals/ConnectWalletModal/switchNetworkModal";

const TokenInfo = ({
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
    tokenContractStatus,
    nftContractStatus,
  } = useTokenTapFromContext();

  const [showErrors, setShowErrors] = useState<boolean>(false);
  const { address, isConnected } = useWalletAccount();
  // const { chain } = useWalletNetwork();

  // const chainId = chain?.id;
  // const { switchChain } = useNetworkSwitcher();
  // const { setIsWalletPromptOpen } = useGlobalContext();
  // const [isNetWorkWrong, setIsNetworkWrong] = useState<boolean>(false)

  // const isRightChain = useMemo(() => {
  //   if (!isConnected || !chainId || !data.selectedChain) return false;
  //   return chainId === Number(data.selectedChain.chainId);
  // }, [data.selectedChain, isConnected, chainId]);

  // const handleCheckConnection = useCallback(async () => {
  //   if (!isConnected) {
  //     setIsWalletPromptOpen(true);
  //     return;
  //   }
  //   if (!chainId || !data.selectedChain || !address) return;
  //   if (!isRightChain) {
  //     await switchChain(Number(data.selectedChain.chainId));
  //     return;
  //   }
  // }, [
  //   isConnected,
  //   chainId,
  //   data.selectedChain,
  //   address,
  //   isRightChain,
  //   switchChain,
  //   setIsWalletPromptOpen,
  // ]);

  const handleNextPage = () => {
    const res = canGoStepTwo();
    setShowErrors(!res);
    res && handleChangeFormPageNext();
  };

  useEffect(() => {
    updateChainList();
  }, []);

  // useEffect(() => {
  //   if (!data.selectedChain || !chainId) return;
  //   if (data.selectedChain.chainId != chainId) {
  //     setIsNetworkWrong(true);
  //   }
  //   else {
  //     setIsNetworkWrong(false)
  //   }
  // }, [chainId, data.selectedChain])

  return (
    <div
      className={`flex w-full animate-fadeIn flex-col items-center justify-center`}
    >
      <div
        className={`mb-5 flex min-h-[340px] w-full max-w-[452px] select-none flex-col items-center gap-5 ${
          data.isNft ? "mb-[45px]" : ""
        } ${!address ? "opacity-[.5]" : "opacity-1"}`}
      >
        <SelectChainDropDown showErrors={showErrors} />

        <SelectTokenOrNft showErrors={showErrors} />
      </div>

      {
        // address && !isRightChain && data.selectedChain ? (
        //   <ClaimButton
        //     onClick={handleCheckConnection}
        //     height="2.8rem"
        //     className="!w-full max-w-[452px] text-white "
        //     $fontSize="14px"
        //     data-testid="fund-action"
        //   >
        //     Switch Network
        //   </ClaimButton>
        // )
        // :
        address &&
        // && !isRightChain
        !data.selectedChain ? (
          <ClaimButton
            height="2.8rem"
            className="!w-full max-w-[452px] text-white"
            $fontSize="14px"
            data-testid="fund-action"
            disabled={true}
          >
            Please select chain
          </ClaimButton>
        ) : (
          // : !address ? (
          //   <ClaimButton
          //     onClick={handleCheckConnection}
          //     height="2.8rem"
          //     className="!w-full  max-w-[452px] text-white "
          //     $fontSize="14px"
          //     data-testid="fund-action"
          //   >
          //     Connect Wallet
          //   </ClaimButton>
          // )
          <Pagination
            handleChangeFormPagePrev={handleChangeFormPagePrev}
            handleNextPage={handleNextPage}
            page={page}
            isDisabled={
              tokenContractStatus.checking || nftContractStatus.checking
            }
          />
        )
      }
      {/* {address && data.selectedChain &&
        <SwitchNetworkModal chain={data.selectedChain} isNetWorkWrong={isNetWorkWrong} setIsNetWorkWrong={setIsNetworkWrong} />} */}
    </div>
  );
};

export default TokenInfo;
