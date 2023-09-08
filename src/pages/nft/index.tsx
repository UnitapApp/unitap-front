import { useEffect, useMemo, useState } from 'react';

import Header from './components/Header/Header';
import Footer from 'components/common/Footer/footer';
import Collapse from './components/Collapse/Collapse';
import NFTTimer from './components/NFTTimer/nftTimer';
import MintNFTCard from './components/MintNFTCard/mintNftCard';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';

const NFT = () => {
	const [isPreLaunch, setIsPreLaunch] = useState(false);

	const [countClicked, setCountClicked] = useState(0);

	const deadline = useMemo(() => new Date('January 12, 2023 16:00:00 UTC'), []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (deadline.getTime() < Date.now()) {
				setIsPreLaunch(false);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [deadline]);

	const handleNFTClicked = () => {
		setCountClicked(countClicked + 1);
		if (countClicked > 10) {
			setIsPreLaunch(false);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setCountClicked(0);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countClicked]);

	return (
		<>
			<div className="content-wrapper">
				<div className="m-auto flex flex-col justify-center items-center w-full">
					<div className="flex wrap w-full">
						<Header />
					</div>
					<div className="flex flex-col-reverse md:flex-row wrap w-full gap-4 mb-4">
						<div className="card md:w-[55%] flex flex-col justify-between py-9 px-8">
							<span>
								{/* <div className="header-top z-10 flex items-center h-auto">
                  <Icon className="gas-tap mb-1 h-auto w-80" iconSrc="assets/images/nft/mint-header.png"/>
                </div>

                <p className="gradient-text z-10 text-2xl text-gradient-primary mb-10">A VIP pass for Unitap</p> */}
								<p className="title font-bold text-white text-sm mb-8">
									Show your support with this unique pass for early adopters.
								</p>
								<p className="subtitle font-semibold text-gradient-primary mb-1">More winning chances for Prize Tap</p>
								<p className="text text-sm leading-7 font-regular mb-5">
									The first announced benefit is for{' '}
									<Link className="in-text-link" to={RoutePath.ABOUT + '#prize-tap'}>
										Prize Tap
									</Link>{' '}
									<img className="h-4 w-auto !inline" src="assets/images/about/prize-tap-icon.svg" /> . Each Unitap Pass
									you hold will increase your chances of winning all future Prize Taps.
								</p>
								<p className="subtitle font-semibold text-gradient-primary mb-1">
									Benefits will grow and evolve with Unitap
								</p>
								<p className="text text-sm leading-7 font-regular mb-5">
									As Unitap adds taps and features, it will offer more benefits to Unitap Pass holders.
								</p>
							</span>
						</div>
						{isPreLaunch ? (
							<div onClick={handleNFTClicked} className="card md:w-5/12 p-2 select-none">
								<NFTTimer deadline={deadline} className="mb-14" />
								<img
									className={'w-52 mt-28 animate-rocket m-auto relative right-3'}
									src={'/assets/images/nft/rocketship.png'}
								/>
								<img className={'w-44 m-auto'} src={'/assets/images/nft/rocket-base.png'} />
							</div>
						) : (
							<div className="card md:w-[45%] p-0 overflow-hidden select-none">
								<MintNFTCard />
							</div>
						)}
					</div>
					<Collapse className="mb-4" title="Unitap Pass Sale" icon="assets/images/nft/nft-pass-sale-icon.svg" initState>
						<>
							<p className="collapse-text mb-8">
								10,000 Unitap Passes total will be sold starting at 0.1 Eth each using a small batch sale followed by a
								BrightID Aura gated sale.
							</p>
							<p className="collapse-title">Small batch sale</p>
							<p className="collapse-text mb-8">
								A maximum of 2,000 Unitap Passes will be sold in small batches, with a starting batch size of 100.
								Anyone can buy Passes up to the number left in the current batch. When a batch sells out, Unitap will
								decide whether to start a new batch or to transition to the Aura gated sale.
							</p>
							<p className="collapse-title">Aura gated sale</p>
							<p className="collapse-text">
								The remaining Unitap Passes will be sold gated by{' '}
								<span
									className="in-text-link"
									onClick={() => window.open('https://brightid.gitbook.io/aura/', '_blank')}
								>
									{' '}
									BrightID Aura verification
								</span>
								. Anyone with Aura verification can deposit Eth to automatically purchase one Unitap Pass per day while
								supplies last.
							</p>
						</>
					</Collapse>
					<Collapse className="mb-4" title="Questions" icon="assets/images/nft/nft-questions-icon.svg">
						<>
							<p className="collapse-title">Will Unitap Passes contribute to wealth disparity?</p>
							<p className="collapse-text mb-8">
								No. Unitap strives to provide immense value to every person for free. Even if Unitap Passes are worth
								much more than their purchase price, the value one person will get from holding multiple Passes will not
								exceed the immense value each person will receive from Unitap for free.
							</p>
							<p className="collapse-title">Where will the money go?</p>
							<p className="collapse-text">
								All money received from the sale of Unitap Passes will go to support Unitap and BrightID (a core
								component of Unitap). Unitap has chosen to use Bright DAO for its governance and will make proposals to
								receive $BRIGHT as needed to pay for its operations. Any money raised that exceeds the immediate needs
								of the Unitap team will be used to buy $BRIGHT tokens and deposit them in Bright DAO&apos;s community
								pool.
								<br /> <br />
								<span className="in-text-link" onClick={() => window.open('https://dao.brightid.org', '_blank')}>
									Bright DAO
								</span>{' '}
								is a large community{' '}
								<span className="in-text-link" onClick={() => window.open('https://gardens.1hive.org', '_blank')}>
									Gardens DAO
								</span>{' '}
								with over 1400 members.
							</p>
						</>
					</Collapse>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default NFT;
