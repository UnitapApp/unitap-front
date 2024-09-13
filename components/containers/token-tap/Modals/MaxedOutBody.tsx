"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { Text } from "@/components/ui/text.style";
import { FC } from "react";
import { Token } from "@/types";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { DropIconWrapper } from "../../modals/claimModal.style";

const MaxedOutBody: FC<{
  token: Token;
}> = ({ token }) => {
  const { closeClaimModal } = useTokenTapContext();

  return (
    <>
      <DropIconWrapper data-testid={`token-claim-maxed-out-${token.id}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={token.image}
          alt={token.name}
        />
      </DropIconWrapper>
      <Text
        width="100%"
        fontSize="14"
        color="second_gray_light"
        mb={3}
        $textAlign="center"
      >
        {token.isMaxedOut
          ? "Unfortunately, there are no more tokens to claim. Make sure you're following us on Twitter to be notified when more tokens are available."
          : "Unfortunately, you missed the deadline to claim your tokens. Make sure you're following us on Twitter to be notified when more tokens are available."}
      </Text>
      <ClaimButton
        onClick={closeClaimModal}
        $width={"100%"}
        $fontSize="16px"
        className="!w-full"
        data-testid={`token-claim-action-${token.id}`}
        color="space_green"
      >
        <p>Close</p>
      </ClaimButton>
    </>
  );
};

export default MaxedOutBody;
