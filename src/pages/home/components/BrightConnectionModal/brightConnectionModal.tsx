import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton } from 'components/basic/Button/button';

import { BrightIdConnectionModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';

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
    <BrightConnectionModalWrapper
      className="bright-connection-modal flex flex-col items-center justify-center pt-4"
      data-testid="brightid-modal"
    >
      <p className="scan-qr-text text-sm text-white mb-3">Scan QR Code</p>
      <img
        data-testid="brightid-qr"
        className="qr-code !w-4/12 z-10 mb-4"
        src={`http://api.qrserver.com/v1/create-qr-code/?data=${verificationQr}`}
        alt="qr-code"
      />
      <p className="text-xs text-white mb-4">or</p>
      <CopyLink
        onClick={copyVerificationUrl}
        data-testid="brightid-copy-link"
        className="flex text-space-green mb-10 z-10"
      >
        <Icon
          iconSrc={process.env.PUBLIC_URL + '/assets/images/copy-link.png'}
          width="16px"
          height="19px"
          className="mr-3"
        />
        <p className="text-space-green font-medium cursor-pointer hover:underline">Copy Link</p>
      </CopyLink>
      <span className="notice flex mb-3">
        <Icon className="mr-2" iconSrc="assets/images/modal/gray-danger.svg" />
        <p className="text-xs text-gray90 font-light"> Submit connection after connecting with the BrightID app. </p>
      </span>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      {refreshUserProfile && (
        <ClaimButton
          data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
          onClick={refreshConnectionButtonAction}
          className="!w-full mb-4"
        >
          {tried ? (
            <p className="font-semibold">Scan or Use Link and Try Again</p>
          ) : (
            <p className="font-semibold">Submit Connection</p>
          )}
        </ClaimButton>
      )}
      <span className="dont-have-bright-id md:flex flex-col md:flex-row items-center md:justify-between w-full">
        <p className="text-xs text-gray100 text-center mb-2 md:mb-0">Don’t have a verified BrightID account?</p>
        <p
          className="text-xs font-semibold cursor-pointer underline text-white text-center"
          onClick={() => {
            window.open('https://brightid.gitbook.io/brightid/getting-verified', '_blank');
          }}
        >
          Get Verified on BrightID
        </p>
      </span>
    </BrightConnectionModalWrapper>
  );
};

const BrightConnectionModal = () => {
  const { brightIdConnectionModalStatus, closeBrightIdConnectionModal } = useContext(ClaimContext);
  return (
    <Modal
      className="bright-modal"
      title="Connect your BrightID"
      size="small"
      isOpen={brightIdConnectionModalStatus !== BrightIdConnectionModalState.CLOSED}
      closeModalHandler={closeBrightIdConnectionModal}
    >
      <BrightConnectionModalBody />
    </Modal>
  );
};

export default BrightConnectionModal;
