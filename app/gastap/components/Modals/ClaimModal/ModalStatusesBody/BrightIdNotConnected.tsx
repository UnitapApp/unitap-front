"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";
import { useGlobalContext } from "@/context/globalProvider";

const BrightIdNotConnectedBody: FC<{ iconSrc: string; chainPk: number }> = ({
  iconSrc,
  chainPk,
}) => {
  const { openBrightIdModal } = useGlobalContext();

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-brightid-not-connected`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={iconSrc}
          alt=""
        />
      </DropIconWrapper>
      <p className="mb-5 mt-11 text-sm text-white">
        You need to connect your BrightID to claim your tokens
      </p>

      <ClaimButton
        onClick={openBrightIdModal}
        $width="100%"
        className="!w-full"
        $fontSize="16px"
        data-testid={`chain-claim-action-${chainPk}`}
      >
        <p>Connect BrightID</p>
      </ClaimButton>
    </>
  );
};

export default BrightIdNotConnectedBody;
