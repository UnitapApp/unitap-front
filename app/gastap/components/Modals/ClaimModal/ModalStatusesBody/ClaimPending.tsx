"use client";

import { SecondaryGreenColorButton } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/text.style";
import { FC, useEffect } from "react";
import { Chain, ClaimReceipt, ClaimReceiptState } from "@/types";
import lottie from "lottie-web";
import animation from "@/quest/assets/animations/GasFee-delivery2.json";

const ClaimPendingBody: FC<{
  chain: Chain;
  closeClaimModal: () => void;
  activeClaimReceipt: ClaimReceipt;
}> = ({ chain, closeClaimModal, activeClaimReceipt }) => {
  useEffect(() => {
    if (activeClaimReceipt?.status === ClaimReceiptState.PENDING) {
      const animationElement = document.querySelector("#animation");
      if (animationElement) {
        animationElement.innerHTML = "";
      }
      lottie.loadAnimation({
        container: document.querySelector("#animation") as HTMLInputElement,
        animationData: animation,
        loop: true,
        autoplay: true,
      });
    }
  }, []);
  return (
    <>
      <div
        data-testid={`chain-claim-pending-${chain.pk}`}
        id="animation"
        style={{ width: "200px" }}
      ></div>
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
        The claim transaction will be compeleted soon
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
