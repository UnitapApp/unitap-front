import { useContext, useMemo, useState } from 'react';
import {
	BrightConnectedButton,
	BrightPrimaryButton,
	GradientOutlinedButton,
	LightOutlinedButton,
} from 'components/basic/Button/button';
import { UserProfileContext } from 'hooks/useUserProfile';
import { shortenAddress } from 'utils';
import { DesktopNav, MobileNav } from './navbar.style';
import { useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
import useWalletActivation from '../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import Icon from 'components/basic/Icon/Icon';
import NavbarDropdown from './navbarDropdown';
import { useUnitapPass } from '../../../hooks/pass/useUnitapPass';
import { GlobalContext } from 'hooks/useGlobalContext';

const Navbar = () => {
	const { tryActivation } = useWalletActivation();

	const { openBrightIdModal } = useContext(GlobalContext);
	const { account, chainId } = useWeb3React();
	const isUserConnected = !!account;
	const { userProfile } = useContext(UserProfileContext);

	const connectBrightButtonLabel = useMemo(() => {
		if (account) {
			if (userProfile) {
				return userProfile.isMeetVerified ? 'Connected' : 'Login with BrightID';
			}
			return 'Login with BrightID';
		}
		return 'Login with BrightID';
	}, [account, userProfile]);

	const navigate = useNavigate();

	return (
		<div className="navbar w-full sticky flex items-center top-0 z-100 bg-gray10 py-3 px-8">
			<Icon
				alt="unitap"
				className="navbar__logo cursor-pointer"
				iconSrc="assets/images/navbar/navbar_logo_v1.3.svg"
				width="auto"
				height="32px"
				mrAuto
				onClick={() => navigate(RoutePath.LANDING)}
			/>
			{process.env.REACT_APP_IS_CYPRESS === 'true' && <span data-testid="chain-id">{chainId}</span>}

			<DesktopNav>
				<RenderUnipassCount />
				<RenderNavbarConnectionStatus />
				<RenderNavbarDropdown />
			</DesktopNav>

			<MobileNav>
				<input className="checkbox" type="checkbox" name="" id="" />
				<div className="hamburger-lines">
					<span className="line line1"></span>
					<span className="line line2"></span>
					<span className="line line3"></span>
				</div>
				<div className="menu-items">
					{userProfile?.isMeetVerified ? (
						<BrightConnectedButton
							iconLeft="assets/images/navbar/navbar_bright_logo_v1.3.svg"
							fontSize="12px"
							fontWeight="500"
							iconLeftWidth={16}
							iconLeftHeight={16}
							mb={2}
						>
							{connectBrightButtonLabel}
						</BrightConnectedButton>
					) : (
						<BrightPrimaryButton
							mb={2}
							fontSize="12px"
							fontWeight="800"
							minWidth="150px"
							onClick={() => openBrightIdModal()}
						>
							{connectBrightButtonLabel}
						</BrightPrimaryButton>
					)}
					{isUserConnected ? (
						<LightOutlinedButton>{shortenAddress(account)}</LightOutlinedButton>
					) : (
						<GradientOutlinedButton onClick={tryActivation}>Connect Wallet</GradientOutlinedButton>
					)}
				</div>
			</MobileNav>
		</div>
	);
};

const RenderUnipassCount = () => {
	const { balance: unitapPassBalance } = useUnitapPass();
	const { account } = useWeb3React();

	return (
		<div className="up-count flex p-2 pr-3 mr-3 h-8 bg-gray40 items-center rounded-lg">
			{account ? (
				<>
					<Icon
						alt="unitap-pass"
						className="mr-5"
						iconSrc="assets/images/navbar/up-icon.svg"
						width="auto"
						height="23px"
					/>
					<p className="text-white text-xs font-bold">
						{unitapPassBalance?.toNumber() || 0} PASS
						{unitapPassBalance?.toNumber() ? (unitapPassBalance?.toNumber() > 1 ? 'ES' : '') : ''}
					</p>
				</>
			) : (
				<>
					<Icon
						className="mr-5"
						alt="unitap-pass-disabled"
						iconSrc="assets/images/navbar/up-icon-disable.svg"
						width="auto"
						height="23px"
					/>
					<p className="text-gray100 text-xs font-bold pl-2">-</p>
				</>
			)}
		</div>
	);
};

const RenderNavbarDropdown = () => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	return (
		<span className="navbar__dropdown cursor-pointer" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
			<Icon iconSrc="assets/images/navbar/navbar-dropdown-icon.svg" width="31px" height="31px" />
			{isDropdownVisible && <NavbarDropdown className="navbar__dropdown__component" />}
		</span>
	);
};

const RenderNavbarConnectionStatus = () => {
	const { account } = useWeb3React();
	const isWalletConnected = !!account;

	const { userProfile } = useContext(UserProfileContext);
	const isBrightIdConnected = !!userProfile;

	const EVMWallet = userProfile?.wallets.find((wallet) => wallet.walletType === 'EVM');

	return (
		<div className="navbar-connection-status flex rounded-lg h-8 items-center justify-between bg-gray40 pr-0.5 mr-3">
			<Icon
				iconSrc="./assets/images/navbar/bright-icon.svg"
				width="16px"
				height="16px"
				className={`mx-3 ${!isBrightIdConnected && 'opacity-50'}`}
			/>

			{!isBrightIdConnected ? (
				<RenderNavbarLoginBrightIdButton />
			) : !isWalletConnected ? (
				!EVMWallet ? (
					<RenderNavbarConnectWalletButton />
				) : (
					<RenderNavbarWalletAddress active={false} />
				)
			) : (
				<RenderNavbarWalletAddress active={true} />
			)}
		</div>
	);
};

const RenderNavbarLoginBrightIdButton = () => {
	const { openBrightIdModal } = useContext(GlobalContext);
	const { userProfileLoading } = useContext(UserProfileContext);

	return (
		<>
			<button
				className="btn btn--sm btn--bright !w-36 h-[28px] !py-0 align-baseline"
				data-testid="brightid-show-modal"
				onClick={() => !userProfileLoading && openBrightIdModal()}
			>
				{userProfileLoading ? 'Connecting...' : 'Connect BrightID'}
			</button>
		</>
	);
};

const RenderNavbarConnectWalletButton = () => {
	const { tryActivation } = useWalletActivation();

	return (
		<>
			<button
				data-testid="wallet-connect"
				className="btn btn--sm btn--primary !w-36 h-[28px] !py-0 align-baseline"
				onClick={tryActivation}
			>
				Connect Wallet
			</button>
		</>
	);
};

const RenderNavbarWalletAddress = ({ active }: { active: boolean }) => {
	const { tryActivation } = useWalletActivation();
	const { userProfile } = useContext(UserProfileContext);
	const EVMWallet = userProfile?.wallets.find((wallet) => wallet.walletType === 'EVM');
	const { account } = useWeb3React();

	let address = account ? account : EVMWallet?.address;

	if (!address) return null;

	return (
		<>
			<button
				data-testid="wallet-address"
				className={`btn btn--sm btn--address ${active && 'btn--address--active'} !w-36 h-[28px] !py-0 align-baseline`}
				onClick={tryActivation}
			>
				{shortenAddress(address)}
			</button>
		</>
	);
};

export default Navbar;
