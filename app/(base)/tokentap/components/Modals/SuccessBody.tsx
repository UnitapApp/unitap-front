"use client";

import Icon from "@/components/ui/Icon";
import { Token } from "@/types";
import { FC } from "react";
import { Text } from "@/components/ui/text.style";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";

const SuccessBody: FC<{
  token: Token;
}> = ({ token }) => {
  const calculateClaimAmount =
    token.amount / 10 ** (token.decimals ?? token.chain.decimals);

  const { claimedTokensList, claimTokenResponse } = useTokenTapContext();

  const collectedToken = claimedTokensList.find(
    (item) => item.tokenDistribution.id === token.id,
  );

  const handleClick = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I've just claimed ${calculateClaimAmount} ${token?.token} from @Unitap_app 🔥\nClaim yours:`,
    )}&url=${encodeURIComponent(
      "unitap.app/token-tap?hc=" + encodeURIComponent(token.token),
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <>
      <DropIconWrapper data-testid={`token-claim-finished-${token.id}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={token.imageUrl}
          alt=""
        />
      </DropIconWrapper>

      <span className="mb-3 flex items-center justify-center font-medium">
        <Text
          className="!mb-0"
          width="100%"
          fontSize="14"
          color="space_green"
          $textAlign="center"
        >
          {calculateClaimAmount} {token.token} Claimed
        </Text>
        <Icon
          iconSrc="assets/images/modal/successful-state-check.svg"
          width="22px"
          height="auto"
          className="ml-2"
        />
      </span>

      <Text
        width="100%"
        fontSize="14"
        color="second_gray_light"
        className="cursor-pointer underline"
        mb={3}
        $textAlign="center"
        onClick={() =>
          window.open(
            token.chain.explorerUrl +
              "tx/" +
              (collectedToken?.txHash ?? claimTokenResponse?.txHash),
          )
        }
      >
        view on explorer
      </Text>

      <div className="relative w-full">
        <button
          onClick={handleClick}
          className={`gradient-outline-twitter-button flex w-full items-center justify-center rounded-xl border-gray00 bg-gray00 px-3 py-4 transition-all duration-75 hover:bg-gray20`}
        >
          <p className="text-sm font-semibold text-twitter">Share on Twitter</p>
        </button>
        <Icon
          iconSrc="/assets/images/landing/x-logo.svg"
          className="pointer-events-none absolute right-4 top-1/2 z-10 h-6 w-6 -translate-y-1/2"
          width="auto"
          height="26px"
        />
      </div>
    </>
  );
};

export default SuccessBody;
