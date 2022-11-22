import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';

// ###### Local Styled Components

const HeaderComp = styled.div`
  background-size: cover;
  height: 170px;
  background-size: cover;
  position: relative;
  overflow: hidden;
  background-color: ${DV.colors.gray20};
  border-radius: ${DV.sizes.basePadding * 2}px;

  @media only screen and (max-width: 1200px) {
    height: calc(175px + (${DV.sizes.baseMargin * 6}px));
  }
`;

const Spaceman = styled.div`
  position: absolute;
  bottom: -80px;
`;

const Spaceship = styled.img`
  position: absolute;
  left: 0;
  transform: translate(-30%, -32%) scale(1.1);
`;

const Header = () => {
  return (
    <HeaderComp>
      <Spaceship src='assets/images/gas-tap/header-spaceship.svg'/>
      <Icon iconSrc='assets/images/gas-tap/gas-tap-text-logo.png' width='140' height='50'/>
      <Spaceman>
        <Icon iconSrc={'assets/images/claim/header-spaceman.png'} width="180px" height="auto" />
      </Spaceman>
    </HeaderComp>
  );
};

export default Header;
