"use client";

import Icon from "@/components/ui/Icon";
import { Token } from "@/types";
import { FC } from "react";
import { Text } from "@/components/ui/text.style";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { DropIconWrapper } from "../../modals/claimModal.style";
import Link from "next/link";

const TokenReservedBody: FC<{
  token: Token;
}> = ({ token }) => {
  const calculateClaimAmount =
    token.amount / 10 ** (token.decimals ?? token.chain.decimals);

  const { claimedTokensList, claimTokenResponse } = useTokenTapContext();

  const collectedToken = claimedTokensList.find(
    (item) => item.tokenDistribution.id === token.id,
  );

  return (
    <>
      <DropIconWrapper data-testid={`token-claim-reserved-${token.id}`}>
        <Icon
          className="chain-logo z-10 mb-4 mt-3"
          width="auto"
          height="160px"
          iconSrc={"/assets/images/token-tap/money.svg"}
          alt=""
        />
      </DropIconWrapper>

      <span className="mb-3 flex items-center justify-center font-medium">
        <Text
          className="!mb-0 text-white"
          width="100%"
          fontSize="14"
          $textAlign="center"
        >
          Reserved for UP Holders
        </Text>
      </span>
      <div className="my-4 text-center text-xs leading-loose text-gray100">
        Unitap secures %10 of each Token Tap for the Unitap Pass holders for the
        first 30% of the Tap{"'"}s duration. Example: $1 for 1000 participants
        to be live for 9 days. We secure 100 spots for Unitap Pass holders in
        the first 3 days.
      </div>

      <div className="relative w-full">
        <Link
          href="/pass"
          className={`flex w-full rounded-xl bg-dark-primary bg-no-repeat p-[5px] font-semibold`}
        >
          <div className="flex w-full items-center justify-center bg-gray50 px-3 py-2 text-center">
            <p className="bg-g-primary bg-clip-text text-transparent">
              View Unitap Pass
            </p>
            <Icon
              iconSrc="/assets/images/landing/arrow-right.svg"
              className="pointer-events-none ml-4"
              width="auto"
              height="14px"
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default TokenReservedBody;
