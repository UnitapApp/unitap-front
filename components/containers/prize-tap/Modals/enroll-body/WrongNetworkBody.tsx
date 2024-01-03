"use client";

import { DropIconWrapper } from "@/components/containers/gas-tap/Modals/ClaimModal/claimModal.style";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { Prize } from "@/types";
import { useNetworkSwitcher } from "@/utils/wallet";
import { FC } from "react";

const WrongNetworkBody: FC<{
  raffle: Prize;
}> = ({ raffle }) => {
  // const tokenImgLink: string = raffle.isPrizeNft
  //   ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
  //       Number(raffle.tokenUri.split("/")[3]) + 1
  //     }.png`
  //   : ""

  const { switchChain } = useNetworkSwitcher();

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-wrong-network`}>
        <Icon
          className="chain-logo z-10 mt-14 mb-10"
          width="auto"
          height="110px"
          iconSrc={raffle!.imageUrl}
          alt=""
        />
      </DropIconWrapper>
      <p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
        You need to switch to the <strong>{raffle.chain.chainName}</strong>{" "}
        network to Enroll in Raffle
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
