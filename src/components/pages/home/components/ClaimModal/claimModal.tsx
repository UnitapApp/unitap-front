import * as React from 'react';
import { Text } from 'components/basic/Text/text.style';
import { ClaimModalWrapper, WalletAddress } from 'components/pages/home/components/ClaimModal/claimModal.style';
import Icon from 'components/basic/Icon/Icon';
import { PrimaryButton } from 'components/basic/Button/button';

const ClaimModal = () => {
  return (
    <ClaimModalWrapper>
      <Text fontSize="14" className="scan-qr-text">
        claim 0.003 MATIC
      </Text>
      <Icon iconSrc={process.env.PUBLIC_URL + '/assets/images/matic-icon.png'} width="42%" height='auto' />
      <WalletAddress fontSize="12">
        Wallet Address
      </WalletAddress>
      <PrimaryButton width="100%"> Claim </PrimaryButton>
    </ClaimModalWrapper>
  );
};

export default ClaimModal;
