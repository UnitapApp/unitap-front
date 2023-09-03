import { FC, Suspense, lazy, useContext, useEffect, useMemo, useState } from 'react';
import Widget from './components/widget';
import RoutePath from 'routes';
import { Link, useNavigate } from 'react-router-dom';
import { useUnitapBatchSale } from 'hooks/pass/useUnitapBatchSale';
import { getTotalTestNetworks } from 'utils';
import { getTotalNetworks } from '../../utils';
import { UserProfileContext } from 'hooks/useUserProfile';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton } from 'components/basic/Button/button';
import TapLoading from './components/loading';
import GasTapLandingLazy from './components/gas-tap';
import TokenTapLandingLazy from './components/token-tap';
import { countGasClaimedAPI, countUsersAPI } from 'api';
import { Chain } from 'types';

export const socialLinks = [
	{
		img: 'twitter-icon.svg',
		localClass: 'hover:bg-light-space-green sm:rounded-l-2xl',
		link: 'http://twitter.com/unitap_app',
	},
	{
		img: 'github-icon.svg',
		localClass: 'hover:bg-blue-200',
		link: 'https://github.com/UnitapApp',
	},
	{
		img: 'discord-icon.svg',
		localClass: 'hover:bg-purple-200',
		link: 'https://discord.gg/unitap',
	},
];

export const futureTaps = [
	{
		name: 'Learn Tap',
		icon: 'learntap-icon.png',
		description: 'Where users can learn to use web3 technologies',
		class: 'after:bg-learntap-texture after:inset-0',
		iconSize: 'w-6',
	},
	{
		name: 'Stake Tap',
		icon: 'staketap-icon.png',
		description: 'Stake, Earn and simultaneously Donate to public good',
		class: 'after:bg-staketap-texture after:inset-auto after:!right-0 after:!bottom-0 after:w-28 after:h-20',
		iconSize: 'w-7 h-8',
	},
	{
		name: 'Launch Tap',
		icon: 'launchtap-icon.png',
		description: 'A public good launch pad where every unique human will benefit from each launch through Prize Tap',
		class: 'after:bg-launchtap-texture after:right-0 after:w-28',
		iconSize: 'w-6',
	},
];

const TokenTapLandingComponent = lazy(TokenTapLandingLazy);

const GasTapLandingComponent = lazy(GasTapLandingLazy);

