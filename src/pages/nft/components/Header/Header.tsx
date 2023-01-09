import React from 'react';
import styled from 'styled-components/';

const Spaceship = styled.img`
  position: absolute;
  right: 0;
  transform: translate(12%, -37%);
`;

const Header = () => {
  return (
    <div className="header w-full h-[152px] bg-gray20 rounded-2xl flex flex-col justify-between items-start overflow-hidden relative p-6 mb-4">
      <div className="header-top z-10 flex items-center h-auto">
        <img className="gas-tap h-auto w-80 sm:w-100 mb-1 mr-4" src="assets/images/nft/mint-header.png" />
      </div>

      <p className="gradient-text z-10 text-2xl text-gradient-primary">Unitap Pass is a VIP pass for Unitap</p>

      <Spaceship className="z-0" src="assets/images/nft/nft-header-spaceship.svg" />
    </div>
  );
};

export default Header;
