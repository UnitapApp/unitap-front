import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton, LightOutlinedButtonNew } from 'components/basic/Button/button';
import { BrightIdModalState, Chain, Permission, PermissionType } from 'types';
import { getChainClaimIcon, shortenAddress } from 'utils';
import { ClaimContext } from 'hooks/useChainList';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import Modal from 'components/common/Modal/modal';
import useWalletActivation from '../../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import { UserProfileContext } from '../../../../hooks/useUserProfile';
import { TokenTapContext } from '../../../../hooks/token-tap/tokenTapContext';
import { switchChain } from '../../../../utils/switchChain';
import { Link } from 'react-router-dom';
import ClaimLightningContent from './ClaimLightningContent';

const ClaimTokenModalBody = ({ chain }: { chain: Chain }) => {
	const { account, chainId, connector } = useWeb3React();
	const walletConnected = !!account;

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
	const { openBrightIdModal } = useContext(ClaimContext);

	const mounted = useRef(false);

	const { userProfile } = useContext(UserProfileContext);

	useEffect(() => {
		mounted.current = true; // Will set it to true on mount ...
		return () => {
			mounted.current = false;
		}; // ... and to false on unmount
	}, []);

	function renderWalletNotConnectedBody() {
		return (
			<>
				<DropIconWrapper data-testid={`chain-claim-wallet-not-connected`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedTokenForClaim!.imageUrl}
						alt=""
					/>
				</DropIconWrapper>

				<p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
					Connect your wallet to claim your tokens
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
		function getPermissionIcon(permission: Permission) {
			if (permission.name === PermissionType.BRIGHTID) {
				return 'assets/images/modal/bright-id-logo-checked.svg';
			} else if (permission.name === PermissionType.AURA) {
				return 'assets/images/modal/aura-logo.svg';
			}

			return '';
		}

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

		const relatedClaimedTokenRecipt = claimedTokensList.find(
			(token) => token.tokenDistribution.id === selectedTokenForClaim.id,
		);

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
				{claimTokenSignatureLoading ? (
					<p className="text-white text-sm my-4 text-center px-3 mb-6">Preparing your claim signature...</p>
				) : claimTokenWithMetamaskResponse?.state === 'Retry' ? (
					<p className="text-white text-sm my-4 text-center px-3 mb-6">{claimTokenWithMetamaskResponse?.message}</p>
				) : (
					<div className="text-left text-white">
						<p className="text-lg mb-4 text-center leading-loose">Your claim is ready.</p>
						<p className="text-sm mb-4">If you have not already claimed your tokens, you can claim them now.</p>
						<p className="text-sm mb-4">
							You will need to sign a wallet transaction and pay a small gas fee to claim tokens.
						</p>
						<p className="text-sm mb-6">
							If you do not have sufficient gas, please visit{' '}
							<Link className="text-blue-500" to="/gas-tap">
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
					data-testid={`chain-claim-action-${selectedTokenForClaim!.chain.pk}`}
				>
					{claimTokenLoading ? (
						<p>Claiming...</p>
					) : claimTokenSignatureLoading ? (
						<p>Preparing...</p>
					) : claimTokenWithMetamaskResponse?.state === 'Retry' ? (
						<p>Retry</p>
					) : (
						<p>{`Claim ${selectedTokenForClaim.amount} ${selectedTokenForClaim.token}`}</p>
					)}
				</ClaimButton>
			</>
		);
	}

	function renderFinishedBody() {
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
					{selectedTokenForClaim?.isMaxedOut ? (
						"Unfortunately, there are no more tokens to claim. Make sure you're following us on Twitter to be notified when more tokens are available."
					) : selectedTokenForClaim?.isExpired ? (
						"Unfortunately, you missed the deadline to claim your tokens. Make sure you're following us on Twitter to be notified when more tokens are available."
					) : claimTokenWithMetamaskResponse?.success ? (
						<p className="text-space-green text-sm my-4 text-center px-3 mb-6">
							Your tokens have been claimed successfully. <br />{' '}
							<span
								onClick={() => window.open('https://gnosisscan.io/tx/' + claimTokenWithMetamaskResponse?.txHash)}
								className="text-white text-md hover:cursor-pointer hover:underline break-words break-all"
							>
								{claimTokenWithMetamaskResponse?.txHash}
							</span>
						</p>
					) : (
						''
					)}
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

	const getClaimTokenModalBody = () => {
		if (!selectedTokenForClaim) {
			closeClaimModal();
			return null;
		}

		if (selectedTokenForClaim.isExpired || selectedTokenForClaim.isMaxedOut) {
			return renderFinishedBody();
		}

		if (!userProfile) return renderBrightNotConnectedBody();

		selectedTokenForClaim?.permissions.forEach((permission) => {
			if (permission.name === PermissionType.BRIGHTID) {
				if (!userProfile.isMeetVerified) return renderVerifyPermission(permission);
			} else if (permission.name === PermissionType.AURA) {
				if (!userProfile.isAuraVerified) return renderVerifyPermission(permission);
			}
		});

		if (!walletConnected) return renderWalletNotConnectedBody();

		if (claimTokenWithMetamaskResponse?.state === 'Done') return renderFinishedBody();

		if (!chainId || chainId.toString() !== selectedTokenForClaim?.chain.chainId)
			return renderWrongNetworkBody(selectedTokenForClaim.chain);

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

	return (
		<Modal
			title={`Claim ${selectedTokenForClaim.amount} ${selectedTokenForClaim.token}`}
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
