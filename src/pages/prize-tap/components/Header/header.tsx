import Icon from 'components/basic/Icon/Icon';

const Header = () => {
	return (
		<div className="header w-full h-[152px] bg-gray20 rounded-2xl flex justify-between items-end overflow-hidden p-4 mb-4">
			<div className="header__left items-center h-auto">
				<img className="gas-tap h-auto w-40 mb-3" src="assets/images/prize-tap/header-typography.png" />
				<p className="z-10 text-sm text-gray100">Aura verification needed</p>
			</div>
			<div className="header__right">
				<div className="header__info cursor-pointer border-2 border-gray80 bg-gray60 flex px-3 py-2 justify-between items-center rounded-lg gap-x-5">
					<Icon iconSrc="assets/images/prize-tap/header-prize-logo.svg" width="36px" height="32px" />
					<p className="header__info__prize-count text-white font-semibold mr-1">3</p>
					<Icon iconSrc="assets/images/prize-tap/header-info-logo.svg" width="12px" height="12px" />
				</div>
			</div>
		</div>
	);
};

export default Header;
