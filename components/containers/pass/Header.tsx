"use client";

import styled from "styled-components/";

const Spaceship = styled.img`
  position: absolute;
  right: 0;
  transform: translate(-5%, -34%);
`;

const Header = () => {
  return (
    <div className="header relative mb-4 flex h-[202px] w-full flex-col items-start justify-end gap-5 overflow-hidden rounded-2xl bg-gray20 bg-[url('/assets/images/pass/bg-header.svg')] pb-5 pl-6">
      {/* <div className="header-top z-10 flex items-center h-auto">
        <img
          className="gas-tap h-[48px] w-auto sm:w-auto"
          src="assets/images/nft/mint-header.png"
        />
      </div> */}

      <img
        className="gas-tap h-[48px] w-auto sm:w-auto"
        src="assets/images/pass/unitap-pass.svg"
      />

      <p className="gradient-text z-10 text-white">
        Unitap Pass is a VIP pass for Unitap.
      </p>

      <Spaceship
        className="z-0"
        src="assets/images/nft/nft-header-spaceship.svg"
      />
    </div>
  );
};

export default Header;
