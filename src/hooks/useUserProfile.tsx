import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { createUserProfile, getUserProfile } from 'api';
import { UserProfile } from 'types';

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  refreshUserProfile: (() => Promise<UserProfile | null | undefined>) | null;
  loading: boolean;
}>({ userProfile: null, refreshUserProfile: null, loading: false });

export function UserProfileProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const refreshedUserProfile: UserProfile = await getUserProfile(userProfile!.address);
      setUserProfile(refreshedUserProfile);
      setLoading(false);
      return refreshedUserProfile;
    } catch (ex) {
      console.log(ex);
      setLoading(false);
      throw ex;
    }
  }, [userProfile, setUserProfile]);

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

  return <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, loading }}>{children} </UserProfileContext.Provider>;
}
