import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton } from 'components/basic/Button/button';

import { BrightIdModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';

const CreateBrightIdAccountModalContent = () => {
  const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const [tried, setTried] = useState(false);
  const { activeChain, closeBrightIdModal } = useContext(ClaimContext);

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
    <div className='bright-connection-modal flex flex-col items-center justify-center pt-5' data-testid="brightid-modal">
      <Icon
        data-testid="brightid-logo"
        className="bright-id-logo z-10 mb-5"
        iconSrc='assets/images/modal/bright-id-flat-logo.svg'
      />
      <p className="text-sm text-gray100 mb-6 mr-auto">Create a BrightID account easily by following this steps:</p>
      <p className="text-sm text-white mb-4 mr-auto">1- Download BrightID App</p>
      <div className='stores flex w-full justify-evenly mb-7'>
        <Icon className='cursor-pointer' iconSrc='assets/images/modal/google-play.svg' height='48px'  width='auto'/>
        <Icon className='cursor-pointer' iconSrc='assets/images/modal/app-store.svg' height='48px'  width='auto'/>
      </div>

      <p className="text-sm text-white mb-4 mr-auto mb-32">2- Join a <span className='text-space-green underline cursor-pointer'>Verification Meet</span> to get verified by BrightID</p>
      <p className="text-xs text-gray100">then come back and connect your BrightID to enjoy Unitap</p>
    </div>
  );
};

const CreateBrightIdAccountModal = () => {
  const { brightidModalStatus, closeBrightIdModal } = useContext(ClaimContext);
  return (
    <Modal
      title="Create BrightID Account"
      size='small'
      isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
      closeModalHandler={closeBrightIdModal}
    >
      <CreateBrightIdAccountModalContent />
    </Modal>
  );
};

export default CreateBrightIdAccountModal;
