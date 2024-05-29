"use client";

import { SecondaryGreenColorButton } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/text.style";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { FC, useMemo } from "react";
import animation from "@/assets/animations/GasFee-delivery2.json";
import Lottie from "react-lottie";

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
      <SecondaryGreenColorButton className="!w-full" onClick={closeClaimModal}>
        Close
      </SecondaryGreenColorButton>
    </>
  );
};

export default PendingBody;
