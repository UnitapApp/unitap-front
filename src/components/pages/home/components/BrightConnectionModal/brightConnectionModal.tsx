import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'components/pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from '../../../../../hooks/useUserProfile';
import { SecondaryButton } from 'components/basic/Button/button';

import { BrightIdVerificationStatus, UserProfile } from 'types';
import { useCallback, useState } from 'react';

import { getUserProfile } from 'api';


const BrightConnectionModal = () => {
  const {userProfile , setNewUserProfile} = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    alert('Copied');
  };

  const brightIdVerified = useMemo(
    () => userProfile!.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );
  const [loading, setLoading] = useState(false);

  const RefreshUserProfile = useCallback(async () => {
    if (brightIdVerified || loading) {
      return;
    }
    setLoading(true);
    try {
      const refreshedUserProfile:UserProfile = await getUserProfile(userProfile!.address);
      setNewUserProfile && setNewUserProfile(refreshedUserProfile);
      (refreshedUserProfile.verificationStatus === BrightIdVerificationStatus.VERIFIED)?
        alert('Connected to Bright-ID successfully!'):
        alert('Not Connected to Bright-ID!\nPlease Scan The QR Code or Use Copy Link Option.');
      // closeModalHandler();
    } catch (ex) {
      alert('Error while connecting to Bright-ID server!');
      console.log(ex);
    } finally {
      setLoading(false);
    }
  }, [brightIdVerified, loading, userProfile, setNewUserProfile]);

  return (
    <BrightConnectionModalWrapper data-testid="brightid-modal">
      <img src={process.env.PUBLIC_URL + '/assets/images/bright-icon.png'} alt="" />
      <Text fontSize="14" className="scan-qr-text">
        Scan QR Code
      </Text>
      <img
        data-testid="brightid-qr"
        className="qr-code"
        src={`http://api.qrserver.com/v1/create-qr-code/?data=${verificationUrl}`}
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
      <SecondaryButton
                    data-testid={`bright-id-connection-refresh-button`}
                    onClick={RefreshUserProfile}
                  >
                    {`Press Me When Scaned`}
      </SecondaryButton>
    </BrightConnectionModalWrapper>
  );
};

export default BrightConnectionModal;
