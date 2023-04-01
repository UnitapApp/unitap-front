import React, { useContext } from 'react';
import styled from 'styled-components/';
import Icon from 'components/basic/Icon/Icon';
import Timer from '../Timer/timer';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ClaimContext } from 'hooks/useChainList';
import { range } from 'utils';


const Header = () => {
  const { userProfile } = useContext(UserProfileContext);

  return (
    <div className="header gas-tap__header h-[202px] rounded-2xl flex justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <Icon className="gas-tap h-12 w-[140px]" iconSrc="assets/images/gas-tap/gas-tap-text-logo.svg" />
      </div>
      <Timer />
      <div className="header-right h-[100%] flex flex-col justify-end">
        <div className="claim-stat z-10">
          {userProfile?.profile ? (
            <Dabes />
          ) : (
            <RenderConnectBrightID />
          )}
        </div>
      </div>
    </div>
  );
};


const Dabes = () => {
  const { chainList, activeClaimHistory } = useContext(ClaimContext);

  return (
    <div className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
      <>
        {chainList?.map((chain) => {
          let claim = activeClaimHistory.find((claim) => claim.chain === chain.pk);
          if (claim) {
            return <Icon
              key={chain.chainId}
              iconSrc={chain.gasImageUrl || chain.logoUrl}
              className={`transition ${claim.status === '0' && "animated-dabe"}`}
              width="36px" height="40px" />;
          }
          return null;
        })}
        {range(0, 5 - activeClaimHistory.length).map((i) => {
          return <Icon key={i} iconSrc="assets/images/gas-tap/empty-dabe.svg" width="36px" height="auto" />;
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
