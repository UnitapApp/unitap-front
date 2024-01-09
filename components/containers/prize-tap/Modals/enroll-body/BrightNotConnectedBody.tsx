"use client";

import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/globalProvider";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { Prize } from "@/types";
import { FC } from "react";

const BrightNotConnectedBody: FC<{
  raffle: Prize;
  method: string;
}> = ({ raffle, method }) => {
  // const tokenImgLink: string = raffle.isPrizeNft
  //   ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
  //       Number(raffle.tokenUri.split("/")[3]) + 1
  //     }.png`
  //   : ""

  const { closeEnrollModal } = usePrizeTapContext();
  const { openBrightIdModal } = useGlobalContext();
  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-brightid-not-connected`}>
        <Icon
          className="chain-logo z-10 mt-14 mb-10"
          width="auto"
          height="110px"
          iconSrc={raffle.imageUrl}
          alt=""
        />
      </DropIconWrapper>

      <p className="text-white text-sm mb-5 mt-11">
        {method === "Enroll"
          ? "You need to connect your BrightID to enroll in raffle"
          : " You need to connect your BrightID to claim your prize"}
      </p>

      <ClaimButton
        onClick={() => {
          openBrightIdModal();
          closeEnrollModal();
        }}
        $width="100%"
        className="!w-full"
        $fontSize="16px"
        data-testid={`chain-claim-action-${raffle.chain.pk}`}
      >
        <p>Connect BrightID</p>
      </ClaimButton>
    </>
  );
};

export default BrightNotConnectedBody;
