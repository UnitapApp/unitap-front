import Icon from 'components/basic/Icon/Icon';
import React from 'react';

const NavbarDropdown = () => {
  return (
    <div className="navbar-dropdown absolute z-10 top-16 right-8 bg-gray20 rounded-lg border-2 border-gray00 px-3 pt-[10px] pb-1">
      <div
        className={`navbar-dropdown__item--selected w-52 flex items-center h-11 justify-between bg-gray10 rounded-lg border-2 border-gray00 px-4 mb-2`}
      >
        <p className="navbar-dropdown__item--selected__title text-white text-sm font-semibold bg-primaryGradient text-transparent bg-clip-text">Home</p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-home.svg" width="auto" height="28px" />
      </div>
      <div
        className={`navbar-dropdown__item w-52 flex items-center h-11 justify-between bg-gray30 rounded-lg border-2 border-gray40 px-4 mb-2`}
      >
        <p className="navbar-dropdown__item__title text-white text-sm font-semibold">Gas Tap</p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-gas-tap.svg" width="auto" height="28px" />
      </div>
      <div
        className={`navbar-dropdown__item w-52 flex items-center h-11 justify-between bg-gray30 rounded-lg border-2 border-gray40 px-4 mb-2`}
      >
        <p className="navbar-dropdown__item__title text-white text-sm font-semibold">Token Tap</p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-token-tap.svg" width="auto" height="28px" />
      </div>
      <div
        className={`navbar-dropdown__item w-52 flex items-center h-11 justify-between bg-gray30 rounded-lg border-2 border-gray40 px-4 mb-12`}
      >
        <p className="navbar-dropdown__item__title text-white text-sm font-semibold">Prize Tap</p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-soon.svg" width="33px" height="auto" />
      </div>

      <div
        className={`navbar-dropdown__item w-52 flex items-center h-11 justify-between bg-gray00 rounded-lg border-2 border-gray00 px-4`}
      >
        <p className="navbar-dropdown__item__title text-white text-xs font-semibold">Donate Unitap</p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-donate.svg" width="auto" height="28px" />
      </div>
    </div>
  );
};

export default NavbarDropdown;
