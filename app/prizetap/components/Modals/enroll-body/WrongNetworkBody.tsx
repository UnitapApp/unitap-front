"use client";

import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { Prize } from "@/types";
import { useNetworkSwitcher } from "@/utils/wallet";
import { FC } from "react";

const WrongNetworkBody: FC<{
  raffle: Prize;
  method?: string;
}> = ({ raffle, method }) => {
  // const tokenImgLink: string = raffle.isPrizeNft
  //   ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
  //       Number(raffle.tokenUri.split("/")[3]) + 1
  //     }.png`
  //   : ""

  const switchStatus = method === "Claim" ? "Claim Prize" : "Enroll in Raffle";
  const { switchChain } = useNetworkSwitcher();

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-wrong-network`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={raffle!.imageUrl}
          alt=""
        />
      </DropIconWrapper>
      <p className="mb-12 mt-2 px-4 text-center text-sm font-medium leading-6 text-white">
        You need to switch to the <strong>{raffle.chain.chainName}</strong>{" "}
        network to {switchStatus}
      </p>

      <ClaimButton
        onClick={() => switchChain(Number(raffle.chain.chainId))}
        $width="100%"
        className="!w-full"
        $fontSize="16px"
        data-testid={`raffle-claim-switch-action-${raffle.pk}`}
      >
        <p>Switch Network</p>
      </ClaimButton>
    </>
  );
};

export default WrongNetworkBody;
