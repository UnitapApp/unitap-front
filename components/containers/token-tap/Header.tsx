"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import Icon from "@/components/ui/Icon";
import { range } from "@/utils";

import Styles from "./header.module.scss";

const Header = () => {
  const { userProfile } = useUserProfileContext();

  return (
    <div
      className={`${Styles["token-tap-header"]} relative mb-5 flex h-[202px] w-full flex-col overflow-hidden rounded-2xl border-4 border-gray20 bg-right p-4 md:flex-row md:justify-between lg:items-end`}
    >
      <div className="header-left z-10 flex h-[100%] flex-col items-start justify-end">
        <span className="mb-2 flex items-center">
          <Icon
            className="gas-tap mb-1 h-12 w-auto"
            iconSrc="assets/images/token-tap/token-tap-typo-logo.svg"
          />
          {/* <div className="rounded-lg border border-gray50 bg-gray10 px-3 py-2 text-xs font-bold text-white">
            <p className="text-gradient-primary">Beta</p>
          </div> */}
        </span>
        <p className="text-xs text-gray100">
          Get the tasks done and claim your rewards.
        </p>
      </div>
      <div className="header-right  mt-2 flex justify-center md:justify-start">
        <div className="claim-stat z-10">
          {/* {userProfile ? <TokenCoins /> : <RenderConnectBrightID />} */}
        </div>
      </div>
    </div>
  );
};

const RenderConnectBrightID = () => {
  return (
    <div className="claim-stat__not-claimed rounded-lg border-2 border-gray50 bg-gray30">
      <p className="claim-stat__not-claimed__text px-4 py-3.5 text-xs font-bold text-gray80">
        Connect BrightID to See Your Claims
      </p>
    </div>
  );
};

const TokenCoins = () => {
  const { openClaimModal, claimedTokensList } = useTokenTapContext();

  const { tokentapRoundClaimLimit } = useUserProfileContext();

  return (
    <div className="claim-stat__claimed flex gap-x-3 rounded-lg border-2 border-gray80 bg-primaryGradient px-3 py-[2px]">
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
          );
        })}
        {range(
          0,
          (tokentapRoundClaimLimit ?? 4) - claimedTokensList.length,
        ).map((i, key) => {
          return (
            <Icon
              key={key}
              iconSrc="assets/images/token-tap/empty-coin.png"
              width="36px"
              height="36px"
            />
          );
        })}
      </>
    </div>
  );
};

export default Header;
