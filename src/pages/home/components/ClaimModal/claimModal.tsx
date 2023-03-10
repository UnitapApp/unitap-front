import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import {
  ClaimBoxRequestButton,
  PrimaryButton,
  SecondaryButton,
  SecondaryGreenColorButton,
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

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
  const { account } = useWeb3React();
  const active = !!account;

  const { tryActivation } = useWalletActivation();
  const { claim, closeClaimModal, retryClaim, claimBoxStatus, activeClaimReceipt, openBrightIdModal } =
    useContext(ClaimContext);

  const mounted = useRef(false);

  const [lottieLoaded, setLottieLoaded] = useState(false);
  useEffect(() => {
    if (claimBoxStatus.status === ClaimBoxState.PENDING) {
      if (!lottieLoaded) {
        lottie.loadAnimation({
          container: document.querySelector('#animation') as HTMLInputElement,
          animationData: animation,
          loop: true,
          autoplay: true,
        });
        setLottieLoaded(true);
      }
    }
  }, [claimBoxStatus, lottieLoaded]);

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
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">Not Connected</WalletAddress>
        <PrimaryButton
          onClick={tryActivation}
          width="100%"
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Connect Wallet
        </PrimaryButton>
      </>
    );
  }

  function renderBrightNotConnectedBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-brightid-not-connected`}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <PrimaryButton
          onClick={openBrightIdModal}
          width="100%"
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Connect BrightID
        </PrimaryButton>
      </>
    );
  }

  function renderInitialBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-initial-${chain.pk}`}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <PrimaryButton
          onClick={() => claim(chain.pk)}
          width="100%"
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Claim
        </PrimaryButton>
      </>
    );
  }

  function renderRequestBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-request-${chain.pk}`}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <ClaimBoxRequestButton width="100%" fontSize="20px" data-testid={`chain-claim-action-${chain.pk}`}>
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
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc="assets/images/modal/successful-state-check.svg" width="30px" className="state-logo" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          we successfully transferred {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol} to your wallet
        </Text>
        <SecondaryButton
          onClick={() => window.open(getTxUrl(chain, activeClaimReceipt!.txHash!), '_blank')}
          width={'100%'}
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
          color="space_green"
        >
          View on Explorer
        </SecondaryButton>
      </>
    );
  }

  function renderFailedBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-failed-${chain.pk}`}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc="assets/images/modal/failed-state-x.svg" width="30px" className="state-logo" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14" color="warningRed" textAlign="center">
          Claim Failed!
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          An error occurred while processing your request
        </Text>
        <SecondaryButton
          fontSize="20px"
          onClick={retryClaim}
          width={'100%'}
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Try Again
        </SecondaryButton>
      </>
    );
  }

  function getClaimBody() {
    if (claimBoxStatus.status === ClaimBoxState.WALLET_NOT_CONNECTED) {
      return renderWalletNotConnectedBody();
    } else if (claimBoxStatus.status === ClaimBoxState.BRIGHTID_NOT_VERIFIED) {
      return renderBrightNotConnectedBody();
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
      <Text fontSize="14" className="scan-qr-text">
        Claim {formatWeiBalance(chain.maxClaimAmount)} {chain.symbol}
      </Text>
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

  return (
    <>
      <Modal title="claim gas fee" size="small" closeModalHandler={closeClaimModal} isOpen={isOpen}>
        <ClaimModalBody chain={activeChain!} />
      </Modal>
    </>
  );
};
export default ClaimModal;
