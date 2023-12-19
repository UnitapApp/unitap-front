"use client";

import { ProviderFormPaginationProp } from "@/types";
import DepositContent from "./components/DepositContent";
import DisplaySelectedTokenOrNft from "./components/DisplaySelectedTokenOrNft";
import Pagination from "../../pagination";
import CreateRaffleModal from "../../CreateRaffleModal";
import { useEffect } from "react";
import ShowPreviewModal from "./components/ShowPreviewModal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardButtonSubmit } from "../../../Buttons";

export const DepositDescription = {
  id: 4,
  prevIcon: "/assets/images/provider-dashboard/step-4-green.svg",
  activeIcon: "/assets/images/provider-dashboard/step-4-active.svg",
  nextIcon: "/assets/images/provider-dashboard/step-4-off.svg",
  title: "Deposit Prize",
  description: "Deposit Token or Nft",
};

const nftDescription = {
  title: "Deposit Selected NFT",
  description: `Please proceed with depositing the NFT for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/Subtract.svg",
};

const tokenDescription = {
  title: "Deposit Selected Token",
  description: `Please proceed with depositing the Token for which you have completed the corresponding form. Please wait
	momentarily as we validate your request. In the event of rejection, the token will promptly returned to
	your designated wallet.`,
  icon: "/assets/images/provider-dashboard/tokenSelected.svg",
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
            {data.isNft ? (
              <DepositContent
                title={nftDescription.title}
                description={nftDescription.description}
                icon={nftDescription.icon}
              />
            ) : (
              <DepositContent
                title={tokenDescription.title}
                description={tokenDescription.description}
                icon={tokenDescription.icon}
              />
            )}
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
      ) : !approve && !isShowingDetails ? (
        <ProviderDashboardButtonSubmit
          $width="100%"
          height="43px"
          className="max-w-[452px] mt-[1px]"
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
