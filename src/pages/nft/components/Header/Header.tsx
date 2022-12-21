import React from 'react';
import styled from 'styled-components/';
import Icon from 'components/basic/Icon/Icon';

const Spaceship = styled.img`
  position: absolute;
  right: 0;
  transform: translate(12%, -37%);
`;

const Header = () => {
  return (
    <div className="header w-full h-[152px] bg-gray20 rounded-2xl flex flex-col justify-between items-start overflow-hidden relative p-6 mb-4">
      <div className="header-top z-10 flex items-center h-auto">
        <Icon className="gas-tap h-auto w-[305px] mb-1 mr-4" iconSrc="assets/images/nft/nft-typo-logo.png" />
        <Icon className="gas-tap h-auto w-12 mb-1" iconSrc="assets/images/nft/nft-badge.svg" />
      </div>
      <p className="gradient-text z-10 text-2xl text-gradient-primary">Unitap Pass is a VIP pass for Unitap.</p>
      <Spaceship className="z-0" src="assets/images/nft/nft-header-spaceship.svg" />
    </div>
  );
};

export default Header;
