"use client";

import { SecondaryGreenColorButton } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/text.style";
import { FC } from "react";
import { Chain, ClaimReceipt } from "@/types";
import animation from "@/assets/animations/GasFee-delivery2.json";
import Lottie from "react-lottie";

const ClaimPendingBody: FC<{
  chain: Chain;
  closeClaimModal: () => void;
  activeClaimReceipt: ClaimReceipt;
}> = ({ chain, closeClaimModal, activeClaimReceipt }) => {
  return (
    <>
      <Lottie
        options={{
          animationData: animation,
          loop: true,
          autoplay: true,
        }}
        width={200}
      ></Lottie>
      <Text width="100%" fontSize="14" color="space_green" $textAlign="center">
        Claim transaction submitted
      </Text>
      <Text
        width="100%"
        fontSize="14"
        color="second_gray_light"
        mb={3}
        $textAlign="center"
      >
        The claim transaction will be completed soon
      </Text>
      <SecondaryGreenColorButton
        onClick={closeClaimModal}
        className="!w-full"
        data-testid={`chain-claim-action-${chain.pk}`}
      >
        Close
      </SecondaryGreenColorButton>
    </>
  );
};

export default ClaimPendingBody;
