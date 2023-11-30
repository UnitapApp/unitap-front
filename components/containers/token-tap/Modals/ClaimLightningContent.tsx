import { FC, useMemo, useState } from "react"
import { Chain } from "@/types"
import { useTokenTapContext } from "@/context/tokenTapProvider"
import { useUserProfileContext } from "@/context/userProfile"
import SuccessBody from "./SuccessBody"
import BrightNotConnectedBody from "./BrightNotConnectedBody"
import PendingBody from "./PendingBody"
import MaxedOutBody from "./MaxedOutBody"
import TokenPermissions from "../Permissions"
import Icon from "@/components/ui/Icon"
import ClaimFailedBody from "./ClaimFailedBody"

const ClaimLightningContent: FC<{ chain: Chain }> = ({ chain }) => {
  const {
    selectedTokenForClaim,
    claimToken,
    claimTokenSignatureLoading,
    claimError,
    claimedTokensList,
  } = useTokenTapContext()

  const [isPermissionsVerified, setIsPermissionsVerified] = useState(false)

  const token = useMemo(
    () =>
      claimedTokensList.find(
        (token) => token.tokenDistribution.id === selectedTokenForClaim!.id
      ),
    [claimedTokensList, selectedTokenForClaim]
  )

  const {
    userProfile,
    nonEVMWalletAddress,
    setNonEVMWalletAddress,
    tokentapRoundClaimLimit,
  } = useUserProfileContext()

  if (!selectedTokenForClaim) return null

  if (!userProfile)
    return (
      <BrightNotConnectedBody
        chainPk={selectedTokenForClaim.chain.pk}
        imageUrl={selectedTokenForClaim.imageUrl}
      />
    )

  if (token?.status === "Verified")
    return <SuccessBody token={selectedTokenForClaim} />

  if (token?.status === "Pending") return <PendingBody tokenId={token.id} />

  if (claimedTokensList.length >= (tokentapRoundClaimLimit ?? 4))
    return <MaxedOutBody token={selectedTokenForClaim} />

  // if (claimError) return

  if (selectedTokenForClaim?.isMaxedOut || selectedTokenForClaim?.isExpired)
    return <MaxedOutBody token={selectedTokenForClaim} />

  if (!isPermissionsVerified)
    return (
      <TokenPermissions
        token={selectedTokenForClaim!}
        onClose={() => setIsPermissionsVerified(true)}
      />
    )

  if (claimError) return <ClaimFailedBody token={selectedTokenForClaim} />

  return (
    <>
      <Icon
        data-testid="chain-logo"
        className="chain-logo z-10 mt-14 mb-10"
        iconSrc={selectedTokenForClaim!.imageUrl}
        width="auto"
        height="110px"
      />
      <div className="mt-3 text-gray100 text-sm leading-5">
        <p>1. Install wallet of satoshi:</p>
        <div className="mt-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.livingroomofsatoshi.wallet"
            className="ml-4 text-blue-500"
          >
            Android
          </a>
        </div>
        <div className="mt-2">
          <a
            href="https://apps.apple.com/us/app/wallet-of-satoshi/id1438599608"
            className="ml-4 text-blue-500"
          >
            IOS
          </a>
        </div>
        <p className="mt-2">2. Create an invoice for 100 Sats</p>
        <p className="mt-2">3. Paste the invoice here</p>
      </div>
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

      <button
        className={`btn ${
          !selectedTokenForClaim || claimTokenSignatureLoading
            ? "btn--disabled"
            : "btn--primary-outlined"
        } w-full`}
        onClick={() =>
          claimToken(selectedTokenForClaim, {
            lightningInvoice: nonEVMWalletAddress,
          })
        }
      >
        {claimTokenSignatureLoading ? (
          <p>{`Claiming ${selectedTokenForClaim.amount} ${selectedTokenForClaim.token}`}</p>
        ) : (
          <p>{`Claim ${selectedTokenForClaim.amount} ${selectedTokenForClaim.token}`}</p>
        )}
      </button>
    </>
  )
}

export default ClaimLightningContent
