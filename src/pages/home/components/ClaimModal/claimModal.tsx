import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, DropIconWrapper } from 'pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton, SecondaryButton } from 'components/basic/Button/button';
import { MessageButton } from 'components/basic/MessageButton/messageButton.style';
import { BrightIdVerificationStatus, Chain, ClaimReceipt } from 'types';
import { getChainClaimIcon, shortenAddress } from 'utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { claimMax } from 'api';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from '../../../../utils/numbers';
import WalletAddress from 'pages/home/components/ClaimModal/walletAddress';
import lottie from 'lottie-web';
import animation from 'assets/animations/GasFee-delivery2.json';

enum ClaimState {
  INITIAL,
  LOADING,
  SUCCESS,
  FAILED,
}

const ClaimModal = ({ chain, closeModalHandler }: { chain: Chain; closeModalHandler: () => void }) => {
  const formatBalance = useCallback((amount: number) => {
    const fw = fromWei(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);
  const { active, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { updateChainList } = useContext(ChainListContext);
  const [claimState, setClaimState] = useState(ClaimState.INITIAL);

  const brightIdVerified = useMemo(
    () => userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [claimReceipt, setClaimReceipt] = useState<ClaimReceipt | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (claimState === ClaimState.LOADING) {
      lottie.loadAnimation({
        container: document.querySelector('#animation') as HTMLInputElement,
        animationData: animation,
        loop: true,
        autoplay: true,
      });
    }
  }, [claimState]);

  useEffect(() => {
    mounted.current = true; // Will set it to true on mount ...
    return () => {
      mounted.current = false;
    }; // ... and to false on unmount
  }, []);
  const claim = useCallback(async () => {
    if (!brightIdVerified || claimState === ClaimState.LOADING) {
      return;
    }
    setClaimState(ClaimState.LOADING);
    try {
      const claimReceipt = await claimMax(account!, chain.pk);
      setClaimReceipt(claimReceipt);
      await updateChainList?.();
      if (mounted.current) {
        setClaimState(ClaimState.SUCCESS);
      }
    } catch (ex) {
      if (mounted.current) {
        setClaimState(ClaimState.FAILED);
      }
    }
  }, [account, brightIdVerified, chain.pk, claimState, updateChainList]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function connectMetamaskBody() {
    return (
      <>
        <DropIconWrapper>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon iconSrc={'dropIcon.png'} width="90px" mb={4} mt={1} height="auto" />
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
          <Icon iconSrc={'dropIcon.png'} width="90px" mb={4} mt={1} height="auto" />
        </DropIconWrapper>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <PrimaryButton onClick={claim} width="100%" fontSize="20px" data-testid={`chain-claim-action-${chain.pk}`}>
          Claim
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

  function getSuccessBody() {
    return (
      <>
        <Icon
          iconSrc={'success-airdrop.png'}
          width="70px"
          height="auto"
          mb={6}
          mr={-1}
          mt={2}
          data-testid={`chain-claim-success-${chain.pk}`}
        />
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          0.001 xDai Calimed
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          Your request is submitted successfully!
        </Text>
        <SecondaryButton
          onClick={closeModalHandler}
          width={'100%'}
          fontSize="20px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          View on Explorer
        </SecondaryButton>
      </>
    );
  }

  function getFailedBody() {
    return (
      <>
        <Icon
          iconSrc={'failed-airdrop.png'}
          width="70px"
          height="auto"
          mb={6}
          mr={-1}
          mt={2}
          data-testid={`chain-claim-failed-${chain.pk}`}
        />
        <Text width="100%" fontSize="14" color="warningRed" textAlign="center">
          Claim Failed!
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          An error happened while processing your request
        </Text>
        <SecondaryButton
          fontSize="20px"
          onClick={() => setClaimState(ClaimState.INITIAL)}
          width={'100%'}
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Try Again
        </SecondaryButton>
      </>
    );
  }

  function getClaimBody() {
    if (claimState === ClaimState.FAILED) {
      return getFailedBody();
    } else if (claimState === ClaimState.LOADING) {
      return getLoadingBody();
    } else if (claimState === ClaimState.SUCCESS) {
      return getSuccessBody();
    } else {
      return getInitialBody();
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

export default ClaimModal;
