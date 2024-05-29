"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { Chain } from "@/types";
import { useNetworkSwitcher } from "@/utils/wallet";
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";

const WrongNetworkBody: FC<{
  imageUrl: string;
  chain: Chain;
}> = ({ chain, imageUrl }) => {
  const { switchChain, addAndSwitchChain } = useNetworkSwitcher();

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-wrong-network`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={imageUrl}
          alt=""
        />
      </DropIconWrapper>
      <p className="mb-12 mt-2 px-4 text-center text-sm font-medium leading-6 text-white">
        You need to switch to the <strong>{chain.chainName}</strong> network to
        claim your tokens
      </p>

      <ClaimButton
        onClick={() => switchChain(Number(chain.chainId))}
        $width="100%"
        className="!w-full"
        $fontSize="16px"
        data-testid={`chain-claim-action-${chain.pk}`}
      >
        <p>Switch Network</p>
      </ClaimButton>
    </>
  );
};

export default WrongNetworkBody;
