import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { getRemainingClaimsAPI, getUserProfile, getUserProfileWithTokenAPI, getWeeklyChainClaimLimitAPI, setWalletAPI } from "api";
import { UserProfile } from "types";
import useToken from "./useToken";
import { useWeb3React } from "@web3-react/core";

export const UserProfileContext = createContext<{
  userProfile: UserProfile | null;
  refreshUserProfile: ((address: string, signature: string) => Promise<UserProfile>) | null;
  loading: boolean;
  weeklyChainClaimLimit: number | null;
  remainingClaims: number | null;
}>({ userProfile: null, refreshUserProfile: null, loading: false, weeklyChainClaimLimit: null, remainingClaims: null });

export function UserProfileProvider({ children }: PropsWithChildren<{}>) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [userToken, setToken] = useToken();
  const [weeklyChainClaimLimit, setWeeklyChainClaimLimit] = useState<number | null>(null);
  const [remainingClaims, setRemainingClaims] = useState<number | null>(null);

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

    const getRemainingClaims = async () => {
      const newRemainingClaims = await getRemainingClaimsAPI(userToken!);
      setRemainingClaims(newRemainingClaims.totalWeeklyClaimsRemaining)
    }

    if (userToken && userProfile) {
      getWeeklyChainClaimLimit()
      getRemainingClaims()
    } else {
      setWeeklyChainClaimLimit(null)
      setRemainingClaims(null)
    }
  }, [userProfile, userToken])

  useEffect(() => {
    if (account && userToken) {
      setWalletAPI(userToken, account, "EVM");
    }
  }, [account, userToken]);

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, loading, weeklyChainClaimLimit, remainingClaims }}>
      {children}
    </UserProfileContext.Provider>
  );
}
