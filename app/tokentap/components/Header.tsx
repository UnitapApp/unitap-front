"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import Icon from "@/components/ui/Icon";
import { range } from "@/utils";
import Timer from "./timer";

const Header = () => {
  return (
    <div className="tap-header relative mb-5 flex h-[250px] flex-col overflow-hidden rounded-3xl border-4 border-bg03 md:justify-between lg:items-start">
      <div className="flex w-full flex-wrap justify-center md:justify-start">
        <div className="z-10 p-5 text-2xl font-semibold tracking-[10px] text-[#AEF2D1]">
          TOKENTAP
        </div>
        <Timer />
      </div>

      <div className="mb-5 flex w-full flex-col items-center justify-center">
        <Icon iconSrc="/assets/images/token-tap/token-header-bg.svg" />
        <div className="mt-5">
          {/* {userProfile ? <TokenCoins /> : <RenderConnectBrightID />} */}
        </div>
      </div>
    </div>
  );
};

const RenderConnectBrightID = () => {
  return (
    <div className="rounded-lg border-2 border-gray50 bg-gray30">
      <p>Connect BrightID to See Your Claims</p>
    </div>
  );
};

const TokenCoins = () => {
  const { openClaimModal, claimedTokensList } = useTokenTapContext();

  const { tokentapRoundClaimLimit } = useUserProfileContext();

  return (
    <div className="flex gap-x-3 px-3 py-[2px]">
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
