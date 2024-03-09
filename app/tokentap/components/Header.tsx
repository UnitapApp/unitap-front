"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import Icon from "@/components/ui/Icon";
import { range } from "@/utils";
import Timer from "./timer";

const Header = () => {
  return (
    <div className="tap-header h-[250px] rounded-3xl flex flex-col lg:items-start md:justify-between overflow-hidden relative mb-5 border-4 border-gray20">
      <div className="flex w-full">
        <div className="z-10 tracking-[10px] font-semibold text-2xl p-5 text-[#AEF2D1]">
          TOKENTAP
        </div>
        <Timer />
        <span className="ml-auto" />
      </div>

      <div className="flex flex-col w-full mb-5 justify-center items-center">
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
    <div className="rounded-lg bg-gray30 border-2 border-gray50">
      <p>Connect BrightID to See Your Claims</p>
    </div>
  );
};

const TokenCoins = () => {
  const { openClaimModal, claimedTokensList } = useTokenTapContext();

  const { tokentapRoundClaimLimit } = useUserProfileContext();

  return (
    <div className="py-[2px] px-3 flex gap-x-3">
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
          (tokentapRoundClaimLimit ?? 4) - claimedTokensList.length
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
