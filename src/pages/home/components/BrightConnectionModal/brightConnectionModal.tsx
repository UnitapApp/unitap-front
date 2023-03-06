import * as React from 'react';
import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton } from 'components/basic/Button/button';
import { QRCode } from 'react-qrcode-logo';

import { BrightIdConnectionModalState, BrightIdVerificationStatus } from 'types';

import { copyToClipboard, getVerificationQr } from 'utils';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';
import useGenerateKeys from 'hooks/useGenerateKeys';

const BrightConnectionModalBody = () => {
  const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const verificationQr = userProfile ? getVerificationQr(userProfile) : '';
  const [tried, setTried] = useState(false);
  const { activeChain, closeBrightIdModal } = useContext(ClaimContext);

  const [keys, isLoading, error, signPrivateKey] = useGenerateKeys();
  const [signedPrivateKey, setSignedPrivateKey] = useState<string | null>(null);

  useEffect(() => {
    if (keys) {
      signPrivateKey()
        .then((res) => setSignedPrivateKey(res))
        .catch((err) => console.log(err))
    }
  }, [keys, signPrivateKey]);

  const copyVerificationUrl = async () => {
    try {
      await copyToClipboard(verificationUrl);
      alert('Copied');
    } catch (e) {
      alert('Could not copy the text');
    }
  };

  const refreshConnectionButtonAction = useCallback(async () => {
    if (!refreshUserProfile || loading || !keys?.address || !signedPrivateKey) return;
    console.log(keys, signedPrivateKey);
    
    const refreshedUserProfile = await refreshUserProfile(signedPrivateKey);
    console.log(refreshedUserProfile);
    
    // if (!refreshUserProfile || loading) {
    //   return;
    // }
    // try {
    //   const refreshedUserProfile = await refreshUserProfile();
    //   if (refreshedUserProfile.verificationStatus !== BrightIdVerificationStatus.VERIFIED) {
    //     setTried(true);
    //     alert('Not Connected to Bright-ID!\nPlease Scan The QR Code or Use Copy Link Option.');
    //   } else {
    //     setTried(false);
    //     if (!!activeChain) {
    //       closeBrightIdModal();
    //     }
    //   }
    // } catch (ex) {
    //   alert('Error while connecting to BrightID sever!');
    //   setTried(true);
    // }
  }, [refreshUserProfile, loading, signedPrivateKey, keys]);

  if (userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

  return (
    <BrightConnectionModalWrapper
      className="bright-connection-modal flex flex-col items-center justify-center pt-4"
      data-testid="brightid-modal"
    >
      <p className="scan-qr-text text-sm text-white mb-3">Scan QR Code</p>
      {signedPrivateKey &&
        <span className='qr-code z-10 mb-4 rounded-md overflow-hidden'>
          <QRCode
            value={`brightid://link-verification/http:%2f%2fnode.brightid.org/unitapTest/${signedPrivateKey}`}
            data-testid="brightid-qr"
            ecLevel="L"
            qrStyle='dots'
            quietZone={1}
            size={170}
            eyeRadius={5}
          />
        </span>}
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
        <p className="text-space-green font-medium cursor-pointer hover:underline">Visit Link</p>
      </CopyLink>
      <span className="notice flex mb-3">
        <Icon className="mr-2" iconSrc="assets/images/modal/gray-danger.svg" />
        <p className="text-xs text-gray90 font-light"> Submit Verification after verifing with brighID app. </p>
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
            <p className="font-semibold">Verify Connection</p>
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
      title="Login with Your BrightID"
      size="small"
      isOpen={brightIdConnectionModalStatus !== BrightIdConnectionModalState.CLOSED}
      closeModalHandler={closeBrightIdConnectionModal}
    >
      <BrightConnectionModalBody />
    </Modal>
  );
};

export default BrightConnectionModal;
