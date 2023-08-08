import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton, LightOutlinedButtonNew, SecondaryGreenColorButton } from 'components/basic/Button/button';
import { Chain, ClaimReceiptState, Permission, PermissionType } from 'types';
import { shortenAddress } from 'utils';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import Modal from 'components/common/Modal/modal';
import useWalletActivation from 'hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import { UserProfileContext } from 'hooks/useUserProfile';
import { TokenTapContext } from 'hooks/token-tap/tokenTapContext';
import { switchChain } from 'utils/switchChain';
import { Link } from 'react-router-dom';
import ClaimLightningContent from './ClaimLightningContent';
import lottie from 'lottie-web';
import animation from 'assets/animations/GasFee-delivery2.json';

// @ts-ignore
import ModelViewer from '@metamask/logo';
import { GlobalContext } from 'hooks/useGlobalContext';

const ClaimTokenModalBody = ({ chain }: { chain: Chain }) => {
	const { account, chainId, connector } = useWeb3React();
	const walletConnected = !!account;
	const metamaskLogo = useRef<HTMLDivElement>(null);

	const { tryActivation } = useWalletActivation();
	const {
		selectedTokenForClaim,
		handleClaimToken,
		claimedTokensList,
		claimTokenLoading,
		closeClaimModal,
		claimTokenWithMetamaskResponse,
		claimTokenSignatureLoading,
	} = useContext(TokenTapContext);
	const { openBrightIdModal } = useContext(GlobalContext);

	const { userProfile } = useContext(UserProfileContext);

	const collectedToken = claimedTokensList.find((item) => item.tokenDistribution.id === selectedTokenForClaim!.id);

	useEffect(() => {
		if (claimTokenLoading) {
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
	}, [claimTokenLoading]);

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
				<DropIconWrapper data-testid={`chain-claim-wallet-not-connected`}>
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
						iconSrc={selectedTokenForClaim!.imageUrl}
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

	function renderVerifyPermission(permission: Permission) {
		function getPermissionTitle(permission: Permission) {
			if (permission.name === PermissionType.BRIGHTID) {
				return 'You are not verified on BrightID';
			} else if (permission.name === PermissionType.AURA) {
				return 'You are not verified on Aura';
			}

			return '';
		}

		function getPermissionButtonText(permission: Permission) {
			if (permission.name === PermissionType.BRIGHTID) {
				return 'Verified on BrightID';
			} else if (permission.name === PermissionType.AURA) {
				return 'Verified on Aura';
			}

			return '';
		}

		function getPermissionCheckButtonText(permission: Permission) {
			if (permission.name === PermissionType.BRIGHTID) {
				return 'If you verified your BrightID click here.';
			} else if (permission.name === PermissionType.AURA) {
				return 'If you verified your Aura click here.';
			}

			return '';
		}

		function verifyPermission() {
			if (permission.name === PermissionType.BRIGHTID) {
				window.open('https://meet.brightid.org/', '_blank');
			} else if (permission.name === PermissionType.AURA) {
				window.open('https://brightid.gitbook.io/aura/how-to-play/verification-levels', '_blank');
			}
		}

		return (
			<>
				<div
					className="bright-connection-modal flex flex-col items-center justify-center pt-2"
					data-testid="brightid-modal"
				>
					<Icon
						data-testid="brightid-logo"
						className="bright-logo !w-4/12 z-10 mb-5"
						iconSrc={selectedTokenForClaim!.imageUrl}
					/>
					<p className="text-sm font-bold text-error mb-2">{getPermissionTitle(permission)}</p>
					<p className="text-xs font-medium text-gray100 mb-12 text-center px-4 leading-6">{permission.description}</p>

					<span className="w-full relative">
						<LightOutlinedButtonNew className="!w-full" onClick={() => verifyPermission()}>
							{getPermissionButtonText(permission)}
							<Icon className="cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2" iconSrc="assets/images/arrow-icon.svg" />
						</LightOutlinedButtonNew>
						<Icon
							iconSrc="assets/images/modal/bright-id-check.svg"
							className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"
						/>
					</span>

					{/* eslint-disable-next-line no-restricted-globals */}
					<p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>
						{getPermissionCheckButtonText(permission)}
					</p>
				</div>
			</>
		);
	}

	function renderWrongNetworkBody(chain: Chain) {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-wrong-network`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedTokenForClaim!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>
				<p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
					You need to switch to the <strong>{chain.chainName}</strong> network to claim your tokens
				</p>

				<ClaimButton
					onClick={() => switchChain(connector, chain)}
					width="100%"
					className="!w-full"
					fontSize="16px"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					<p>Switch Network</p>
				</ClaimButton>
			</>
		);
	}

	function renderInitialBody() {
		if (!selectedTokenForClaim) {
			return null;
		}

		const calculateClaimAmount = selectedTokenForClaim.amount / 10 ** selectedTokenForClaim.chain.decimals;

		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-initial-${selectedTokenForClaim!.chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedTokenForClaim!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>
				{claimTokenWithMetamaskResponse?.state === 'Retry' ? (
					<p className="text-white text-sm my-4 text-center px-3 mb-6">{claimTokenWithMetamaskResponse?.message}</p>
				) : (
					<div className="text-left text-white">
						<p className="text-lg mb-2 text-center leading-loose">Your claim is ready.</p>
						<p className="text-xs mb-2">If you have not already claimed your tokens, you can claim them now.</p>
						<p className="text-xs mb-2">
							You will need to sign a wallet transaction and pay a small gas fee to claim tokens.
						</p>
						<p className="text-xs mb-6">
							If you do not have sufficient gas, please visit{' '}
							<Link className="text-blue-500" to={'/gas-tap?hc=' + selectedTokenForClaim!.chain.chainName}>
								Gas Tap
							</Link>
							.
						</p>
					</div>
				)}

				<Text width="100%" fontSize="14">
					Wallet Address
				</Text>
				<WalletAddress fontSize="12">{walletConnected ? shortenAddress(account) : ''}</WalletAddress>

				<ClaimButton
					onClick={() => handleClaimToken()}
					width="100%"
					fontSize="16px"
					className="!w-full"
					data-testid={`token-claim-action-${selectedTokenForClaim!.chain.pk}`}
				>
					{claimTokenLoading ? (
						<p>Claiming...</p>
					) : claimTokenSignatureLoading ? (
						<p>Preparing...</p>
					) : claimTokenWithMetamaskResponse?.state === 'Retry' ? (
						<p>Retry</p>
					) : (
						<p>{`Claim ${calculateClaimAmount} ${selectedTokenForClaim.token}`}</p>
					)}
				</ClaimButton>
			</>
		);
	}

	function renderSuccessBody() {
		const calculateClaimAmount = selectedTokenForClaim!.amount / 10 ** selectedTokenForClaim!.chain.decimals;

		const handleClick = () => {
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				`I've just claimed ${calculateClaimAmount} ${selectedTokenForClaim?.token} from @Unitap_app 🔥\nClaim yours:`,
			)}&url=${encodeURIComponent('unitap.app/token-tap?hc=' + encodeURIComponent(selectedTokenForClaim!.token))}`;
			window.open(twitterUrl, '_blank');
		};

		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-finished-${chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedTokenForClaim!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>

				<span className="flex justify-center items-center font-medium mb-3">
					<Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
						{calculateClaimAmount} {selectedTokenForClaim?.token} Claimed
					</Text>
					<Icon iconSrc="assets/images/modal/successful-state-check.svg" width="22px" height="auto" className="ml-2" />
				</span>

				<Text
					width="100%"
					fontSize="14"
					color="second_gray_light"
					className="underline cursor-pointer"
					mb={3}
					textAlign="center"
					onClick={() =>
						window.open(
							selectedTokenForClaim!.chain.explorerUrl +
								'tx/' +
								(collectedToken?.txHash ?? claimTokenWithMetamaskResponse?.txHash),
						)
					}
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

	function renderMaxedOutBody() {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-finished-${chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedTokenForClaim!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>
				<Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
					{selectedTokenForClaim?.isMaxedOut
						? "Unfortunately, there are no more tokens to claim. Make sure you're following us on Twitter to be notified when more tokens are available."
						: "Unfortunately, you missed the deadline to claim your tokens. Make sure you're following us on Twitter to be notified when more tokens are available."}
				</Text>
				<ClaimButton
					onClick={closeClaimModal}
					width={'100%'}
					fontSize="16px"
					className="!w-full"
					data-testid={`chain-claim-action-${chain.pk}`}
					color="space_green"
				>
					<p>Close</p>
				</ClaimButton>
			</>
		);
	}

	function claimMaxedOutBody() {
		return (
			<div className="flex text-white flex-col items-center justify-center w-full pt-2">
				<div className="mt-20 claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
					{claimedTokensList
						.filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
						.map((claim, key) => {
							return (
								<Icon
									key={key}
									iconSrc={claim.tokenDistribution.imageUrl}
									className={`rounded-full ${claim.status === ClaimReceiptState.PENDING && 'animated-dabe'}`}
									width="36px"
									height="40px"
								/>
							);
						})}
				</div>
				<div className="mt-10 text-center text-gray100">{"You've"} reached your claim limit for now</div>

				<button
					onClick={closeClaimModal}
					className="w-full mt-10 py-3 border-2 text-gray100 font-normal bg-gray10 border-gray50 rounded-xl"
				>
					Close
				</button>
			</div>
		);
	}

	function renderPendingBody() {
		if (!selectedTokenForClaim) return null;

		return (
			<>
				<div data-testid={`chain-claim-pending-${chain.pk}`} id="animation" style={{ width: '200px' }}></div>
				<Text width="100%" fontSize="14" color="space_green" textAlign="center">
					Claim transaction submitted
				</Text>
				<Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
					The claim transaction will be completed soon
				</Text>
				<SecondaryGreenColorButton onClick={closeClaimModal} width={'100%'}>
					Close
				</SecondaryGreenColorButton>
			</>
		);
	}

	const getClaimTokenModalBody = () => {
		if (!selectedTokenForClaim) {
			closeClaimModal();
			return null;
		}

		if (selectedTokenForClaim.isExpired || selectedTokenForClaim.isMaxedOut) {
			return renderMaxedOutBody();
		}

		if (!userProfile) return renderBrightNotConnectedBody();

		selectedTokenForClaim?.permissions.forEach((permission) => {
			if (permission.name === PermissionType.BRIGHTID) {
				if (!userProfile.isMeetVerified) return renderVerifyPermission(permission);
			} else if (permission.name === PermissionType.AURA) {
				if (!userProfile.isAuraVerified) return renderVerifyPermission(permission);
			}
		});

		if (claimTokenWithMetamaskResponse?.state === 'Done' || collectedToken?.status === 'Verified')
			return renderSuccessBody();

		if (!walletConnected) return renderWalletNotConnectedBody();

		if (!chainId || chainId.toString() !== selectedTokenForClaim?.chain.chainId)
			return renderWrongNetworkBody(selectedTokenForClaim.chain);

		if (claimTokenLoading) return renderPendingBody();

		if (claimedTokensList.length >= 3 && !collectedToken) return claimMaxedOutBody();

		return renderInitialBody();
	};

	return (
		<div
			className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
			data-testid={`chain-claim-modal-${chain.pk}`}
		>
			{getClaimTokenModalBody()}
		</div>
	);
};

const ClaimTokenModal = () => {
	const { selectedTokenForClaim, setSelectedTokenForClaim } = useContext(TokenTapContext);

	const closeClaimTokenModal = useCallback(() => {
		setSelectedTokenForClaim(null);
	}, [setSelectedTokenForClaim]);

	const isOpen = useMemo(() => {
		return !!selectedTokenForClaim;
	}, [selectedTokenForClaim]);

	if (!selectedTokenForClaim) return null;

	const tokenAmount =
		selectedTokenForClaim.chain.chainName === 'Lightning'
			? selectedTokenForClaim.amount
			: selectedTokenForClaim.amount / 10 ** selectedTokenForClaim.chain.decimals;
	return (
		<Modal
			title={`Claim ${tokenAmount} ${selectedTokenForClaim.token}`}
			size="small"
			closeModalHandler={closeClaimTokenModal}
			isOpen={isOpen}
		>
			{selectedTokenForClaim.chain.chainName === 'Lightning' ? (
				<ClaimLightningContent chain={selectedTokenForClaim.chain} />
			) : (
				<ClaimTokenModalBody chain={selectedTokenForClaim.chain} />
			)}
		</Modal>
	);
};
export default ClaimTokenModal;
