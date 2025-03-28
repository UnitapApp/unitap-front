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
    <div className="gas-tap-header relative mb-5 flex h-[202px]  flex-col overflow-hidden  rounded-2xl border-4 border-gray20 p-4 md:flex-row md:justify-between lg:items-end">
      <div className="header-left z-10 flex flex-col items-start">
        <Icon
          className="gas-tap h-12 w-[140px]"
          iconSrc="assets/images/gas-tap/gas-tap-text-logo.svg"
        />
        <p className="text-xs text-gray100">
          Enjoy surfing Web3 without the worry of gas fees
        </p>
      </div>
      <Timer />
      <div className="header-right  mt-2 flex justify-center md:justify-start">
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
      className="claim-stat__claimed flex gap-x-3 rounded-lg border-2 border-gray80 bg-primaryGradient px-3 py-[2px]"
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
              (claim) => claim.status !== ClaimReceiptState.REJECTED,
            ).length,
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
    <div className="claim-stat__not-claimed rounded-lg border-2 border-gray50 bg-gray30">
      <p className="claim-stat__not-claimed__text px-4 py-3.5 text-xs font-bold text-gray80">
        Connect Wallet to See Your Claims
      </p>
    </div>
  );
};

export default Header;
