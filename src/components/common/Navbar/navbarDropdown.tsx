import Icon from 'components/basic/Icon/Icon';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from 'routes';

type NavbarDropdownProps = {
	className: string;
};

const NavbarDropdown = ({ className }: NavbarDropdownProps) => {
	const [navItems] = React.useState([
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
			link: RoutePath.TOKEN,
			icon: 'assets/images/navbar/navbar-dropdown-token-tap.svg',
			iconWidth: 'auto',
			iconHeight: '28px',
			route: RoutePath.TOKEN,
		},
		{
			name: 'Prize Tap',
			link: RoutePath.PRIZE,
			icon: '/assets/images/landing/prizetap-icon.png',
			iconWidth: '33px',
			iconHeight: 'auto',
			route: RoutePath.PRIZE,
		},
	]);

	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div
			className={`navbar-dropdown absolute z-10 top-14 right-8 cursor-default bg-gray20 rounded-lg border-2 px-3 pb-1 pt-2.5 border-gray00 ${
				className ? className : ''
			}`}
		>
			{navItems.map((item) => {
				return (
					<div
						key={item.name}
						onClick={() => (item.link ? navigate(item.link) : null)}
						className={`navbar-dropdown__item cursor-pointer border-gray40 transition-all duration-75 border-2 ${
							location.pathname === item.route
								? 'navbar-dropdown__item--active border-gray100'
								: item.link && 'hover:bg-gray20'
						} ${!item.link && 'cursor-default'}`}
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
				onClick={() => navigate(RoutePath.NFT)}
				className={`navbar-dropdown__item cursor-pointer gradient-outline-card-light flex items-center justify-between !h-auto bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 pl-4 pr-2 py-2.5 mt-12`}
			>
				<p className="navbar-dropdown__item__title text-sm font-semibold bg-primaryGradient text-transparent bg-clip-text">
					Unitap Pass NFT
				</p>
				<Icon iconSrc="assets/images/navbar/navbar-dropdown-mint.svg" width="auto" height="26px" />
			</div>
		</div>
	);
};

export default NavbarDropdown;
