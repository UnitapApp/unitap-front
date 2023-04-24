import React from 'react';
import styled from 'styled-components/';
import Icon from 'components/basic/Icon/Icon';

const Spaceship = styled.img`
  position: absolute;
  left: 0;
  transform: translate(-35%, -37%) scale(1);
`;

const Header = () => {
  const notClaimed = false; // I don't know what is this, just the most relative word that came to my mind after reading the code
  return (
    <div className="header w-full bg-gray20 rounded-2xl flex flex-col md:flex-row justify-between overflow-hidden relative p-4 mb-6">
      <Spaceship className="z-0" src="assets/images/token-tap/header-spaceship.svg" />
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <span className="flex items-center mb-2">
          <Icon className="gas-tap h-12 w-auto mb-1 mr-3" iconSrc="assets/images/token-tap/token-tap-typo-logo.svg" />
          {/* <div className="beta border-2 rounded-lg bg-gray00 border-gray50 py-2 px-3">
            <p className="text-gradient-primary text-xs font-semibold">Beta</p>
          </div> */}
        </span>
        <p className="text-xs text-gray100 mb-2.5">
          Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI token.
        </p>
      </div>
      <div className="header-right h-full flex flex-col justify-end">
        <div className="claim-stat z-10">
          {/* {userProfile?.totalWeeklyClaimsRemaining !== 2 ? ( */}
          {notClaimed ? (
            <div className="claim-stat__not-claimed rounded-lg bg-gray30 border-2 border-gray50">
              <p className="claim-stat__not-claimed__text px-6 py-4 text-white text-xs">
                You can claim <span className="claimed-left text-space-green">5</span> tokens in this round
              </p>
            </div>
          ) : (
            <div className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
              <Icon iconSrc="assets/images/token-tap/coin.svg" width="36px" height="auto" />
              <Icon iconSrc="assets/images/token-tap/coin.svg" width="36px" height="auto" />
              <Icon iconSrc="assets/images/token-tap/empty-coin.png" width="36px" height="auto" />
              <Icon iconSrc="assets/images/token-tap/empty-coin.png" width="36px" height="auto" />
              <Icon iconSrc="assets/images/token-tap/empty-coin.png" width="36px" height="auto" />
            </div>
          )}
        </div>
        <div className="spaceman absolute top-2 right-20">
          <Icon className="z-0" iconSrc={'assets/images/token-tap/header-spaceman.svg'} width="100px" height="auto" />
        </div>
      </div>
    </div>
  );
};

export default Header;
