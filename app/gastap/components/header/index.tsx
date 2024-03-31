"use client";

import Icon from "@/components/ui/Icon";
import Timer from "../timer";
import { ClaimReceiptState } from "@/types";
import { useUserProfileContext } from "@/context/userProfile";
import { useGasTapContext } from "@/context/gasTapProvider";

import "./styles.scss";

const Header = () => {
  const { userProfile } = useUserProfileContext();

  return (
    <div className="tap-header relative mb-5 flex h-[250px] flex-col overflow-hidden rounded-3xl border-4 border-bg03 md:justify-between lg:items-start">
      <div className="flex w-full flex-wrap justify-center md:justify-start">
        <div className="z-10 p-5 text-2xl font-semibold tracking-[10px] text-[#AEF2D1]">
          GASTAP
        </div>
        <Timer />
      </div>

      <div className="mb-5 flex w-full justify-center">
        <div>
          <Icon iconSrc="/assets/images/gas-tap/half-galon.svg" />
          {userProfile ? <Gallons /> : <RenderConnectBrightID />}
        </div>
      </div>
    </div>
  );
};

const Gallons = () => {
  const { activeClaimHistory, openClaimModal } = useGasTapContext();
  // const { gastapRoundClaimLimit } = useUserProfileContext();

  return (
    <div
      data-testid="claims-chain-list"
      className="flex h-11 gap-x-3 px-3 py-[2px]"
    >
      <>
        {activeClaimHistory
          .filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
          .map((claim, index) => {
            return (
              <Icon
                onClick={() => openClaimModal(claim.chain.pk)}
                key={index}
                data-testid={`chain-claimed-success-dabe-${claim.pk}`}
                iconSrc={claim.chain.gasImageUrl || claim.chain.logoUrl}
                className={`cursor-pointer transition ${
                  claim.status === ClaimReceiptState.PENDING && "animated-dabe"
                }`}
                width="36px"
                height="40px"
              />
            );
          })}
      </>
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

export default Header;
