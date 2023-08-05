import Icon from 'components/basic/Icon/Icon';
import Footer from 'components/common/Footer/footer';

const About = () => {
	return (
		<>
			<div className={'content-wrapper'}>
				<div className={' m-auto flex flex-col justify-center items-center w-full'}>
					<section
						className={
							'uni-card w-full flex flex-col gap-4 after:rounded-2xl after:bg-what-is-unitap-header h-44 text-white justify-center text-center sm:text-left sm:px-12 overflow-hidden'
						}
					>
						<img src={'/assets/images/about/header-unitap-logo.svg'} className={'w-48 mx-auto sm:mx-0'} alt={'logo'} />
						<h4 className={'text-gradient-primary'}>
							Unitap is an onboarding tool for networks and communities and a gateway to web3
						</h4>
					</section>
					{/* to do: after merge should fix the .card class styles */}

					<div className="about-content uni-card mt-8 pl-4 pr-8 md:px-8 lg:px-12 pt-12 pb-8">
						<p className="text-gradient-primary text-center font-semibold mb-6">
							ONBOARDING USERS TO WEB3 HAS ALWAYS BEEN A CHALLENGE
						</p>
						<p className="about-section__text">
							When a user wants to begin using a network, they may find it hard to obtain gas tokens to get started.
							Faucets are abused because there has never been an appropriate sybil resistance tool.
						</p>
						<p className="about-section__text">
							With BrightID, we can solve this problem. BrightID is a social identity network that allows users to prove
							that they are only using one account.
						</p>
						<p className="text-gradient-primary text-center font-semibold mb-6">
							Unitap is designed to include a number of Taps
						</p>

						<div className="about-section">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/gas-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Gas Tap</p>
							</div>
							<p className="about-section__text">
								Gas Tap is a place where users can receive small amounts of gas tokens from numerous networks in order
								to get a new address started. Gas Tap already supports loads of EVM networks and will soon be adding
								support for Bitcoin Lightning, Solana, and others.
							</p>
						</div>

						<div className="about-section">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/token-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Token Tap</p>
							</div>
							<p className="about-section__text">
								Token Tap can facilitate the distribution of any kind of token, including; UBI tokens, NFTs, Community
								Tokens, Airdrops, etc. It uses BrightID to keep the bots out. Uses:
								<br />
								1. Help users interact with DAOs, apps, and services by distributing small amounts of the tokens used in
								those ecosystems.
								<br />
								2. Help projects in the test phase distribute their token to users. They can also set some bug bounties
								to incentivize users.
								<br />
								3. Distribute several UBI tokens in one place.
								<br />
								4. Prioritize real users over airdrop hunters by limiting the number of tokens one person can claim.
							</p>
						</div>

						<div className="about-section">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/learn-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Learn Tap</p>
							</div>
							<p className="about-section__text">
								Beginning users cannot effectively onboard to web3 via the current learn-to-earn platforms because they
								don’t teach users how to take the very first steps. We believe that almost all of the current
								learn-to-earn platforms’ users are already onboarded to web3 and largely complete tasks to be eligible
								for airdrops.
							</p>

							<p className="about-section__text">
								Learn Tap can utilize Gas tap and Token Tap to help onboard new users to Web3 all in one place with
								absolutely no cost to the user.
							</p>

							<p className="about-section__text">
								Users learn how to set up a wallet first, then how to add a network, and then they can claim their first
								gas tokens from the Gas Tap. After that, users can claim tokens from Token Tap to learn how to work with
								Web3 projects like swapping, providing liquidity, staking, voting, etc. In many cases, a brand new human
								user can go from zero to being an on-chain crypto user all in one place with no cost to the user.
							</p>
						</div>

						<div className="about-section" id="prize-tap">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/launch-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Launch Tap</p>
							</div>
							<p className="about-section__text">
								Token and NFT launchpads can be sybil attacked. KYC platforms keep out legitimate users and fail to keep
								out attackers. Unitap will offer a public goods launchpad called Launch Tap. In Launch Tap, creators
								have the option to gate the sale with BrightID. Also, instead of paying a large fee to launch pad
								platforms, in Launch Tap, every unique human will benefit from each launch through Prize Tap.
							</p>
						</div>

						<div className="about-section">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/prize-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Prize Tap</p>
							</div>
							<p className="about-section__text">
								Unitap offers the ability for users to access raffles for valuable items. Instead of each user receiving
								a tiny amount of a token, they can instead join a raffle where, if selected, they could win a much
								larger prize. A main source of prizes will be Launch Tap: 1% of each launch will be distributed to
								verified unique humans via Prize Tap. This will provide buzz around the launch and give Unitap users a
								reason to keep coming back.
							</p>
						</div>

						<div className="about-section">
							<div className="about-section__heading">
								<Icon
									className="about-section__heading__icon"
									iconSrc="assets/images/about/stake-tap-icon.svg"
									width="24px"
									height="auto"
								/>
								<p className="about-section__heading__title">Stake Tap</p>
							</div>
							<p className="about-section__text">
								Proof-of-Stake blockchains use staking as the security mechanism to keep nodes honest. Users can earn
								rewards by staking their native tokens.
								<br />
								Stake Tap is a public good staking platform where users can earn rewards by staking their assets. If the
								token staked is a gas token, we will send the fees to the Gas Tap contracts to help ensure that the gas
								taps stay full.{' '}
							</p>
						</div>
					</div>
					{/* <section id={'timeline'} className={'mt-16 text-center'}>
						<header className={'text-gradient-primary text-3xl inline-block mb-10'}>Unitap Roadmap</header>
						<img src={'/assets/images/about/roadmap.svg'} />
					</section> */}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default About;
