import { useContext, useEffect, useMemo, useRef } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton, LightOutlinedButtonNew, SecondaryGreenColorButton } from 'components/basic/Button/button';
import { BrightIdModalState, Chain, ClaimReceiptState } from 'types';
import { getChainClaimIcon, getTxUrl, shortenAddress } from 'utils';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance } from 'utils/numbers';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import lottie from 'lottie-web';
import animation from 'assets/animations/GasFee-delivery2.json';
import Modal from 'components/common/Modal/modal';
import useWalletActivation from '../../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import { UserProfileContext } from '../../../../hooks/useUserProfile';
import ClaimNotAvailable from '../ClaimNotRemaining';

// @ts-ignore
import ModelViewer from '@metamask/logo';
import { GlobalContext } from 'hooks/useGlobalContext';

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
	const { account } = useWeb3React();
	const walletConnected = !!account;

	const metamaskLogo = useRef<HTMLDivElement>(null);

	const { tryActivation } = useWalletActivation();
	const { claim, closeClaimModal, activeClaimReceipt } = useContext(ClaimContext);

	const { openBrightIdModal } = useContext(GlobalContext);

	const { claimLoading } = useContext(ClaimContext);

	const mounted = useRef(false);

	const { userProfile, remainingClaims } = useContext(UserProfileContext);

	useEffect(() => {
		if (activeClaimReceipt?.status === ClaimReceiptState.PENDING) {
			const animationElement = document.querySelector('#animation');
			if (animationElement) {
				animationElement.innerHTML = '';
			}
			lottie.loadAnimation({
				container: document.querySelector('#animation') as HTMLInputElement,
				animationData: animation,
				loop: true,
				autoplay: true,
			});
		}
	}, [activeClaimReceipt?.status]);

	useEffect(() => {
		mounted.current = true; // Will set it to true on mount ...
		return () => {
			mounted.current = false;
		}; // ... and to false on unmount
	}, []);

	useEffect(() => {
		if (!metamaskLogo.current) return;

		const viewer = ModelViewer({
			pxNotRatio: true,
			width: 200,
			height: 200,
			followMouse: true,
			slowDrift: false,
		});

		metamaskLogo.current.innerHTML = '';

		metamaskLogo.current.appendChild(viewer.container);

		return () => {
			viewer.stopAnimation();
		};
	}, [metamaskLogo]);

	function renderWalletNotConnectedBody() {
		return (
			<>
				<DropIconWrapper className="text-center flex items-center" data-testid={`chain-claim-wallet-not-connected`}>
					<div className="flex items-center justify-center" ref={metamaskLogo}></div>
				</DropIconWrapper>

				<p className="text-gray100 font-semibold text-left text-sm mb-2 mt-5 w-full">Don’t have a metamask wallet?</p>

				<p className="text-gray90 text-sm mb-5">
					Go to{' '}
					<a href="https://metamask.io" rel="noreferrer" className="text-orange" target="_blank">
						Metamask.io
					</a>{' '}
					and create your first wallet and come back to start with web3
				</p>

				<ClaimButton
					onClick={tryActivation}
					width="100%"
					fontSize="16px"
					className="!w-full"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					<p>Connect Wallet</p>
				</ClaimButton>
			</>
		);
	}

	function renderBrightNotConnectedBody() {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-brightid-not-connected`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={getChainClaimIcon(chain)}
						alt=""
					/>
				</DropIconWrapper>
				<p className="text-white text-sm mb-5 mt-11">You need to connect your BrightID to claim your tokens</p>

				<ClaimButton
					onClick={openBrightIdModal}
					width="100%"
					className="!w-full"
					fontSize="16px"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					<p>Connect BrightID</p>
				</ClaimButton>
			</>
		);
	}

	function renderBrightNotVerifiedBody() {
		return (
			<>
				<div
					className="bright-connection-modal flex flex-col items-center justify-center pt-2"
					data-testid="brightid-modal"
				>
					<Icon
						data-testid="brightid-logo"
						className="bright-logo !w-4/12 z-10 mb-5"
						iconSrc="assets/images/modal/bright-id-logo-checked.svg"
					/>
					<p className="text-sm font-bold text-error mb-2">You are not verified on BrightID</p>
					<p className="text-xs font-medium text-gray100 mb-12 text-center px-4 leading-6">
						BrightID is a social identity network that allows users to prove that they are only using one account.
					</p>

					<span className="w-full relative">
						<LightOutlinedButtonNew
							className="!w-full"
							onClick={() => window.open('https://meet.brightid.org/', '_blank')}
						>
							Verify on BrightID{' '}
							<Icon className="cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2" iconSrc="assets/images/arrow-icon.svg" />
						</LightOutlinedButtonNew>
						<Icon
							iconSrc="assets/images/modal/bright-id-check.svg"
							className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"
						/>
					</span>

					{/* eslint-disable-next-line no-restricted-globals */}
					<p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>
						If you verified your BrightID click here.
					</p>
				</div>
			</>
		);
	}

	const { activeChain } = useContext(ClaimContext);

	function renderInitialBody() {
		if (!activeChain) {
			return null;
		}
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-initial-${chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={getChainClaimIcon(chain)}
						alt=""
					/>
				</DropIconWrapper>
				<Text width="100%" fontSize="14">
					Wallet Address
				</Text>
				<WalletAddress fontSize="12">{walletConnected ? shortenAddress(account) : ''}</WalletAddress>
				<ClaimButton
					onClick={() => claim(chain.pk)}
					width="100%"
					fontSize="16px"
					className="!w-full"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					{claimLoading ? (
						<p>Claiming...</p>
					) : (
						<p>{`Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${activeChain.symbol}`}</p>
					)}
				</ClaimButton>
			</>
		);
	}

	function renderPendingBody() {
		return (
			<>
				<div data-testid={`chain-claim-pending-${chain.pk}`} id="animation" style={{ width: '200px' }}></div>
				<Text width="100%" fontSize="14" color="space_green" textAlign="center">
					Claim transaction submitted
				</Text>
				<Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
					The claim transaction will be compeleted soon
				</Text>
				<SecondaryGreenColorButton
					onClick={closeClaimModal}
					width={'100%'}
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					Close
				</SecondaryGreenColorButton>
			</>
		);
	}

	function renderSuccessBody() {
		const handleClick = () => {
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				`I've just claimed ${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol} on ${
					chain.chainName
				} from @Unitap_app 🔥\nClaim yours:`,
			)}&url=${encodeURIComponent('unitap.app/gas-tap?hc=' + encodeURIComponent(chain.chainName))}`;
			window.open(twitterUrl, '_blank');
		};

		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-success-${chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={getChainClaimIcon(chain)}
						alt=""
					/>
				</DropIconWrapper>
				<span className="flex justify-center items-center font-medium mb-3">
					<Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
						{formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
					</Text>
					<Icon iconSrc="assets/images/modal/successful-state-check.svg" width="22px" height="auto" className="ml-2" />
				</span>
				<Text width="100%" fontSize="14" color="second_gray_light" mb={1} textAlign="center">
					we successfully transferred {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} to your wallet
				</Text>

				<Text
					width="100%"
					fontSize="14"
					color="second_gray_light"
					className="underline cursor-pointer"
					mb={3}
					textAlign="center"
					onClick={() => window.open(getTxUrl(chain, activeClaimReceipt!.txHash!), '_blank')}
				>
					view on explorer
				</Text>

				<div className="relative w-full">
					<button
						onClick={handleClick}
						className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
					>
						<p className="text-sm font-semibold text-twitter">Share on Twitter</p>
					</button>
					<Icon
						iconSrc="/assets/images/gas-tap/twitter-share.svg"
						className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
						width="auto"
						height="26px"
					/>
				</div>
			</>
		);
	}

	function renderFailedBody() {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-failed-${chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={getChainClaimIcon(chain)}
						alt=""
					/>
				</DropIconWrapper>
				<span className="flex justify-center items-center font-medium mb-3">
					<Text className="!mb-0" width="100%" fontSize="14" color="warningRed" textAlign="center">
						Claim Failed!
					</Text>
					<Icon iconSrc="assets/images/modal/failed-state-x.svg" width="22px" height="auto" className="ml-2" />
				</span>
				<Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
					An error occurred while processing your request
				</Text>
				<ClaimButton
					fontSize="16px"
					onClick={() => claim(chain.pk)}
					width={'100%'}
					className="!w-full"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					{claimLoading ? <p>Claiming...</p> : <p>Try Again</p>}
				</ClaimButton>
			</>
		);
	}

	const getClaimModalBody = () => {
		if (!userProfile) return renderBrightNotConnectedBody();

		if (!userProfile.isMeetVerified) return renderBrightNotVerifiedBody();

		if (!walletConnected) return renderWalletNotConnectedBody();

		if (!activeClaimReceipt) {
			if (remainingClaims && remainingClaims > 0) return renderInitialBody();

			return <ClaimNotAvailable />;
		}

		if (activeClaimReceipt.status === ClaimReceiptState.VERIFIED) return renderSuccessBody();

		if (activeClaimReceipt.status === ClaimReceiptState.PENDING) return renderPendingBody();

		if (activeClaimReceipt.status === ClaimReceiptState.REJECTED) return renderFailedBody();
	};

	return (
		<div
			className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
			data-testid={`chain-claim-modal-${chain.pk}`}
		>
			{getClaimModalBody()}
		</div>
	);
};

const ClaimModal = () => {
	const { closeClaimModal, activeChain } = useContext(ClaimContext);
	const { brightidModalStatus } = useContext(GlobalContext);

	const isOpen = useMemo(() => {
		return !!activeChain && brightidModalStatus === BrightIdModalState.CLOSED;
	}, [activeChain, brightidModalStatus]);

	if (!activeChain) return null;

	return (
		<>
			<Modal
				title={`Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${activeChain.symbol}`}
				size="small"
				closeModalHandler={closeClaimModal}
				isOpen={isOpen}
			>
				<ClaimModalBody chain={activeChain} />
			</Modal>
		</>
	);
};
export default ClaimModal;
