import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { CopyLink } from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton, WhiteOutlinedButton } from 'components/basic/Button/button';

import { BrightIdModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';

const ConnectBrightIdModalContent = () => {
  const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const [tried, setTried] = useState(false);
  const { activeChain, closeBrightIdModal, openHaveBrightIdAccountModal, openBrightIdConnectionModal } = useContext(ClaimContext);

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

  const handleHaveBrightIdClicked = () => {
    closeBrightIdModal();
    openHaveBrightIdAccountModal();
  }

  const handleBrightIdConnectClicked = () => {
    closeBrightIdModal();
    openBrightIdConnectionModal();
  }

  if (userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

  return (
    <div className='bright-connection-modal flex flex-col items-center justify-center pt-2' data-testid="brightid-modal">

      <Icon
        data-testid="brightid-logo"
        className="bright-logo !w-4/12 z-10 mb-5"
        iconSrc='assets/images/modal/bright-id-logo.svg'
      />
      <p className="text-sm font-bold text-white mb-2">Connect Your BrightID</p>
      <p className="text-xs font-medium text-gray100 mb-5 text-center px-4 leading-6">BrightID is a social identity network that allows users to prove that they are only using one account.</p>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      <WhiteOutlinedButton className='mb-4 !w-full bg-gray30' onClick={handleBrightIdConnectClicked}>I have BrightID Account</WhiteOutlinedButton>

      <ClaimButton
        data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
        onClick={handleHaveBrightIdClicked}
        className="!w-full mb-4"
      >
        <p className='font-semibold'>Create BrightID Account</p>
      </ClaimButton>

      <p className="text-xs font-light text-gray100">you can create a BrightID account and get verified in 2 simple steps</p>
    </div>
  );
};

const ConnectBrightIdModal = () => {
  const { brightidModalStatus, closeBrightIdModal } = useContext(ClaimContext);
  return (
    <Modal
      title=""
      size='small'
      isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
      closeModalHandler={closeBrightIdModal}
    >
      <ConnectBrightIdModalContent />
    </Modal>
  );
};

export default ConnectBrightIdModal;