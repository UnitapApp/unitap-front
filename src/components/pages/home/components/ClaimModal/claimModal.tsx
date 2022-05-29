import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, WalletAddress } from 'components/pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton } from 'components/basic/Button/button';
import { MessageButton, SuccessMessageButton, DangerMessageButton } from 'components/basic/MessageButton/messageButton.style';
import { BrightIdVerificationStatus, Chain, ClaimReceipt } from 'types';
import { getTxUrl, shortenAddress } from 'utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { claimMax } from 'api';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from '../../../../../utils/numbers';
import RenderIf from 'components/basic/RenderIf/renderIf';

const ClaimModal = ({ chain, closeModalHandler }: { chain: Chain; closeModalHandler: () => void }) => {
  const formatBalance = useCallback((amount: number) => {
    const fw = fromWei(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);
  const { active, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { updateChainList } = useContext(ChainListContext);

  const brightIdVerified = useMemo(
    () => userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );
  const [loading, setLoading] = useState(false);
  const [claimReceipt, setClaimReceipt] = useState<ClaimReceipt | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true; // Will set it to true on mount ...
    return () => {
      mounted.current = false;
    }; // ... and to false on unmount
  }, []);
  const claim = useCallback(async () => {
    if (!brightIdVerified || loading) {
      return;
    }
    setLoading(true);
    try {
      const claimReceipt = await claimMax(account!, chain.pk);
      setClaimReceipt(claimReceipt);
      await updateChainList?.();
    } catch (ex) {
      alert('Error while claiming');
      console.log(ex);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [account, brightIdVerified, chain.pk, loading, updateChainList]);

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

  const [trState, setTrState] = useState('pending');
  function getClaimBody2() {
    return (
      <>
        <Text fontSize="14" className="scan-qr-text">
          Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
        </Text>

        <RenderIf isTrue={trState == 'pending'}>
          <Icon iconSrc={'pending-spaceman.png'} width="120px" height="auto" />

          <Text width="100%" fontSize="14"> Wallet Address </Text>
          <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
          <MessageButton width={'100%'}>Pending...</MessageButton>
        </RenderIf>

        <RenderIf isTrue={trState == 'successful'}>
          <Icon iconSrc={'success-airdrop.png'} width="120px" height="auto" />

          <Text width="100%" fontSize="14"> Wallet Address </Text>
          <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
          <SuccessMessageButton width={'100%'}>Claimed Successfully</SuccessMessageButton>
        </RenderIf>

        <RenderIf isTrue={trState == 'failed'}>
          <Icon iconSrc={'failed-airdrop.png'} width="120px" height="auto" />
          <Text width="100%" fontSize="14"> Wallet Address </Text>
          <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
          <DangerMessageButton width={'100%'}>Claim Failed</DangerMessageButton>
        </RenderIf>
      </>
    )
  }

  function getClaimBody() {
    return (
      <>
        <Text fontSize="14" className="scan-qr-text">
          Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
        </Text>
        <Icon iconSrc={'dropIcon.png'} width="80px" height="auto" />
        <WalletAddress fontSize="12">{active ? shortenAddress(account) : ''}</WalletAddress>
        {/* <Input disabled width="100%" value={active ? shortenAddress(account) : ''}></Input> */}
        <PrimaryButton onClick={claim} width="100%" data-testid={`chain-claim-action-${chain.pk}`}>
          {brightIdVerified ? 'Claim' : 'BrightID not connected'}
        </PrimaryButton>
      </>
    );
  }

  return (
    <ClaimModalWrapper data-testid={`chain-claim-modal-${chain.pk}`}>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      {claimReceipt ? getClaimReceipt() : getClaimBody2()}
    </ClaimModalWrapper>
  );
};

export default ClaimModal;
