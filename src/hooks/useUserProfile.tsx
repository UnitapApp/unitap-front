import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { createUserProfile, getUserProfile } from '../api';
import { UserProfile } from '../types';

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  setNewUserProfile: ((newUserProfile : UserProfile)=> void) | null;
}>({userProfile:null,setNewUserProfile:null});

export function UserProfileProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const setNewUserProfile = (newUserProfile: UserProfile)=> {
    setUserProfile((userProfile) => newUserProfile);
  };
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

  return <UserProfileContext.Provider value={{userProfile, setNewUserProfile}}>{children} </UserProfileContext.Provider>;
}
