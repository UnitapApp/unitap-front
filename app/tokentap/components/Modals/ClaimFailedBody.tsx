"use client"

import Icon from "@/components/ui/Icon"
import { useTokenTapContext } from "@/context/tokenTapProvider"
import { Token } from "@/types"
import { FC } from "react"
import { Text } from "@/components/ui/text.style"
import { ClaimButton } from "@/components/ui/Button/button"
import { useUserProfileContext } from "@/context/userProfile"

const ClaimFailedBody: FC<{
  token: Token
}> = ({ token }) => {
  const { nonEVMWalletAddress, setNonEVMWalletAddress } =
    useUserProfileContext()
  const { claimError, claimTokenLoading, claimToken } = useTokenTapContext()

  return (
    <>
      <Icon
        data-testid="chain-logo"
        className="chain-logo z-10 mt-14 mb-10"
        iconSrc={token.imageUrl}
        width="auto"
        height="110px"
      />
      <span className="flex justify-center items-center font-medium mb-3">
        <Text
          className="!mb-0"
          width="100%"
          fontSize="14"
          color="warningRed"
          $textAlign="center"
        >
          Claim Failed!
        </Text>
        <Icon
          iconSrc="assets/images/modal/failed-state-x.svg"
          width="22px"
          height="auto"
          className="ml-2"
        />
      </span>
      <Text
        width="100%"
        fontSize="14"
        color="second_gray_light"
        mb={3}
        $textAlign="center"
      >
        An error occurred while processing your request
      </Text>

      <p className="text-white text-sm my-4 text-center px-3 mb-6">
        {claimError}
      </p>
      <div className="address-input flex w-full bg-gray30 rounded-xl my-6 p-2.5 items-center">
        <input
          className="address-input__input w-full placeholder:text-gray80 text-sm mx-1.5 bg-transparent text-white"
          type="text"
          placeholder="Paste your lightning invoice "
          value={nonEVMWalletAddress}
          onChange={(e) => setNonEVMWalletAddress(e.target.value)}
        />
        <button
          className="address-input__paste-button btn btn--sm btn--primary-light font-semibold tracking-wide"
          onClick={() =>
            navigator.clipboard
              .readText()
              .then((text) => setNonEVMWalletAddress(text))
          }
        >
          PASTE
        </button>
      </div>
      <ClaimButton
        $fontSize="16px"
        onClick={() =>
          claimToken(token, {
            lightningInvoice: nonEVMWalletAddress,
          })
        }
        $width={"100%"}
        className="!w-full"
        data-testid={`chain-claim-action-${token.id}`}
      >
        {claimTokenLoading ? <p> Claiming... </p> : <p>Try Again</p>}
      </ClaimButton>
    </>
  )
}

export default ClaimFailedBody
