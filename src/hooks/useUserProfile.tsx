import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { createUserProfile, getUserProfile } from '../api';
import { BrightIdVerificationStatus, UserProfile } from '../types';

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  refreshUserProfile: (()=> void) | null;
  loading: boolean;
}>({userProfile:null,refreshUserProfile:null,loading: false});

export function UserProfileProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    if (userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED || loading) {
      return;
    }
    setLoading(true);
    try {
      const refreshedUserProfile:UserProfile = await getUserProfile(userProfile!.address);
      setUserProfile(refreshedUserProfile);
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
  }, [loading, userProfile, setUserProfile]);

  useEffect(() => {
    let mounted = true;
    const fun = async () => {
      if (address) {
        let newUserProfile: UserProfile | null = null;
        try {
          newUserProfile = await getUserProfile(address);
        } catch (ex) {
          newUserProfile = await createUserProfile(address);
        }
        if (mounted) {
          setUserProfile(newUserProfile);
        }
      }
    };
    fun();
    return () => {
      mounted = false;
    };
  }, [address]);

  return <UserProfileContext.Provider value={{userProfile, refreshUserProfile, loading}}>{children} </UserProfileContext.Provider>;
}
