import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { getUserProfile, getUserProfileWithTokenAPI, getWeeklyChainClaimLimitAPI } from "api";
import { UserProfile } from "types";
import useToken from "./useToken";
import { useWeb3React } from "@web3-react/core";

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  refreshUserProfile: ((address: string, signature: string) => Promise<UserProfile>) | null;
  loading: boolean;
  lastUsedWalletAddress: string | null;
  weeklyChainClaimLimit: number | null;
}>({ userProfile: null, refreshUserProfile: null, loading: false, lastUsedWalletAddress: null, weeklyChainClaimLimit: null });

export function UserProfileProvider({ children }: PropsWithChildren<{}>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUsedWalletAddress, setlastUsedWalletAddress] = useState<string | null>(null);
  const [userToken, setToken] = useToken();
  const [weeklyChainClaimLimit, setWeeklyChainClaimLimit] = useState<number | null>(null);
  const { account } = useWeb3React();

  const setNewUserProfile = useCallback((newUserProfile: UserProfile) => {
    setUserProfile(newUserProfile);
    setToken(newUserProfile.token);
  }, [setToken]);

  const refreshUserProfile = async (address: string, signature: string) => {
    setLoading(true);
    try {
      const refreshedUserProfile: UserProfile = await getUserProfile(address, signature);
      setNewUserProfile(refreshedUserProfile)
      setLoading(false);
      return refreshedUserProfile;
    } catch (ex) {
      setLoading(false);
      throw ex;
    }
  };

  useEffect(() => {
    const getUserProfileWithToken = async () => {
      const userProfileWithToken: UserProfile = await getUserProfileWithTokenAPI(userToken!);
      setNewUserProfile(userProfileWithToken);
    }

    if (userToken && !userProfile) {
      getUserProfileWithToken();
    }
  }, [userToken, userProfile, setNewUserProfile])

  useEffect(() => {
    const getWeeklyChainClaimLimit = async () => {
      const newWeeklyChainClaimLimit: number = await getWeeklyChainClaimLimitAPI(userToken!);
      setWeeklyChainClaimLimit(newWeeklyChainClaimLimit)
    }

    if (userToken && userProfile) {
      getWeeklyChainClaimLimit()
    } else {
      setWeeklyChainClaimLimit(null)
    }
  }, [userProfile, userToken])

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setlastUsedWalletAddress(storedWalletAddress);
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem("walletAddress", account);
      setlastUsedWalletAddress(account);
    }
  }, [account]);

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, loading, lastUsedWalletAddress, weeklyChainClaimLimit }}>
      {children}
    </UserProfileContext.Provider>
  );
}
