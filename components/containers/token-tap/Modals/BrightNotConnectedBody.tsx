"use client"

import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import { DropIconWrapper } from "../../gas-tap/Modals/ClaimModal/claimModal.style"
import { FC } from "react"
import { useGlobalContext } from "@/context/globalProvider"

const BrightNotConnectedBody: FC<{
  chainPk: number
  imageUrl: string
}> = ({ chainPk, imageUrl }) => {
  const { openBrightIdModal } = useGlobalContext()
  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-brightid-not-connected`}>
        <Icon
          className="chain-logo z-10 mt-14 mb-10"
          width="auto"
          height="110px"
          iconSrc={imageUrl}
          alt=""
        />
      </DropIconWrapper>
      <p className="text-white text-sm mb-5 mt-11">
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
  )
}

export default BrightNotConnectedBody
