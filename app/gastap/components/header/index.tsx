"use client";

import Icon from "@/components/ui/Icon";
import Timer from "../timer";
import { range } from "@/utils";
import { ClaimReceiptState } from "@/types";
import { useUserProfileContext } from "@/context/userProfile";
import { useGasTapContext } from "@/context/gasTapProvider";

import "./styles.scss";

const Header = () => {
  const { userProfile } = useUserProfileContext();

  return (
    <div className="gas-tap-header h-[202px] rounded-2xl flex flex-col  md:flex-row lg:items-start md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray30">
      <div className="flex">
        <div className="header-left z-10 tracking-[10px] font-semibold text-2xl text-[#AEF2D1]">
          GASTAP
        </div>
        <Timer />
      </div>
      <div className="header-right flex mt-2 justify-center md:justify-start">
        <div className="claim-stat z-10">
          {userProfile ? <Dabes /> : <RenderConnectBrightID />}
        </div>
      </div>
    </div>
  );
};

const Dabes = () => {
  const { activeClaimHistory, openClaimModal } = useGasTapContext();
  const { gastapRoundClaimLimit } = useUserProfileContext();

  return (
    <div
      data-testid="claims-chain-list"
      className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3"
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
        {range(
          0,
          (gastapRoundClaimLimit ?? 5) -
            activeClaimHistory.filter(
              (claim) => claim.status !== ClaimReceiptState.REJECTED
            ).length
        ).map((i) => {
          return (
            <Icon
              key={i}
              iconSrc="assets/images/gas-tap/empty-dabe.svg"
              width="36px"
              height="auto"
            />
          );
        })}
      </>
    </div>
  );
};

const RenderConnectBrightID = () => {
  return (
    <div className="claim-stat__not-claimed rounded-lg bg-gray30 border-2 border-gray50">
      <p className="claim-stat__not-claimed__text px-4 py-3.5 text-gray80 text-xs font-bold">
        Connect BrightID to See Your Claims
      </p>
    </div>
  );
};

export default Header;
