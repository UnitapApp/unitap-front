import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { createUserProfile, getUserProfile } from '../api';
import { UserProfile } from '../types';

export const UserProfileContext = createContext<UserProfile | null>(null);

export function UserProfileProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

  return <UserProfileContext.Provider value={userProfile}>{children} </UserProfileContext.Provider>;
}
