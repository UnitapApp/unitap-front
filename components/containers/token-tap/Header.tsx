"use client"

import { useUserProfileContext } from "@/context/userProfile"
import { useTokenTapContext } from "@/context/tokenTapProvider"
import Icon from "@/components/ui/Icon"
import { range } from "@/utils"

import Styles from "./header.module.scss"

const Header = () => {
  const { userProfile } = useUserProfileContext()

  return (
    <div
      className={`${Styles["token-tap-header"]} bg-right h-[202px] w-full rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20`}
    >
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <span className="flex items-center mb-2">
          <Icon
            className="gas-tap h-12 w-auto mb-1"
            iconSrc="assets/images/token-tap/token-tap-typo-logo.svg"
          />
          <div className="bg-gray10 px-3 py-2 border font-bold border-gray50 text-white text-xs rounded-lg">
            <p className="text-gradient-primary">Beta</p>
          </div>
        </span>
        <p className="text-xs text-gray100">
          Where everyone can claim any kind of tokens such as community tokens,
          NFTs, UBI token.
        </p>
      </div>
      <div className="header-right  flex mt-2 justify-center md:justify-start">
        <div className="claim-stat z-10">
          {userProfile ? <TokenCoins /> : <RenderConnectBrightID />}
        </div>
      </div>
    </div>
  )
}

const RenderConnectBrightID = () => {
  return (
    <div className="claim-stat__not-claimed rounded-lg bg-gray30 border-2 border-gray50">
      <p className="claim-stat__not-claimed__text px-4 py-3.5 text-gray80 text-xs font-bold">
        Connect BrightID to See Your Claims
      </p>
    </div>
  )
}

const TokenCoins = () => {
  const { openClaimModal, claimedTokensList } = useTokenTapContext()

  const { tokentapRoundClaimLimit } = useUserProfileContext()

  return (
    <div className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
      <>
        {claimedTokensList.map((claim, key) => {
          return (
            <Icon
              onClick={() => openClaimModal(claim.tokenDistribution)}
              key={key}
              iconSrc={
                claim.tokenDistribution.tokenImageUrl ||
                claim.tokenDistribution.chain.logoUrl
              }
              className={`cursor-pointer rounded-full transition ${
                claim.status === "Pending" && "animated-dabe"
              }`}
              width="36px"
              height="40px"
            />
          )
        })}
        {range(
          0,
          (tokentapRoundClaimLimit ?? 4) - claimedTokensList.length
        ).map((i, key) => {
          return (
            <Icon
              key={key}
              iconSrc="assets/images/token-tap/empty-coin.png"
              width="36px"
              height="36px"
            />
          )
        })}
      </>
    </div>
  )
}

export default Header
