import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';

// ###### Local Styled Components

const HeaderComp = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  background-size: cover;
  height: 170px;
  background-size: cover;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media only screen and (max-width: 1200px) {
    height: calc(175px + (${DV.sizes.baseMargin * 6}px));
  }
`;

const Drops = styled.span`
  position: relative;
  width: 100%;
  height: 100%;

  & > * {
    position: absolute;
    filter: blur(1px);
  }

  .first_drop {
    right: 7vw;
    top: 60%;
  }
  .second_drop {
    right: 40vw;
    top: 50%;
    transform: rotate(5deg);
  }
  .third_drop {
    left: 40vw;
    top: 47%;
    transform: rotate(-20deg);
  }
  .forth_drop {
    left: 5vw;
    top: 50%;
    transform: rotate(-25deg);
  }
`;

const Spaceman = styled.div`
  position: absolute;
  bottom: -90px;
  @media screen and (max-width: 920px) {
    display: none;
  }
`;

const Header = () => {
  return (
    <HeaderComp>
      <Spaceman>
        <Icon iconSrc={'assets/images/claim/spaceman-header.svg'} width="170px" height="auto" />
      </Spaceman>
      <Drops>
        <Icon iconSrc="assets/images/claim/drop.svg" width="19px" height="auto" className="first_drop"></Icon>
        <Icon iconSrc="assets/images/claim/drop.svg" width="20px" height="auto" className="second_drop"></Icon>
        <Icon iconSrc="assets/images/claim/drop.svg" width="23px" height="auto" className="third_drop"></Icon>
        <Icon iconSrc="assets/images/claim/drop.svg" width="18px" height="auto" className="forth_drop"></Icon>
      </Drops>
    </HeaderComp>
  );
};

export default Header;
