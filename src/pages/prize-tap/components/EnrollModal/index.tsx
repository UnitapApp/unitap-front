import { useCallback, useContext, useMemo } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton } from 'components/basic/Button/button';
import { Chain } from 'types';
import { getTxUrl, shortenAddress } from 'utils';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import Modal from 'components/common/Modal/modal';
import useWalletActivation from '../../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import { UserProfileContext } from '../../../../hooks/useUserProfile';
import { switchChain } from '../../../../utils/switchChain';
import { PrizeTapContext } from 'hooks/prizeTap/prizeTapContext';
import { GlobalContext } from 'hooks/useGlobalContext';
import { RemainingRaffleComponent } from '../Header/header';
import usePermissionResolver from 'hooks/token-tap/usePermissionResolver';
import Tooltip from 'components/basic/Tooltip';

const EnrollModalBody = ({ chain }: { chain: Chain }) => {
	const { account, chainId, connector } = useWeb3React();
	const walletConnected = !!account;
	const isPermissionVerified = usePermissionResolver();

	const { tryActivation } = useWalletActivation();
	const {
		selectedRaffleForEnroll,
		method,
		handleClaimPrize,
		handleEnroll,
		claimOrEnrollLoading,
		closeEnrollModal,
		claimOrEnrollWithMetamaskResponse,
		claimOrEnrollSignatureLoading,
		setMethod,
	} = useContext(PrizeTapContext);

	const { openBrightIdModal } = useContext(GlobalContext);

	const { userProfile } = useContext(UserProfileContext);

	const tokenImgLink: string = selectedRaffleForEnroll!.isPrizeNft
		? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
				Number(selectedRaffleForEnroll!.tokenUri.split('/')[3]) + 1
		  }.png`
		: '';

	function renderWalletNotConnectedBody() {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-wallet-not-connected`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>

				<p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
					{method === 'Enroll' ? 'Connect your wallet to enroll in raffle' : ' Connect your wallet to claim your prize'}
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
						iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>

				<p className="text-white text-sm mb-5 mt-11">
					{method === 'Enroll'
						? 'You need to connect your BrightID to enroll in raffle'
						: ' You need to connect your BrightID to claim your prize'}
				</p>

				<ClaimButton
					onClick={() => {
						openBrightIdModal();
						closeEnrollModal();
					}}
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

	// function renderVerifyPermission(permission: Permission) {
	// 	function getPermissionTitle(permission: Permission) {
	// 		if (permission.name === PermissionType.BRIGHTID) {
	// 			return 'You are not verified on BrightID';
	// 		} else if (permission.name === PermissionType.AURA) {
	// 			return 'You are not verified on Aura';
	// 		}

	// 		return '';
	// 	}

	// 	function getPermissionButtonText(permission: Permission) {
	// 		if (permission.name === PermissionType.BRIGHTID) {
	// 			return 'Verified on BrightID';
	// 		} else if (permission.name === PermissionType.AURA) {
	// 			return 'Verified on Aura';
	// 		}

	// 		return '';
	// 	}

	// 	function getPermissionCheckButtonText(permission: Permission) {
	// 		if (permission.name === PermissionType.BRIGHTID) {
	// 			return 'If you verified your BrightID click here.';
	// 		} else if (permission.name === PermissionType.AURA) {
	// 			return 'If you verified your Aura click here.';
	// 		}

	// 		return '';
	// 	}

	// 	function verifyPermission() {
	// 		if (permission.name === PermissionType.BRIGHTID) {
	// 			window.open('https://meet.brightid.org/', '_blank');
	// 		} else if (permission.name === PermissionType.AURA) {
	// 			window.open('https://brightid.gitbook.io/aura/how-to-play/verification-levels', '_blank');
	// 		}
	// 	}

	// 	return (
	// 		<>
	// 			<div
	// 				className="bright-connection-modal flex flex-col items-center justify-center pt-2"
	// 				data-testid="brightid-modal"
	// 			>
	// 				<Icon
	// 					data-testid="brightid-logo"
	// 					className="bright-logo !w-4/12 z-10 mb-5"
	// 					iconSrc={selectedRaffleForEnroll!.imageUrl}
	// 				/>
	// 				<p className="text-sm font-bold text-error mb-2">{getPermissionTitle(permission)}</p>
	// 				<p className="text-xs font-medium text-gray100 mb-12 text-center px-4 leading-6">{permission.description}</p>

	// 				<span className="w-full relative">
	// 					<LightOutlinedButtonNew className="!w-full" onClick={() => verifyPermission()}>
	// 						{getPermissionButtonText(permission)}
	// 						<Icon className="cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2" iconSrc="assets/images/arrow-icon.svg" />
	// 					</LightOutlinedButtonNew>
	// 					<Icon
	// 						iconSrc="assets/images/modal/bright-id-check.svg"
	// 						className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"
	// 					/>
	// 				</span>

	// 				{/* eslint-disable-next-line no-restricted-globals */}
	// 				<p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>
	// 					{getPermissionCheckButtonText(permission)}
	// 				</p>
	// 			</div>
	// 		</>
	// 	);
	// }

	function renderWrongNetworkBody(chain: Chain) {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-wrong-network`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>
				<p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
					You need to switch to the <strong>{chain.chainName}</strong> network to Enroll in Raffle
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
		if (!selectedRaffleForEnroll) {
			return null;
		}

		if (method === 'Verify') {
			const permissionVerificationsList = selectedRaffleForEnroll.constraints
				.filter((permission) => permission.type === 'VER')
				.map((permission) => isPermissionVerified(permission));

			const needsVerification = permissionVerificationsList.filter((permission) => !permission);

			return (
				<div className="text-center pt-4">
					<div>
						<RemainingRaffleComponent />
					</div>
					<p className="text-sm text-gray100 leading-6 mt-10">
						by clicking on “Enroll”, one of your coupon will be utilized and cannot be returned .To enroll, please
						ensure that you meet the following requirements.
					</p>
					<div className="mt-5 text-xs">
						{selectedRaffleForEnroll.constraints.map((permission, key) => (
							<Tooltip
								className={
									'border-gray70 hover:bg-gray10 transition-colors border px-3 py-2 rounded-lg ' +
									(permissionVerificationsList[key] ? 'text-space-green' : 'text-[#D7AC5A]')
								}
								data-testid={`token-verification-${selectedRaffleForEnroll.id}-${permission.name}`}
								key={key}
								text={permission.description}
							>
								<div className="flex items-center gap-3">
									<img
										src={
											permissionVerificationsList[key]
												? '/assets/images/token-tap/check.svg'
												: '/assets/images/token-tap/not-verified.svg'
										}
									/>
									{permission.title}
								</div>
							</Tooltip>
						))}
					</div>

					<ClaimButton
						onClick={() => setMethod('Enroll')}
						width="100%"
						fontSize="16px"
						className="!w-full mt-10"
						disabled={!!needsVerification.length || selectedRaffleForEnroll.isExpired}
						data-testid={`chain-claim-action-${selectedRaffleForEnroll!.chain.pk}`}
					>
						{selectedRaffleForEnroll.isExpired ? <p>Expired</p> : <p>Enroll</p>}
					</ClaimButton>
				</div>
			);
		}

		if (method === 'Enroll') {
			return (
				<>
					<DropIconWrapper data-testid={`chain-claim-initial-${selectedRaffleForEnroll!.chain.pk}`}>
						<Icon
							className="chain-logo z-10 mt-14 mb-10"
							width="auto"
							height="110px"
							iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
							alt=""
						/>
					</DropIconWrapper>
					{claimOrEnrollSignatureLoading ? (
						<p className="text-white text-sm my-4 text-center px-3 mb-6">Preparing your Enroll signature...</p>
					) : claimOrEnrollWithMetamaskResponse?.state === 'Retry' ? (
						<p className="text-white text-sm my-4 text-center px-3 mb-6">
							{claimOrEnrollWithMetamaskResponse?.message}
						</p>
					) : (
						<div className="text-left text-white"></div>
					)}
					<Text width="100%" fontSize="14">
						Wallet Address
					</Text>
					<WalletAddress fontSize="12">{walletConnected ? shortenAddress(account) : ''}</WalletAddress>
					{!selectedRaffleForEnroll?.userEntry?.txHash ? (
						<ClaimButton
							onClick={() => handleEnroll()}
							width="100%"
							fontSize="16px"
							className="!w-full"
							data-testid={`chain-claim-action-${selectedRaffleForEnroll!.chain.pk}`}
						>
							{claimOrEnrollLoading ? (
								<p>Enrolling...</p>
							) : claimOrEnrollSignatureLoading ? (
								<p>Preparing...</p>
							) : claimOrEnrollWithMetamaskResponse?.state === 'Retry' ? (
								<p>Retry</p>
							) : (
								<p>Enroll</p>
							)}
						</ClaimButton>
					) : (
						<ClaimButton
							onClick={() => closeEnrollModal()}
							width="100%"
							fontSize="16px"
							className="!w-full"
							data-testid={`chain-claim-action-${selectedRaffleForEnroll!.chain.pk}`}
						>
							Enrolled
						</ClaimButton>
					)}
				</>
			);
		}

		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-initial-${selectedRaffleForEnroll!.chain.pk}`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>
				{claimOrEnrollSignatureLoading ? (
					<p className="text-white text-sm my-4 text-center px-3 mb-6">Preparing your Claim prize signature...</p>
				) : claimOrEnrollWithMetamaskResponse?.state === 'Retry' ? (
					<p className="text-white text-sm my-4 text-center px-3 mb-6">{claimOrEnrollWithMetamaskResponse?.message}</p>
				) : (
					<div className="text-left text-white"></div>
				)}
				<Text width="100%" fontSize="14">
					Wallet Address
				</Text>
				<WalletAddress fontSize="12">{walletConnected ? shortenAddress(account) : ''}</WalletAddress>
				<ClaimButton
					onClick={() => handleClaimPrize()}
					width="100%"
					fontSize="16px"
					className="!w-full"
					data-testid={`chain-claim-action-${selectedRaffleForEnroll!.chain.pk}`}
				>
					{claimOrEnrollLoading ? (
						<p>Claiming Prize...</p>
					) : claimOrEnrollSignatureLoading ? (
						<p>Preparing...</p>
					) : claimOrEnrollWithMetamaskResponse?.state === 'Retry' ? (
						<p>Retry</p>
					) : (
						<p>Claim Prize</p>
					)}
				</ClaimButton>
			</>
		);
	}

	function renderSuccessBody() {
		const calculateClaimAmount = selectedRaffleForEnroll!.prizeAmount / 10 ** selectedRaffleForEnroll!.decimals;

		const handleShareClaimTwitter = () => {
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				`I've just claimed from @Unitap_app 🔥\n Claim yours:`,
			)}&url=${encodeURIComponent('unitap.app/prize-tap?hc=' + selectedRaffleForEnroll?.name)}`;
			window.open(twitterUrl, '_blank');
		};

		const handleShareEnrollTwitter = () => {
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				`I've just Enroll in raffle from @Unitap_app 🔥\n Claim yours:`,
			)}&url=${encodeURIComponent('unitap.app/prize-tap?hc=' + selectedRaffleForEnroll?.name)}`;
			window.open(twitterUrl, '_blank');
		};

		return (
			<>
				{method === 'Claim' ? (
					<div>
						<div className="prize-success-stroke">
							{!selectedRaffleForEnroll!.isPrizeNft ? (
								<h1 data-heading={calculateClaimAmount + ' ' + selectedRaffleForEnroll!.prizeSymbol}>
									{calculateClaimAmount} {selectedRaffleForEnroll!.prizeSymbol}
								</h1>
							) : (
								<h1 data-heading={selectedRaffleForEnroll!.prizeName}> {selectedRaffleForEnroll!.prizeName} </h1>
							)}
						</div>

						<span className="flex justify-center items-center font-medium mb-3">
							{!selectedRaffleForEnroll!.isPrizeNft ? (
								<Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
									{calculateClaimAmount} {selectedRaffleForEnroll!.prizeSymbol} Claimed
								</Text>
							) : (
								<Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
									{selectedRaffleForEnroll!.prizeName} Claimed
								</Text>
							)}
							{/* <Icon iconSrc="assets/images/modal/successful-state-check.svg" width="22px" height="auto" className="ml-2" /> */}
						</span>

						<span className="flex justify-center items-center font-medium mb-3">
							<Text className="!mb-8" color="gray100" width="100%" fontSize="14" textAlign="center">
								Congratulations, @{selectedRaffleForEnroll?.winnerEntry?.userProfile?.username} on your grand prize win!
							</Text>
						</span>

						<Text
							width="100%"
							fontSize="14"
							color="second_gray_light"
							className="underline cursor-pointer"
							mb={3}
							textAlign="center"
							onClick={() => window.open(getTxUrl(chain, claimOrEnrollWithMetamaskResponse!.txHash!), '_blank')}
						>
							view on explorer
						</Text>
						<div className="relative w-full">
							<button
								onClick={handleShareClaimTwitter}
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
					</div>
				) : (
					<>
						<span className="flex justify-center items-center font-medium mb-3">
							<Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
								successfully enrolled in {selectedRaffleForEnroll?.name} raffle
							</Text>
							<Icon
								iconSrc="assets/images/modal/successful-state-check.svg"
								width="22px"
								height="auto"
								className="ml-2"
							/>
						</span>

						<Text
							width="100%"
							fontSize="14"
							color="second_gray_light"
							className="underline cursor-pointer"
							mb={3}
							textAlign="center"
							onClick={() => window.open(getTxUrl(chain, claimOrEnrollWithMetamaskResponse!.txHash!), '_blank')}
						>
							view on explorer
						</Text>

						<div className="relative w-full">
							<button
								onClick={handleShareEnrollTwitter}
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
				)}
			</>
		);
	}

	// function renderMaxedOutBody() {
	// 	return (
	// 		<>
	// 			<DropIconWrapper data-testid={`chain-claim-finished-${chain.pk}`}>
	// 				<Icon
	// 					className="chain-logo z-10 mt-14 mb-10"
	// 					width="auto"
	// 					height="110px"
	// 					iconSrc={selectedRaffleForEnroll!.imageUrl}
	// 					alt=""
	// 				/>
	// 			</DropIconWrapper>
	// 			<Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
	// 				{selectedRaffleForEnroll?.isExpired
	// 					? 'Unfortunately, The raffle has ended.'
	// 					: 'Unfortunately, The capacity to participate in the raffle has been completed.'}
	// 			</Text>
	// 			<ClaimButton
	// 				onClick={closeEnrollModal}
	// 				width={'100%'}
	// 				fontSize="16px"
	// 				className="!w-full"
	// 				data-testid={`chain-claim-action-${chain.pk}`}
	// 				color="space_green"
	// 			>
	// 				<p>Close</p>
	// 			</ClaimButton>
	// 		</>
	// 	);
	// }

	const getEnrollModalBody = () => {
		if (!selectedRaffleForEnroll) {
			closeEnrollModal();
			return null;
		}

		if (!userProfile) return renderBrightNotConnectedBody();

		if (!walletConnected) return renderWalletNotConnectedBody();

		if (claimOrEnrollWithMetamaskResponse?.state === 'Done') return renderSuccessBody();

		if (!chainId || chainId.toString() !== selectedRaffleForEnroll?.chain.chainId)
			return renderWrongNetworkBody(selectedRaffleForEnroll.chain);

		return renderInitialBody();
	};

	return (
		<div
			className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
			data-testid={`chain-claim-modal-${chain.pk}`}
		>
			{getEnrollModalBody()}
		</div>
	);
};

const EnrollModal = () => {
	const { selectedRaffleForEnroll, setSelectedRaffleForEnroll, method } = useContext(PrizeTapContext);

	const closeClaimTokenModal = useCallback(() => {
		setSelectedRaffleForEnroll(null);
	}, [setSelectedRaffleForEnroll]);

	const isOpen = useMemo(() => {
		return !!selectedRaffleForEnroll;
	}, [selectedRaffleForEnroll]);

	if (!selectedRaffleForEnroll) return null;

	return (
		<Modal
			title={`${method === 'Verify' ? 'Requirements' : selectedRaffleForEnroll.name}`}
			size="small"
			closeModalHandler={closeClaimTokenModal}
			isOpen={isOpen}
		>
			<EnrollModalBody chain={selectedRaffleForEnroll.chain} />
		</Modal>
	);
};
export default EnrollModal;
