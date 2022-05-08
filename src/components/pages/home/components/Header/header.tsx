import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { Input } from 'components/basic/Input/input';
import Icon from 'components/basic/Icon/Icon';

// ###### Local Styled Components

const HeaderComp = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  height: 300px;
  background-size: cover;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    position: relative;
    top: 24px;
    font-weight: bold;
    font-size: 24px;
    color: white;
  }
`

const Spaceman = styled.div`
  position: absolute;
  right: 96px;
  bottom: -16px;
`


const GemRight = styled.div`
  position: absolute;
  right: 96px;
  top: 96px;
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled(FlexWrapper)`
  position: relative;
  bottom: ${DV.sizes.baseMargin * 2}px;
`;

const Header = () => {
  return (
    <>
      <HeaderComp>
        <GemRight><Icon iconSrc={'headerBg/gem-1.png'}  /></GemRight>
        <Spaceman><Icon iconSrc={'spman-header.png'} width="320px" height="auto" /></Spaceman>
        <p>
          Add EVM networks easily and
          <br /> connect your BrightID to claim Gas Fee.
        </p>
      </HeaderComp>
      <InputWrapper>
        {' '}
        <Input width="360px" placeholder="Search Network / Currency"></Input>{' '}
      </InputWrapper>
    </>
  );
};

export default Header;
