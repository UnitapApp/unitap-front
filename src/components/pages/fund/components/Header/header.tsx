import React from 'react';
import Icon from 'components/basic/Icon/Icon';
import { HeaderWrapper } from 'components/pages/fund/components/Header/header.style';

const Header = () => {
  return (
    <>
      <HeaderWrapper>
        <Icon iconSrc={'assets/images/fund/header-spaceman.png'} width="320px" height="auto" />
        <Icon iconSrc={'assets/images/fund/header-gas-fund-fee-text.png'} width="320px" height="auto" />
      </HeaderWrapper>
    </>
  );
};

export default Header;
