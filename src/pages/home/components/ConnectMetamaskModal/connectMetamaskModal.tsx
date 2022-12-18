import * as React from 'react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { CopyLink } from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton } from 'components/basic/Button/button';

import { BrightIdModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';

const ConnectMetamaskModalContent = () => {
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
    <div className='bright-connection-modal flex flex-col items-center justify-center pt-12' data-testid="brightid-modal">
      
      <Icon
        data-testid="brightid-qr"
        className="qr-code !w-4/12 z-10 mb-16"
        iconSrc='assets/images/modal/metamask-icon.svg'
      />
      <p className="text-sm font-medium text-gray100 mb-3 mr-auto">Don’t have a metamask wallet?</p>
      <p className="text-sm text-gray90 mb-6 mr-auto">Go to <span className='text-orange'> Metamask.io </span> and create your first wallet and come back to start with web3</p>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      {refreshUserProfile && (
        <ClaimButton
          data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
          onClick={refreshConnectionButtonAction}
          className="!w-full"
        >
          {tried ? <p className='font-semibold'>Scan or Use Link and Try Again</p> : <p className='font-semibold'>Connect Wallet</p>}
        </ClaimButton>
      )}
    </div>
  );
};

const ConnectMetamaskModal = () => {
  const { brightidModalStatus, closeBrightIdModal } = useContext(ClaimContext);
  return (
    <Modal
      title="Connect Metamask"
      size='small'
      // isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
      isOpen={false}
      closeModalHandler={closeBrightIdModal}
    >
      <ConnectMetamaskModalContent />
    </Modal>
  );
};

export default ConnectMetamaskModal;