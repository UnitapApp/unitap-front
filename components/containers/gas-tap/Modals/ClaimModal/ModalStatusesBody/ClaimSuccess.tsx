"use client";

import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { Chain, ClaimReceipt, ClaimReceiptState } from "@/types";
import { getChainClaimIcon, getTxUrl } from "@/utils/chain";
import { formatWeiBalance } from "@/utils/numbers";
import { DropIconWrapper } from "../claimModal.style";
import { Text } from "@/components/ui/text.style";

const ClaimSuccessBody: FC<{
  chain: Chain;
  activeClaimReceipt: ClaimReceipt;
}> = ({ chain, activeClaimReceipt }) => {
  const handleClick = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I've just claimed ${formatWeiBalance(chain.maxClaimAmount)} ${
        chain.symbol
      } on ${chain.chainName} from @Unitap_app 🔥\nClaim yours:`
    )}&url=${encodeURIComponent(
      "unitap.app/gas-tap?hc=" + encodeURIComponent(chain.chainName)
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-success-${chain.pk}`}>
        <Icon
          className="chain-logo z-10 mt-14 mb-10"
          width="auto"
          height="110px"
          iconSrc={getChainClaimIcon(chain)}
          alt=""
        />
      </DropIconWrapper>
      <span className="flex justify-center items-center font-medium mb-3">
        <Text
          className="!mb-0"
          width="100%"
          fontSize="14"
          color="space_green"
          $textAlign="center"
        >
          {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
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
        mb={1}
        $textAlign="center"
      >
        we successfully transferred {formatWeiBalance(chain.maxClaimAmount)}{" "}
        {chain.symbol} to your wallet
      </Text>

      <Text
        width="100%"
        fontSize="14"
        color="second_gray_light"
        className="underline cursor-pointer"
        mb={3}
        $textAlign="center"
        onClick={() =>
          window.open(getTxUrl(chain, activeClaimReceipt.txHash!), "_blank")
        }
      >
        view on explorer
      </Text>

      <div className="relative w-full">
        <button
          onClick={handleClick}
          className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
        >
          <p className="text-sm font-semibold text-twitter">Share on Twitter</p>
        </button>
        <Icon
          iconSrc="/assets/images/gas-tap/twitter-share.svg"
          className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
          width="auto"
          height="26px"
        />
      </div>
    </>
  );
};

export default ClaimSuccessBody;
