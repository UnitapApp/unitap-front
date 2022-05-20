import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, WalletAddress } from 'components/pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton } from 'components/basic/Button/button';
import { BrightIdVerificationStatus, Chain, ClaimReceipt } from 'types';
import { ethers } from 'ethers';
import { getTxUrl, shortenAddress } from 'utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { claimMax } from 'api';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ChainListContext } from 'hooks/useChainList';

const ClaimModal = ({ chain, closeModalHandler }: { chain: Chain; closeModalHandler: () => void }) => {
  const formatBalance = useCallback((amount: number) => {
    const fw = ethers.utils.formatEther(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);
  const { active, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { updateChainList } = useContext(ChainListContext);

  const brightIdVerified = useMemo(
    () => userProfile!.verificationStatus === BrightIdVerificationStatus.VERIFIED,
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
      if (updateChainList) {
        setClaimReceipt(claimReceipt);
        updateChainList();
      }
      alert('Claimed successfully!');
      // closeModalHandler();
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
        <a data-testid="claim-receipt" href={getTxUrl(chain, claimReceipt!)} target="_blank" rel="noreferrer">
          View on Explorer
        </a>
      </>
    );
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
      {claimReceipt ? getClaimReceipt() : getClaimBody()}
    </ClaimModalWrapper>
  );
};

export default ClaimModal;
