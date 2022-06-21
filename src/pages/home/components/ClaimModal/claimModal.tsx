import * as React from 'react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton, SecondaryButton } from 'components/basic/Button/button';
import { MessageButton } from 'components/basic/MessageButton/messageButton.style';
import { Chain, ClaimBoxState } from 'types';
import { getChainClaimIcon, shortenAddress } from 'utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from '../../../../utils/numbers';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import lottie from 'lottie-web';
import animation from 'assets/animations/GasFee-delivery2.json';
import Modal from 'components/common/Modal/modal';
import { Spaceman } from 'constants/spaceman';

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
  const formatBalance = useCallback((amount: number) => {
    const fw = fromWei(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);
  const { active, account } = useActiveWeb3React();

  const { claim, closeClaimModal, retryClaim, claimBoxStatus } = useContext(ChainListContext);

  const mounted = useRef(false);

  useEffect(() => {
    if (claimBoxStatus.status === ClaimBoxState.PENDING) {
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

  if (!chain) return <></>;
  const b = chain;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function connectMetamaskBody({ chain }: { chain: Chain }) {
    return (
      <>
        <DropIconWrapper>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <SecondaryButton onClick={() => {}} width="100%" fontSize="20px" data-testid={`chain-claim-action-${chain.pk}`}>
          Connect Wallet
        </SecondaryButton>
      </>
    );
  }

  function getInitialBody() {
    return (
      <>
        <DropIconWrapper>
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
  function getRequestBody() {
    return (
      <>
        <DropIconWrapper data-testid={'request'}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <PrimaryButton disabled={true} width="100%" fontSize="20px" data-testid={`chain-claim-action-${chain.pk}`}>
          Pending ...
        </PrimaryButton>
      </>
    );
  }

  function getLoadingBody() {
    return (
      <>
        <div data-testid={`loading`} id="animation" style={{ width: '200px' }}></div>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12" editable>
          {active ? shortenAddress(account) : ''}
        </WalletAddress>
        <MessageButton width={'100%'} data-testid={`chain-claim-action-${chain.pk}`}>
          Pending...
        </MessageButton>
      </>
    );
  }

  function getPendingBody() {
    return (
      <>
        <div data-testid={`pending`} id="animation" style={{ width: '200px' }}></div>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12" editable>
          {active ? shortenAddress(account) : ''}
        </WalletAddress>
        <MessageButton width={'100%'} data-testid={`chain-claim-action-${chain.pk}`}>
          Close
        </MessageButton>
      </>
    );
  }
  function getSuccessBody() {
    return (
      <>
        <DropIconWrapper data-testid={`chain-claim-success-${chain.pk}`}>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc="assets/images/modal/successful-state-check.svg" width="30px" className="state-logo" />
          <Icon iconSrc={'assets/images/modal/drop-icon.svg'} width="52px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          {formatBalance(chain.maxClaimAmount)} {chain.symbol} Claimed
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          Your request is submitted successfully!
        </Text>
        <SecondaryButton
          onClick={closeClaimModal}
          width={'100%'}
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Close
        </SecondaryButton>
      </>
    );
  }

  function getFailedBody() {
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
    if (claimBoxStatus.status === ClaimBoxState.INITIAL) {
      return getInitialBody();
    } else if (claimBoxStatus.status === ClaimBoxState.REQUEST) {
      return getRequestBody();
    } else if (claimBoxStatus.status === ClaimBoxState.PENDING) {
      return getPendingBody();
    } else if (claimBoxStatus.status === ClaimBoxState.VERIFIED) {
      return getSuccessBody();
    } else {
      return getFailedBody();
    }
  }

  return (
    <ClaimModalWrapper data-testid={`chain-claim-modal-${chain.pk}`}>
      <Text fontSize="14" className="scan-qr-text">
        Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
      </Text>
      {getClaimBody()}
    </ClaimModalWrapper>
  );
};

const ClaimModal = () => {
  const { closeClaimModal, activeChain, claimBoxStatus } = useContext(ChainListContext);

  return (
    <>
      {claimBoxStatus.status !== ClaimBoxState.CLOSED && activeChain && (
        <Modal spaceman={Spaceman.BOTTOM_BIG} title="claim gas fee" closeModalHandler={closeClaimModal} isOpen={true}>
          <ClaimModalBody chain={activeChain} />
        </Modal>
      )}
    </>
  );
};
export default ClaimModal;
