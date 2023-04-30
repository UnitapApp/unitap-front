import React, { useContext } from 'react';
import Icon from 'components/basic/Icon/Icon';
import Timer from '../Timer/timer';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ClaimContext } from 'hooks/useChainList';
import { range } from 'utils';
import { ClaimReceiptState } from '../../../../types';
import Dabes from "../Dabes/Dabes";

const Header = () => {
  const { userProfile } = useContext(UserProfileContext);

  return (
    <div className="header gas-tap__header h-[202px] rounded-2xl flex flex-col  md:flex-row lg:items-end  md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
      <div className="header-left z-10 flex flex-col items-start">
        <Icon className="gas-tap h-12 w-[140px]" iconSrc="assets/images/gas-tap/gas-tap-text-logo.svg" />
      </div>
      <Timer />
      <div className="header-right  flex mt-2 justify-center md:justify-start">
        <div className="claim-stat z-10">{userProfile ? <Dabes /> : <RenderConnectBrightID />}</div>
      </div>
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
