import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, DropIconWrapper } from 'components/pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton } from 'components/basic/Button/button';
import {
  DangerMessageButton,
  MessageButton,
  SuccessMessageButton,
} from 'components/basic/MessageButton/messageButton.style';
import { BrightIdVerificationStatus, Chain, ClaimReceipt } from 'types';
import { getChainClaimIcon, getTxUrl, shortenAddress } from 'utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { claimMax } from 'api';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from '../../../../../utils/numbers';
import WalletAddress from 'components/pages/home/components/ClaimModal/walletAddress';
import lottie from 'lottie-web';
import animation from '../../../../../animations/GasFee-delivery2.json';

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
      alert('Error while claiming');
      if (mounted.current) {
        setClaimState(ClaimState.INITIAL);
      }
    }
  }, [account, brightIdVerified, chain.pk, claimState, updateChainList]);

  function getClaimReceipt() {
    return (
      <>
        <Text fontSize="14" className="scan-qr-text">
          Claimed {formatBalance(chain.maxClaimAmount)} {chain.symbol}
        </Text>
        <a
          style={{ marginBottom: '20px' }}
          data-testid="claim-receipt"
          href={getTxUrl(chain, claimReceipt!)}
          target="_blank"
          rel="noreferrer"
        >
          View on Explorer
        </a>
        <PrimaryButton onClick={closeModalHandler} width="100%" data-testid={`chain-claim-action-${chain.pk}`}>
          Close
        </PrimaryButton>
      </>
    );
  }

  function getInitialBody() {
    return (
      <>
        <DropIconWrapper>
          <img src={getChainClaimIcon(chain)} alt="" />
          <Icon mr={2} mb={2} mt={2} ml={2} iconSrc={'dropIcon.png'} width="80px" height="auto" />
        </DropIconWrapper>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        {/* <Input disabled width="100%" value={active ? shortenAddress(account) : ''}></Input> */}
        <PrimaryButton onClick={claim} width="100%" data-testid={`chain-claim-action-${chain.pk}`}>
          {brightIdVerified ? 'Claim' : 'BrightID not connected'}
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getSuccessBody() {
    return (
      <>
        <Icon iconSrc={'success-airdrop.png'} width="120px" height="auto" />
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <SuccessMessageButton onClick={closeModalHandler} width={'100%'} data-testid={`chain-claim-action-${chain.pk}`}>
          Claimed Successfully
        </SuccessMessageButton>
      </>
    );
  }

  function getFailedBody() {
    return (
      <>
        <Icon iconSrc={'failed-airdrop.png'} width="120px" height="auto" />
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        <DangerMessageButton
          onClick={() => setClaimState(ClaimState.INITIAL)}
          width={'100%'}
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          Claim Failed
        </DangerMessageButton>
      </>
    );
  }

  function getClaimBody() {
    if (claimState === ClaimState.INITIAL) {
      return getInitialBody();
    } else if (claimState === ClaimState.LOADING) {
      return getLoadingBody();
    } else if (claimState === ClaimState.SUCCESS) {
      return getClaimReceipt();
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

export default ClaimModal;
