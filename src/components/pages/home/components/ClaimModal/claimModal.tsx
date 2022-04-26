import * as React from 'react';
import { useCallback, useContext } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, WalletAddress } from 'components/pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton } from 'components/basic/Button/button';
import { Input } from 'components/basic/Input/input';
import { BrightIdVerificationStatus, Chain } from '../../../../../types';
import { ethers } from 'ethers';
import { formatAddress } from '../../../../../utils';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';
import { claimMax } from '../../../../../api';
import { UserProfileContext } from '../../../../../hooks/useUserProfile';

const ClaimModal = ({ chain }: { chain: Chain }) => {
  const formatBalance = useCallback((amount: number) => {
    const fw = ethers.utils.formatEther(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);
  const { active, account } = useActiveWeb3React();
  const userProfile = useContext(UserProfileContext);
  const claim = useCallback(async () => {
    if (userProfile!.verificationStatus !== BrightIdVerificationStatus.VERIFIED) {
      alert('First connect your BrightID');
      return;
    }
    try {
      await claimMax(account!, chain.pk);
      alert('Claimed successfully!');
    } catch (ex) {
      alert('Error while claiming');
      console.log(ex);
    }
  }, [account, chain.pk, userProfile]);

  return (
    <ClaimModalWrapper>
      <Text fontSize="14" className="scan-qr-text">
        Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
      </Text>
      <Icon iconSrc={chain.logoUrl} width="42%" height="auto" />
      <WalletAddress fontSize="12">Wallet Address</WalletAddress>
      <Input disabled width="100%" value={active ? formatAddress(account) : ''}></Input>
      <PrimaryButton onClick={claim} width="100%">
        {' '}
        Claim{' '}
      </PrimaryButton>
    </ClaimModalWrapper>
  );
};

export default ClaimModal;