const Landing: FC = () => {
	const { batchSoldCount, batchSize } = useUnitapBatchSale();

	const maxCount = useMemo(() => batchSize || 0, [batchSize]);
	const remainingCount = useMemo(() => (maxCount ? maxCount - (batchSoldCount || 0) : 0), [maxCount, batchSoldCount]);

	const { isGasTapAvailable } = useContext(UserProfileContext);

	const [stats, setStats] = useState([
		{ name: 'Main Networks', number: 0 },
		{ name: 'Test Networks', number: 0 },
	]);

	const [usersCount, setUsersCount] = useState('+4000');
	const [gasClaimedCount, setGasClaimedCount] = useState(0);

	const setChainClaims = (chainList: Chain[]) => {
		setStats(() => [
			{ name: 'Main Networks', number: getTotalNetworks(chainList) },
			{ name: 'Test Networks', number: getTotalTestNetworks(chainList) },
		]);
	};

	useEffect(() => {
		countUsersAPI().then((res) => setUsersCount(res.toString()));
		countGasClaimedAPI().then((res) => setGasClaimedCount(res));
	}, []);

	const deadline = useMemo(() => new Date('January 12, 2023 16:00:00 UTC'), []);

	const navigate = useNavigate();

	return (
		<>
			<main className={'flex flex-col gap-6 content-wrapper'}>
				<section
					id="home-header"
					className={
						'uni-card flex flex-col gap-4 after:rounded-2xl after:bg-home-header-texture h-40 text-white justify-center text-center sm:text-left sm:px-12 overflow-hidden'
					}
				>
					<img
						src={'/assets/images/landing/uni-logo.svg'}
						className={'w-40 mx-auto sm:mx-0'}
						width={157}
						height={32}
						alt={'logo'}
					/>
					<h4 className={'text-gradient-primary'}>
						Unitap is an onboarding tool for networks and communities and a gateway to web3
					</h4>
				</section>

				<section
					id="home-nft"
					className={
						'items-center px-12 text-center sm:text-left md:flex-row flex-col gap-4 md:gap-0 uni-card py-3 ' +
						'after:inset-auto after:left-0 after:-top-10 after:w-36 after:h-32 flex justify-between ' +
						'after:rounded-2xl after:bg-nft-texture text-white hover:bg-gray00 cursor-pointer hover:after:top-2'
					}
					onClick={() => navigate(RoutePath.NFT)}
				>
					<div className={'flex gap-4 flex-col items-start card-text justify-center'}>
						<div className="flex items-center">
							<h3 className={'font-bold text-2xl text-white'}>Mint Unitap Pass NFT</h3>
							<Icon iconSrc="/assets/images/landing/unitap-pass.svg" className="ml-4" />
						</div>
						{maxCount > 0 ? (
							<p className={'text-gray100'}>
								{deadline < new Date() && (
									<>
										<span className={'text-white'}>{remainingCount}</span> of{' '}
										<span className={'text-white'}>{maxCount}</span> Passes are left in the current batch. Mint your
										Passes now
									</>
								)}
							</p>
						) : (
							<div className="h-6 w-full"></div>
						)}
					</div>
					<div>
						<ClaimButton className="before:!inset-[1px]">
							<p>Go to Mint Page</p>
							<Icon className="ml-5" iconSrc="/assets/images/landing/arrow-right.svg" />
						</ClaimButton>
					</div>
				</section>

				<section id="home-taps" className={'flex lg:flex-row min-h-[360px] flex-grow flex-col gap-4 justify-between'}>
					<Link className={`flex--1 ${isGasTapAvailable ? '' : 'pointer-events-none'}`} to={RoutePath.FAUCET}>
						<Widget
							description={'Enjoy surfing Web3 without the worry of gas fees'}
							icon={'gastap-icon.svg'}
							iconSize={'w-7'}
							className={'after:bg-gastap-texture hover:bg-gray00 cursor-pointer h-full'}
							title={'Gas Tap'}
							buttonTitle={'Go to Tap'}
							buttonClass={'gradient-outline-button before:inset-[2px] text-gray100'}
						>
							<Suspense fallback={<TapLoading isGasTap />}>
								<GasTapLandingComponent setChainClaims={setChainClaims} />
							</Suspense>
						</Widget>
					</Link>

					<section className={'flex--1'}>
						<Link className={'flex--1'} to={RoutePath.TOKEN}>
							<Widget
								description={'Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens'}
								icon={'tokentap-icon.svg'}
								iconSize={'w-8'}
								className={'h-full after:bg-tokentap-texture hover:bg-gray00 cursor-pointer flex-1 '}
								title={'Token Tap'}
								buttonTitle={'Beta'}
								buttonClass={'green-text-button text-gray100'}
							>
								<Suspense fallback={<TapLoading />}>
									<TokenTapLandingComponent />
								</Suspense>
							</Widget>
						</Link>
					</section>

					{/* <section className={'flex--1'}>
						<Widget
							description={'Give it a shot and try your chance at winning valuable prizes'}
							className={'after:bg-prizetap-texture h-full after:w-full after:-top-4'}
							icon={'prizetap-icon.png'}
							iconSize={'w-8 h-7'}
							title={'Prize Tap'}
							buttonTitle={'Soon...'}
							buttonClass={'secondary-button !bg-gray30 text-gradient-primary'}
						></Widget>
					</section> */}

					<section className={'flex--1'}>
						<Link className={'flex--1'} to={RoutePath.PRIZE}>
							<Widget
								description={'Where everyone has chances to win larger prizes'}
								className={'after:bg-prizetap-texture h-full after:w-full after:-top-8 hover:bg-gray00'}
								icon={'prizetap-icon.png'}
								iconSize={'w-8 h-7'}
								title={'Prize Tap'}
								buttonTitle={'Go to Tap'}
								buttonClass={'gradient-outline-button text-gray100'}
							></Widget>
						</Link>
					</section>
				</section>

				<section id={'home-future-taps'} className={'flex gap-4 justify-between md:flex-row flex-col'}>
					{futureTaps.map((tap) => (
						<Widget
							icon={tap.icon}
							iconSize={tap.iconSize}
							key={tap.name}
							description={tap.description}
							className={`${tap.class} flex-1 pb-12`}
							title={tap.name}
							unClickable
							buttonTitle={'Soon...'}
							buttonClass={'secondary-button !bg-gray30 text-gradient-primary'}
						></Widget>
					))}
				</section>

				<section id="home-stats" className={'flex gap-4 justify-between'}>
					<Widget
						className={
							'flex-1 !pb-7 !pt-5 px-20 after:bg-stats-texture after:inset-auto after:left-0 after:top-0 after:w-36 after:h-28'
						}
						title={'Unitap Stats'}
						titleClass={'!justify-center'}
					>
						<div className={'flex justify-between mt-4 md:flex-row flex-col gap-4 md:gap-0'}>
							<div className="flex flex-col gap-2 items-center">
								<p className={'text-xl text-space-green font-semibold'}>{usersCount}</p>
								<p className={'text-gradient-primary text-xs font-medium'}> Unitap Users</p>
							</div>
							{stats.map((stat) => (
								<div key={stat.name} className={'flex flex-col gap-2 items-center'}>
									<p className={'text-xl text-space-green font-semibold'}>
										{/* {numberWithCommas(typeof stat.number == 'string' ? parseFloat(stat.number) : stat.number)} */}
										{stat.number}
									</p>
									<p className={'text-gradient-primary text-xs font-medium'}>{stat.name}</p>
								</div>
							))}
							<div className="flex flex-col gap-2 items-center">
								<p className={'text-xl text-space-green font-semibold'}>{gasClaimedCount}</p>
								<p className={'text-gradient-primary text-xs font-medium'}> Gas Fees Claimed</p>
							</div>
						</div>
					</Widget>
				</section>
				<section id="home-footer" className={'flex gap-4 md:flex-row flex-col'}>
					<div
						className={
							'uni-card hover:bg-gray00 hover:after:top-3 cursor-pointer md:w-1/3 h-36 after:bg-donate-texture after:inset-auto ' +
							'after:right-0 after:top-0 after:w-28 after:h-36 flex justify-center items-center'
						}
						onClick={() => navigate(RoutePath.DONATE)}
					>
						<h2 className={'text-white card-text'}>Donate to Unitap</h2>
					</div>
					<div className={'md:w-2/3 md:h-36 uni-card after:inset-auto flex sm:flex-row flex-col gap-4 sm:gap-0'}>
						{socialLinks.map((social) => (
							<div
								onClick={() => window.open(social.link, '_blank')}
								key={social.link}
								className={`${social.localClass} flex home-footer-social-link justify-center items-center cursor-pointer px-8 border-b-3 md:border-b-0 md:border-r-3 py-6 sm:py-0 border-gray40 transition duration-300 ease-in-out`}
							>
								<img className={social.localClass} src={`/assets/images/landing/${social.img}`} />
							</div>
						))}

						<div
							onClick={() => navigate(RoutePath.ABOUT)}
							className={
								'uni-card hover:bg-gray00 hover:after:top-4 cursor-pointer after:bg-what-is-unitap after:left-auto after:!right-0 after:w-44 after:h-36' +
								' flex flex-grow justify-center items-center text-white py-6 sm:py-0 rounded-tl-none rounded-bl-none'
							}
						>
							<h2 className={'card-text'}>What is Unitap ?</h2>
						</div>
					</div>
				</section>
			</main>
		</>
	);
};

export default Landing;
