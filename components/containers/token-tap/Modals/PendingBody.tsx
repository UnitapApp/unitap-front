"use client"

import { SecondaryGreenColorButton } from "@/components/ui/Button/button"
import { Text } from "@/components/ui/text.style"
import { useTokenTapContext } from "@/context/tokenTapProvider"
import { FC, useEffect } from "react"
import lottie from "lottie-web"
import animation from "@/assets/animations/GasFee-delivery2.json"

const PendingBody: FC<{
  tokenId: number
}> = ({ tokenId }) => {
  const { closeClaimModal, claimTokenLoading } = useTokenTapContext()

  useEffect(() => {
    if (claimTokenLoading) {
      const animationElement = document.querySelector("#animation")
      if (animationElement) {
        animationElement.innerHTML = ""
      }
      lottie.loadAnimation({
        container: document.querySelector("#animation") as HTMLInputElement,
        animationData: animation,
        loop: true,
        autoplay: true,
      })
    }
  }, [claimTokenLoading])

  return (
    <>
      <div
        data-testid={`token-claim-pending-${tokenId}`}
        id="animation"
        style={{ width: "200px" }}
      ></div>
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
      <SecondaryGreenColorButton onClick={closeClaimModal} $width={"100%"}>
        Close
      </SecondaryGreenColorButton>
    </>
  )
}

export default PendingBody
