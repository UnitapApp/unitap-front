"use client";

import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { Chain, ClaimReceipt, ClaimReceiptState } from "@/types";
import { getChainClaimIcon, getTxUrl } from "@/utils/chain";
import { formatWeiBalance } from "@/utils/numbers";
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";
import { Text } from "@/components/ui/text.style";

const ClaimSuccessBody: FC<{
  chain: Chain;
  activeClaimReceipt: ClaimReceipt;
}> = ({ chain, activeClaimReceipt }) => {
  const handleClick = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I've just claimed ${formatWeiBalance(chain.maxClaimAmount)} ${
        chain.symbol
      } on ${chain.chainName} from @Unitap_app 🔥\nClaim yours:`,
    )}&url=${encodeURIComponent(
      "unitap.app/gastap?hc=" + encodeURIComponent(chain.chainName),
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-success-${chain.pk}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-4"
          width="auto"
          height="110px"
          iconSrc={getChainClaimIcon(chain)}
          alt={chain.chainName}
        />
      </DropIconWrapper>
      <span className="mb-3 flex items-center justify-center font-medium">
        <Icon
          iconSrc="assets/images/modal/successful-state-check.svg"
          width="22px"
          height="auto"
          className="mr-2"
          alt="check"
        />
        <Text
          className="!mb-0"
          width="100%"
          fontSize="14"
          color="space_green"
          $textAlign="center"
        >
          {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
        </Text>
      </span>
      <p className="mt-4 text-sm text-gray100">
        Gas token claimed successfully.
      </p>

      <a
        href={getTxUrl(chain, activeClaimReceipt.txHash!)}
        target="_blank"
        className="mb-5 mt-2 flex cursor-pointer items-center text-xs font-semibold text-gray100 underline"
      >
        view on explorer
        <Icon
          iconSrc="/assets/images/gas-tap/external-link.svg"
          className="ml-1 mt-1"
          width="17"
          height="17"
          alt="external link"
        />
      </a>

      <div className="relative mt-5 w-full">
        <button
          onClick={handleClick}
          className={`bg-x-button flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-white bg-gray00 px-3 py-3 transition-all duration-75 hover:bg-gray20`}
        >
          <p className="text-sm font-semibold">Share on</p>
          <Icon
            iconSrc="/assets/images/landing/x-logo.svg"
            className="pointer-events-none h-6 w-6 pt-[2px]"
            width="auto"
            height="20px"
          />
        </button>
      </div>
    </>
  );
};

export default ClaimSuccessBody;
