import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton, LightOutlinedButtonNew, SecondaryGreenColorButton } from 'components/basic/Button/button';
import { BrightIdModalState, Chain, ClaimReceiptState, Permission, PermissionType } from 'types';
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
import { TokenTapContext } from '../../../../hooks/token-tap/tokenTapContext';
import { switchChain } from '../../../../utils/switchChain';

const ClaimTokenModalBody = ({ chain }: { chain: Chain }) => {
  const { account, chainId, connector } = useWeb3React();
  const walletConnected = !!account;

  const { tryActivation } = useWalletActivation();
  const { selectedTokenForClaim, handleClaimToken, claimedTokensList, claimTokenLoading } = useContext(TokenTapContext);
  const { closeClaimModal, activeClaimReceipt, openBrightIdModal } = useContext(ClaimContext);

  const { claimLoading } = useContext(ClaimContext);

  const mounted = useRef(false);

  const { userProfile } = useContext(UserProfileContext);

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

  function renderWalletNotConnectedBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-wallet-not-connected`}>
          <Icon
            className="chain-logo z-10 mt-14 mb-10"
            width="auto"
            height="110px"
            iconSrc={getChainClaimIcon(chain)}
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
            iconSrc={getPermissionIcon(permission)}
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
            iconSrc={getChainClaimIcon(chain)}
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
          onClick={() => handleClaimToken()}
          width="100%"
          fontSize="16px"
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          {claimTokenLoading ? (
            <p>Claiming...</p>
          ) : (
            <p>{`Claim ${formatWeiBalance(selectedTokenForClaim.chain.maxClaimAmount)} ${
              selectedTokenForClaim.chain.symbol
            }`}</p>
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
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          we successfully transferred {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} to your wallet
        </Text>
        <ClaimButton
          onClick={() => window.open(getTxUrl(chain, activeClaimReceipt!.txHash!), '_blank')}
          width={'100%'}
          fontSize="16px"
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
          color="space_green"
        >
          <p>View on Explorer</p>
        </ClaimButton>
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
          onClick={() => handleClaimToken()}
          width={'100%'}
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          {claimLoading ? <p>Claiming...</p> : <p>Try Again</p>}
        </ClaimButton>
      </>
    );
  }

  const getClaimTokenModalBody = () => {
    if (!selectedTokenForClaim) {
      closeClaimModal();
      return null;
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

    if (!chainId || chainId.toString() !== selectedTokenForClaim?.chain.chainId)
      return renderWrongNetworkBody(selectedTokenForClaim.chain);

    if (!activeClaimReceipt) return renderInitialBody();

    if (activeClaimReceipt.status === ClaimReceiptState.VERIFIED) return renderSuccessBody();

    if (activeClaimReceipt.status === ClaimReceiptState.PENDING) return renderPendingBody();

    if (activeClaimReceipt.status === ClaimReceiptState.REJECTED) return renderFailedBody();
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
  const { brightidModalStatus } = useContext(ClaimContext);

  const closeClaimTokenModal = useCallback(() => {
    setSelectedTokenForClaim(null);
  }, [setSelectedTokenForClaim]);

  const isOpen = useMemo(() => {
    return !!selectedTokenForClaim && brightidModalStatus === BrightIdModalState.CLOSED;
  }, [selectedTokenForClaim, brightidModalStatus]);

  if (!selectedTokenForClaim) return null;

  return (
    <Modal
      title={`Claim ${formatWeiBalance(selectedTokenForClaim.chain.maxClaimAmount)} ${
        selectedTokenForClaim.chain.symbol
      }`}
      size="small"
      closeModalHandler={closeClaimTokenModal}
      isOpen={isOpen}
    >
      <ClaimTokenModalBody chain={selectedTokenForClaim.chain} />
    </Modal>
  );
};
export default ClaimTokenModal;
