"use client"

import Icon from "@/components/ui/Icon"
import { useTokenTapContext } from "@/context/tokenTapProvider"
import { ClaimReceiptState } from "@/types"

const NotRemainingClaimsBody = () => {
  const { claimedTokensList, closeClaimModal } = useTokenTapContext()

  return (
    <div className="flex text-white flex-col items-center justify-center w-full pt-2">
      <div className="mt-20 claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
        {claimedTokensList
          .filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
          .map((claim, key) => {
            return (
              <Icon
                key={key}
                iconSrc={claim.tokenDistribution.imageUrl}
                className={`rounded-full ${
                  claim.status === ClaimReceiptState.PENDING && "animated-dabe"
                }`}
                width="36px"
                height="40px"
              />
            )
          })}
      </div>
      <div className="mt-10 text-center text-gray100">
        {"You've"} reached your claim limit for now
      </div>

      <button
        onClick={closeClaimModal}
        className="w-full mt-10 py-3 border-2 text-gray100 font-normal bg-gray10 border-gray50 rounded-xl"
      >
        Close
      </button>
    </div>
  )
}

export default NotRemainingClaimsBody
