import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import {
  ClaimBoxRequestButton, ClaimButton, LightOutlinedButtonNew, SecondaryGreenColorButton,
} from 'components/basic/Button/button';
import { BrightIdModalState, Chain, ClaimBoxState } from 'types';
import { getChainClaimIcon, getTxUrl, shortenAddress } from 'utils';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance } from 'utils/numbers';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import lottie from 'lottie-web';
import animation from 'assets/animations/GasFee-delivery2.json';
import Modal from 'components/common/Modal/modal';
import useWalletActivation from '../../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import {UserProfileContext} from "../../../../hooks/useUserProfile";

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
  const { account } = useWeb3React();
  const active = !!account;

  const { tryActivation } = useWalletActivation();
  const { claim, closeClaimModal, retryClaim, claimBoxStatus, activeClaimReceipt, openBrightIdModal } =
    useContext(ClaimContext);

  const mounted = useRef(false);

  useEffect(() => {
    if (claimBoxStatus.status === ClaimBoxState.PENDING) {
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
  }, [claimBoxStatus]);

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
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />
        </DropIconWrapper>

        <p className="text-white text-sm mb-5 mt-11">
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
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />
        </DropIconWrapper>
        <p className="text-white text-sm mb-5 mt-11">
          You need to connect your BrightID to claim your tokens
        </p>

        <ClaimButton
          onClick={openBrightIdModal}
          width="100%"
          className='!w-full'
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
            <LightOutlinedButtonNew className="!w-full" onClick={() => window.open('https://meet.brightid.org/', '_blank')}>
              Verify on BrightID <Icon className='cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2' iconSrc="assets/images/arrow-icon.svg" />
            </LightOutlinedButtonNew>
            <Icon iconSrc="assets/images/modal/bright-id-check.svg" className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"/>
          </span>

          {/* eslint-disable-next-line no-restricted-globals */}
          <p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>If you verified your BrightID click here.</p>
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
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <ClaimButton
          onClick={() => claim(chain.pk)}
          width="100%"
          fontSize="16px"
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          <p>{`Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${activeChain.symbol}`}</p>
        </ClaimButton>
      </>
    );
  }

  function renderRequestBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-request-${chain.pk}`}>
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <ClaimBoxRequestButton width="100%" fontSize="16px" data-testid={`chain-claim-action-${chain.pk}`}>
          Pending ...
        </ClaimBoxRequestButton>
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
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />

        </DropIconWrapper>
        <span className='flex justify-center items-center font-medium mb-3'>
          <Text className='!mb-0' width="100%" fontSize="14" color="space_green" textAlign="center">
            {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
          </Text>
          <Icon iconSrc="assets/images/modal/successful-state-check.svg" width="22px" height='auto' className='ml-2' />
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
          <Icon className="chain-logo z-10 mt-14 mb-10" width="auto" height="110px" iconSrc={getChainClaimIcon(chain)} alt="" />
        </DropIconWrapper>
        <span className='flex justify-center items-center font-medium mb-3'>
          <Text className='!mb-0' width="100%" fontSize="14" color="warningRed" textAlign="center">
            Claim Failed!
          </Text>
          <Icon iconSrc="assets/images/modal/failed-state-x.svg" width="22px" height='auto' className='ml-2' />
        </span>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          An error occurred while processing your request
        </Text>
        <ClaimButton
          fontSize="16px"
          onClick={retryClaim}
          width={'100%'}
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          <p>Try Again</p>
        </ClaimButton>
      </>
    );
  }

  function getClaimBody() {
    if (claimBoxStatus.status === ClaimBoxState.WALLET_NOT_CONNECTED) {
      return renderWalletNotConnectedBody();
    } else if (claimBoxStatus.status === ClaimBoxState.BRIGHTID_NOT_CONNECTED) {
      return renderBrightNotConnectedBody();
    } else if (claimBoxStatus.status === ClaimBoxState.BRIGHTID_NOT_VERIFIED) {
      return renderBrightNotVerifiedBody();
    } else if (claimBoxStatus.status === ClaimBoxState.INITIAL) {
      return renderInitialBody();
    } else if (claimBoxStatus.status === ClaimBoxState.REQUEST) {
      return renderRequestBody();
    } else if (claimBoxStatus.status === ClaimBoxState.PENDING) {
      return renderPendingBody();
    } else if (claimBoxStatus.status === ClaimBoxState.VERIFIED) {
      return renderSuccessBody();
    } else {
      return renderFailedBody();
    }
  }

  return (
    <div
      className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
      data-testid={`chain-claim-modal-${chain.pk}`}
    >
      {getClaimBody()}
    </div>
  );
};

const ClaimModal = () => {
  const { closeClaimModal, activeChain, claimBoxStatus } = useContext(ClaimContext);
  const { brightidModalStatus } = useContext(ClaimContext);

  const isOpen = useMemo(() => {
    return (
      !!activeChain &&
      claimBoxStatus.status !== ClaimBoxState.CLOSED &&
      brightidModalStatus === BrightIdModalState.CLOSED
    );
  }, [activeChain, brightidModalStatus, claimBoxStatus.status]);

  if (!activeChain) return null;

  return (
    <>
      <Modal title={`Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${activeChain.symbol}`} size="small" closeModalHandler={closeClaimModal} isOpen={isOpen}>
        <ClaimModalBody chain={activeChain} />
      </Modal>
    </>
  );
};
export default ClaimModal;
