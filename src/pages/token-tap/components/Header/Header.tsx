import React from 'react';
import Icon from 'components/basic/Icon/Icon';

const Header = () => {
  return (
    <div
      className="header token-tap__header h-[202px] w-full rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
      <div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
        <span className="flex items-center mb-2">
          <Icon className="gas-tap h-12 w-auto mb-1 mr-3" iconSrc="assets/images/token-tap/token-tap-typo-logo.svg"/>
        </span>
        <p className="text-xs text-gray100">
          Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI token.
        </p>
      </div>
    </div>
  );
};

export default Header;
