import Icon from 'components/basic/Icon/Icon';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from 'routes';

type NavbarDropdownProps = {
  className: string;
  onMouseOver: () => void;
  onMouseLeave: () => void;
};

const NavbarDropdown = ({ className, onMouseOver, onMouseLeave }: NavbarDropdownProps) => {
  const [navItems, setNavItems] = React.useState([
    {
      name: 'Home',
      link: RoutePath.LANDING,
      icon: 'assets/images/navbar/navbar-dropdown-home.svg',
      iconWidth: 'auto',
      iconHeight: '28px',
      route: RoutePath.LANDING,
    },
    {
      name: 'Gas Tap',
      link: RoutePath.FAUCET,
      icon: 'assets/images/navbar/navbar-dropdown-gas-tap.svg',
      iconWidth: 'auto',
      iconHeight: '28px',
      route: RoutePath.FAUCET,
    },
    {
      name: 'Token Tap',
      link: null,
      icon: 'assets/images/navbar/navbar-dropdown-soon.svg',
      // icon: 'assets/images/navbar/navbar-dropdown-token-tap.svg',
      iconWidth: '33px',
      iconHeight: 'auto',
      route: RoutePath.TOKEN,
    },
    {
      name: 'Prize Tap',
      link: null,
      icon: 'assets/images/navbar/navbar-dropdown-soon.svg',
      iconWidth: '33px',
      iconHeight: 'auto',
      route: RoutePath.PRIZE,
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`navbar-dropdown absolute z-10 top-[70px] right-8 bg-gray20 rounded-lg border-2 px-3 pb-1 pt-2.5 border-gray00 ${
        className ? className : ''
      }`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {navItems.map((item) => {
        return (
          <div
            key={item.name}
            onClick={() => (item.link ? navigate(item.link) : null)}
            className={`navbar-dropdown__item ${location.pathname === item.route && 'navbar-dropdown__item--active'} ${
              !item.link && 'cursor-not-allowed'
            }`}
          >
            <p
              className={`navbar-dropdown__item__title ${
                location.pathname === item.route && 'navbar-dropdown__item--active__title'
              }`}
            >
              {item.name}
            </p>
            <Icon iconSrc={item.icon} width={item.iconWidth} height={item.iconHeight} />
          </div>
        );
      })}

      <div
        className={`navbar-dropdown__item w-52 flex items-center h-11 justify-between bg-gray00 rounded-lg border-2 border-gray00 px-4 mt-12`}
      >
        <p className="navbar-dropdown__item__title text-sm font-semibold bg-primaryGradient text-transparent bg-clip-text">
          Mint UGP NFT
        </p>
        <Icon iconSrc="assets/images/navbar/navbar-dropdown-mint.svg" width="auto" height="28px" />
      </div>
    </div>
  );
};

export default NavbarDropdown;
