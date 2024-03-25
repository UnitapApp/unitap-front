"use client";

import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { Chain } from "@/types";
import { Text } from "@/components/ui/text.style";
import Image from "next/image";
import { formatWeiBalance } from "@/utils";

const ClaimFailedBody: FC<{
  chain: Chain;
  claimLoading: boolean;
  claim: (chainPK: number) => void;
}> = ({ chain, claim, claimLoading }) => {
  return (
    <>
      <Image
        className="mb-10"
        width="150"
        height="153"
        src={"/assets/images/gas-tap/claim-failed.svg"}
        alt="spaceman failed"
      />
      <span className="flex items-center justify-center font-medium">
        <Icon
          iconSrc="assets/images/gas-tap/error.svg"
          width="25"
          height="25"
          className="mr-1"
          alt="error"
        />
        <Text
          className="!mb-0"
          width="100%"
          fontSize="14"
          color="warningRed"
          $textAlign="center"
        >
          Claim Failed!
        </Text>
      </span>
      <p className="mb-5 mt-5 text-xs text-gray100">
        Something went wrong, try again to claim{" "}
        {`${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol}`}
      </p>
      <button
        onClick={() => claim(chain.pk)}
        disabled={claimLoading}
        className="gradient-button-st-1 w-full rounded-3xl !bg-ut-grad-ltr p-[2px] text-sm"
      >
        <div className="flex h-11 items-center justify-center rounded-3xl px-4">
          {claimLoading ? (
            <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
              Claiming...
            </p>
          ) : (
            <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
              Try Again
            </p>
          )}
        </div>
      </button>
    </>
  );
};

export default ClaimFailedBody;
