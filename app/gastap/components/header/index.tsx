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
    <div className="gas-tap-header h-[250px] rounded-3xl flex flex-col lg:items-start md:justify-between overflow-hidden relative mb-5 border-4 border-gray30">
      <div className="flex w-full">
        <div className="z-10 tracking-[10px] font-semibold text-2xl p-5 text-[#AEF2D1]">
          GASTAP
        </div>
        <Timer />
        <span className="ml-auto" />
      </div>

      <div className="flex w-full mb-5 justify-center">
        <div>
          <Icon iconSrc="/assets/images/gas-tap/half-galon.svg" />
          {userProfile ? <Gallons /> : <RenderConnectBrightID />}
        </div>
      </div>
      {/* <div className="flex mt-2 justify-center md:justify-start">
        <div className="claim-stat z-10">
        
        </div>
      </div> */}
    </div>
  );
};

const Gallons = () => {
  const { activeClaimHistory, openClaimModal } = useGasTapContext();
  // const { gastapRoundClaimLimit } = useUserProfileContext();

  return (
    <div
      data-testid="claims-chain-list"
      className="py-[2px] h-11 px-3 flex gap-x-3"
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
    <div className="claim-stat__not-claimed rounded-lg bg-gray30 border-2 border-gray50">
      <p className="claim-stat__not-claimed__text px-4 py-3.5 text-gray80 text-xs font-bold">
        Connect BrightID to See Your Claims
      </p>
    </div>
  );
};

export default Header;
