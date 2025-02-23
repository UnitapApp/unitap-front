"use client";

import { SecondaryGreenColorButton } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/text.style";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { FC, useEffect, useMemo } from "react";
import lottie from "lottie-web";
import animation from "@/quest/assets/animations/GasFee-delivery2.json";

const PendingBody: FC<{
  tokenId: number;
}> = ({ tokenId }) => {
  const {
    closeClaimModal,
    claimTokenLoading,
    claimedTokensList,
    selectedTokenForClaim,
  } = useTokenTapContext();

  const token = useMemo(
    () =>
      claimedTokensList.find(
        (token) => token.tokenDistribution.id === selectedTokenForClaim!.id,
      ),
    [claimedTokensList, selectedTokenForClaim],
  );

  useEffect(() => {
    if (claimTokenLoading || token?.status === "Pending") {
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
  }, [claimTokenLoading, token?.status]);

  return (
    <>
      <div
        data-testid={`token-claim-pending-${tokenId}`}
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
        The claim transaction will be completed soon
      </Text>
      <SecondaryGreenColorButton className="!w-full" onClick={closeClaimModal}>
        Close
      </SecondaryGreenColorButton>
    </>
  );
};

export default PendingBody;
