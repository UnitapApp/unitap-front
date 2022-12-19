import React, { useContext } from 'react';
import styled from 'styled-components/';
import Icon from 'components/basic/Icon/Icon';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BrightIdVerificationStatus } from 'types';

const Spaceship = styled.img`
  position: absolute;
  left: 0;
  transform: translate(-35%, -37%) scale(1);
`;

const Header = () => {
  const { userProfile } = useContext(UserProfileContext);

  return (
    <div className="header w-full h-[152px] bg-gray20 rounded-2xl flex justify-between overflow-hidden relative p-4 mb-6">
      <Spaceship className="z-0" src="assets/images/token-tap/header-spaceship.svg" />
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <span className="flex items-center mb-2">
          <Icon className="gas-tap h-12 w-auto mb-1 mr-3" iconSrc="assets/images/token-tap/token-tap-typo-logo.png" />
          <div className="beta border-2 rounded-lg bg-gray00 border-gray50 py-2 px-3">
            <p className="text-gradient-primary text-xs font-semibold">Beta</p>
          </div>
        </span>
        <p className="text-xs text-gray100 mb-2.5">
          Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI token.
        </p>
      </div>
      <div className="header-right h-[100%] flex flex-col justify-end">
        <div className="claim-stat z-10">
          <div className="claim-stat__not-claimed rounded-lg bg-gray30 flex p-3 pl-2">
            <p className="text-gradient-primary text-xs mr-3"> The Final version will be Launched on March 2023. </p>
            <p className="text-gray100 text-xs font-semibold underline cursor-pointer">Read More</p>
          </div>
        </div>
        <div className="spaceman absolute top-2 right-20">
          <Icon className="z-0" iconSrc={'assets/images/token-tap/header-spaceman.svg'} width="100px" height="auto" />
        </div>
      </div>
    </div>
  );
};

export default Header;
