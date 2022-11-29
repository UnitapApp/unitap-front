import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';
import Timer from '../Timer/timer';

// ###### Local Styled Components

const HeaderComp = styled.div`
  @media only screen and (max-width: 1200px) {
    height: calc(175px + (${DV.sizes.baseMargin * 6}px));
  }
`;

const Spaceship = styled.img`
  position: absolute;
  left: 0;
  transform: translate(-35%, -37%) scale(1);
`;

const Header = () => {
  return (
    <div className="header h-[152px] bg-gray20 rounded-2xl flex justify-between overflow-hidden relative p-4 mb-6">
      <Spaceship className="z-0" src="assets/images/gas-tap/header-spaceship.svg" />
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <Icon className="gas-tap h-12 w-[140px] mb-1" iconSrc="assets/images/gas-tap/gas-tap-text-logo.png" />
        <Timer />
      </div>
      <div className="header-right h-[100%] flex flex-col justify-end">
        <div className="claim-stat z-10">
          {false ? (
            <></>
          ) : (
            <div className="claim-stat__not-claimed rounded-xl bg-gray30 border-2 border-gray80">
              <p className="claim-stat__not-claimed__text px-5 py-4 text-white text-xs">
                You can claim <span className="claimed-left text-space-green">5</span> gas fees in this round
              </p>
            </div>
          )}
        </div>
        <div className='spaceman absolute bottom-2 right-0'>
          <Icon className='z-0' iconSrc={'assets/images/claim/header-spaceman.svg'} width="120px" height="auto" />
        </div>
      </div>
    </div>
  );
};

export default Header;
