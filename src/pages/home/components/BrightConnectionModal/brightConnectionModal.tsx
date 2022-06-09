import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { SecondaryButton } from 'components/basic/Button/button';

import { BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';

const BrightConnectionModal = ({ closeModalHandler }: { closeModalHandler: () => void }) => {
  const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const verificationQr = userProfile ? getVerificationQr(userProfile) : '';
  const copyVerificationUrl = async () => {
    try {
      await copyToClipboard(verificationUrl);
      alert('Copied');
    } catch (e) {
      alert('Could not copy the text');
    }
  };

  const refreshConnectionButtonAction = useCallback(async () => {
    if (!refreshUserProfile || loading) {
      return;
    }
    try {
      const refreshedUserProfile = await refreshUserProfile();
      if (refreshedUserProfile.verificationStatus === BrightIdVerificationStatus.VERIFIED) {
        alert('Connected to Bright-ID successfully!');
        closeModalHandler();
      } else {
        alert('Not Connected to Bright-ID!\nPlease Scan The QR Code or Use Copy Link Option.');
      }
    } catch (ex) {
      console.log(ex);
      alert('Error while connectiong to BrightID sever!');
    }
  }, [refreshUserProfile, loading, closeModalHandler]);

  return (
    <BrightConnectionModalWrapper data-testid="brightid-modal">
      <img src={process.env.PUBLIC_URL + '/assets/images/bright-icon.png'} alt="" />
      <Text fontSize="14" className="scan-qr-text">
        Scan QR Code
      </Text>
      <img
        data-testid="brightid-qr"
        className="qr-code"
        src={`http://api.qrserver.com/v1/create-qr-code/?data=${verificationQr}`}
        alt="qr-code"
      />
      <Text fontSize="14" className="or-text">
        or
      </Text>
      <CopyLink onClick={copyVerificationUrl} data-testid="brightid-copy-link">
        <img src={process.env.PUBLIC_URL + '/assets/images/copy-link.png'} alt="" />
        <Text color="green">Copy Link</Text>
      </CopyLink>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      {refreshUserProfile && (
        <SecondaryButton data-testid={`bright-id-connection-refresh-button`} onClick={refreshConnectionButtonAction}>
          {userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED
            ? `Connected to BrightID`
            : `Press me when you scanned!`}
        </SecondaryButton>
      )}
    </BrightConnectionModalWrapper>
  );
};

export default BrightConnectionModal;
