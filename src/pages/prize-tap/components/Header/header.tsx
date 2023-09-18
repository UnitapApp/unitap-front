import Icon from 'components/basic/Icon/Icon';
import { UserProfileContext } from 'hooks/useUserProfile';
import { useContext } from 'react';

export const RemainingRaffleComponent = () => {
	const { weeklyPrizeTapClaimLimit } = useContext(UserProfileContext);

	return (
		<div className="header__info cursor-pointer border-2 border-gray80 bg-gray60 inline-flex px-3 py-2 justify-between items-center rounded-lg gap-x-5">
			<Icon iconSrc="assets/images/prize-tap/header-prize-logo.svg" width="36px" height="32px" />
			<p className="header__info__prize-count text-white font-semibold mr-1">{weeklyPrizeTapClaimLimit ?? 3}</p>
			<Icon iconSrc="assets/images/prize-tap/header-info-logo.svg" width="12px" height="12px" />
		</div>
	);
};

const Header = () => {
	return (
		<div className="header prize-tap-header-bg w-full h-[194px] bg-gray20 rounded-2xl flex justify-between items-end overflow-hidden p-4 mb-6 border-3 border-gray30">
			<div className="header__left items-center h-auto">
				<span className="header__left__type-logo items-center flex mb-3 gap-3">
					<img className="h-12 w-auto" src="assets/images/prize-tap/header-typography.png" />
					<div>
						<div className="bg-gray10 px-3 py-2 border font-bold border-gray50 text-white text-xs rounded-lg">
							<p className="text-gradient-primary">Beta</p>
						</div>
					</div>

					{/* <img className="h-12 w-auto" src="assets/images/prize-tap/header-logo.svg" /> */}
				</span>
			</div>
		</div>
	);
};

export default Header;
