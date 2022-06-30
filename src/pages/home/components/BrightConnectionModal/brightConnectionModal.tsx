import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { SecondaryButton } from 'components/basic/Button/button';

import { BrightIdModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { Spaceman } from 'constants/spaceman';
import { ClaimContext } from 'hooks/useChainList';

const BrightConnectionModalBody = () => {
  const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const verificationQr = userProfile ? getVerificationQr(userProfile) : '';
  const [tried, setTried] = useState(false);
  const { activeChain, closeBrightIdModal } = useContext(ClaimContext);

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
      if (refreshedUserProfile.verificationStatus !== BrightIdVerificationStatus.VERIFIED) {
        setTried(true);
        alert('Not Connected to Bright-ID!\nPlease Scan The QR Code or Use Copy Link Option.');
      } else {
        setTried(false);
        if (!!activeChain) {
          closeBrightIdModal();
        }
      }
    } catch (ex) {
      alert('Error while connecting to BrightID sever!');
      setTried(true);
    }
  }, [refreshUserProfile, loading, activeChain, closeBrightIdModal]);

  if (userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

  return (
    <BrightConnectionModalWrapper data-testid="brightid-modal" warning={tried}>
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
        <SecondaryButton
          data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
          onClick={refreshConnectionButtonAction}
        >
          {tried ? 'Scan or Use Link and Try Again' : 'Click here after confirming in BrightID app!'}
        </SecondaryButton>
      )}
    </BrightConnectionModalWrapper>
  );
};

const BrightConnectionModal = () => {
  const { brightidModalStatus, closeBrightIdModal } = useContext(ClaimContext);
  return (
    <Modal
      className="bright-modal"
      spaceman={Spaceman.WITH_PHONE}
      title="Connect your BrightID"
      isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
      closeModalHandler={closeBrightIdModal}
    >
      <BrightConnectionModalBody />
    </Modal>
  );
};

export default BrightConnectionModal;
