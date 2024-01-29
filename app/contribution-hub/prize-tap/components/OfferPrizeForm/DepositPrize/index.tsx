"use client";

import { ProviderFormPaginationProp } from "@/types";
import DepositContent from "./components/DepositContent";
import DisplaySelectedTokenOrNft from "./components/DisplaySelectedTokenOrNft";
import Pagination from "@/app/contribution-hub/pagination";
import CreateRaffleModal from "../../CreateRaffleModal";
import { useCallback, useEffect, useMemo } from "react";
import ShowPreviewModal from "./components/ShowPreviewModal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardButtonSubmit } from "@/app/contribution-hub/Buttons";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";

const nftDescription = {
  title: "Deposit Selected NFT",
  description: `Please proceed with depositing the NFT for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/deposit-nft.png",
};

const tokenDescription = {
  title: "Deposit Selected Token",
  description: `Please proceed with depositing the Token for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/deposit-token.png",
};

const DepositPrize = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    openShowPreviewModal,
    data,
    page,
    createRaffleResponse,
    isErc20Approved,
    isApprovedAll,
    handleApproveErc721Token,
    handleApproveErc20Token,
    approveLoading,
    isShowingDetails,
  } = usePrizeOfferFormContext();

  const handleNextPage = () => {
    if (isShowingDetails) handleChangeFormPageNext();
    else {
      openShowPreviewModal();
    }
  };

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

  const approve = data.isNativeToken
    ? true
    : data.isNft
    ? isApprovedAll
    : isErc20Approved;

  useEffect(() => {
    createRaffleResponse?.state === "Done" ? handleChangeFormPageNext() : null;
  }, [createRaffleResponse, handleChangeFormPageNext]);

  return (
    <div className="flex flex-col w-full justify-center items-center animate-fadeIn">
      <div className="flex flex-col min-h-[424px] gap-5 w-full max-w-[452px] min-w-[300px]">
        <section>
          <div className="text-center">
            <DepositContent
              title={data.isNft ? nftDescription.title : tokenDescription.title}
              description={
                data.isNft
                  ? nftDescription.description
                  : tokenDescription.description
              }
              icon={data.isNft ? nftDescription.icon : tokenDescription.icon}
              isNFT={data.isNft}
            />
          </div>
        </section>
        <DisplaySelectedTokenOrNft data={data} />
        <ShowPreviewModal />
      </div>

      {isShowingDetails ? (
        <Pagination
          handleChangeFormPagePrev={handleChangeFormPagePrev}
          handleNextPage={handleNextPage}
          page={page}
        />
      ) : address && !isRightChain && data.selectedChain ? (
        <ProviderDashboardButtonSubmit
          onClick={handleCheckConnection}
          className="text-[14px] max-w-[452px] mt-[2px]"
          data-testid="fund-action"
        >
          Switch Network
        </ProviderDashboardButtonSubmit>
      ) : !address ? (
        <ProviderDashboardButtonSubmit
          onClick={handleCheckConnection}
          className="!w-full  text-white max-w-[452px] "
          $fontSize="14px"
          data-testid="fund-action"
        >
          Connect Wallet
        </ProviderDashboardButtonSubmit>
      ) : !approve && !isShowingDetails ? (
        <ProviderDashboardButtonSubmit
          $width="100%"
          height="42px"
          className="max-w-[452px] mt-[2px]"
          onClick={
            data.isNft && !isApprovedAll
              ? handleApproveErc721Token
              : handleApproveErc20Token
          }
          disabled={approveLoading}
        >
          <p>{approveLoading ? "Approving Contract..." : "Approve Contract"}</p>
        </ProviderDashboardButtonSubmit>
      ) : (
        <Pagination
          handleChangeFormPagePrev={handleChangeFormPagePrev}
          handleNextPage={handleNextPage}
          page={page}
          func="submit"
        />
      )}
      {data.selectedChain && !isShowingDetails && (
        <CreateRaffleModal chain={data.selectedChain} />
      )}
    </div>
  );
};

export default DepositPrize;
