import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { createUserProfile, getUserProfile } from "api";
import { UserProfile } from "types";
import { useWeb3React } from "@web3-react/core";

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  refreshUserProfile: (() => Promise<UserProfile>) | null;
  loading: boolean;
}>({ userProfile: null, refreshUserProfile: null, loading: false });

export function UserProfileProvider({ children }: PropsWithChildren<{}>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { account: address } = useWeb3React();

  const [loading, setLoading] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const refreshedUserProfile: UserProfile = await getUserProfile(userProfile!.address);
      setUserProfile(refreshedUserProfile);
      setLoading(false);
      return refreshedUserProfile;
    } catch (ex) {
      setLoading(false);
      throw ex;
    }
  }, [userProfile, setUserProfile]);

  useEffect(() => {
    const fun = async () => {
      if (address) {
        let newUserProfile: UserProfile | null = null;
        try {
          newUserProfile = await getUserProfile(address);
        } catch (ex) {
          newUserProfile = await createUserProfile(address);
        }
        setUserProfile(newUserProfile);
      }
    };
    fun();
  }, [address]);

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, loading }}>
      {children}
    </UserProfileContext.Provider>
  );
}
