"use client";

import { APIErrorsSource, Settings, UserProfile } from "@/types";
import { getUserProfile, getUserProfileWithTokenAPI } from "@/utils/api/auth";
import useLocalStorageState from "@/utils/hooks";
import { AxiosError } from "axios";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ErrorsContext } from "./errorsProvider";
import {
  getRemainingClaimsAPI,
  getWeeklyChainClaimLimitAPI,
  setWalletAPI,
} from "@/utils/api";
import { useMediumRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
import { IntervalType } from "@/constants";
import { useWalletAccount } from "@/utils/wallet";
import { NullCallback } from "@/utils";

export const UserProfileContext = createContext<
  Partial<Settings> & {
    userProfile: UserProfile | null;
    refreshUserProfile:
      | ((address: string, signature: string) => Promise<void>)
      | null;
    loading: boolean;
    remainingClaims: number | null;
    userProfileLoading: boolean;
    nonEVMWalletAddress: string;
    setNonEVMWalletAddress: (address: string) => void;
    userToken: string | null;
    isGasTapAvailable: boolean;
    updateUsername: (username: string) => void;
  }
>({
  userProfile: null,
  isGasTapAvailable: true,
  refreshUserProfile: null,
  loading: false,
  tokentapRoundClaimLimit: 0,
  gastapRoundClaimLimit: 0,
  remainingClaims: null,
  userProfileLoading: false,
  nonEVMWalletAddress: "",
  userToken: null,
  setNonEVMWalletAddress: NullCallback,
  updateUsername: NullCallback,
});

export const UserContextProvider: FC<
  PropsWithChildren & { settings: Settings }
> = ({ children, settings }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [userToken, setToken] = useLocalStorageState("userToken");

  const { address } = useWalletAccount();

  const { addError } = useContext(ErrorsContext);

  const [remainingClaims, setRemainingClaims] = useState<number | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);
  const [nonEVMWalletAddress, setNonEVMWalletAddress] = useState("");

  const [weeklyClaimSettings, setWeeklyClaimSettings] =
    useState<Settings>(settings);

  const updateUsername = (username: string) => {
    setUserProfile({
      ...userProfile!,
      username,
    });
  };

  const refreshUserProfile = async (address: string, signature: string) => {
    setLoading(true);
    getUserProfile(address, signature)
      .then((refreshedUserProfile: UserProfile) => {
        setUserProfile(refreshedUserProfile);
        setToken(refreshedUserProfile.token);
        return refreshedUserProfile;
      })
      .catch((ex: AxiosError) => {
        if (ex.response?.status === 403 || ex.response?.status === 409) {
          addError({
            source: APIErrorsSource.BRIGHTID_CONNECTION_ERROR,
            message: (ex.response as any).data.message,
            statusCode: ex.response.status,
          });
        }
        throw ex;
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const getUserProfileWithToken = async () => {
      setUserProfileLoading(true);
      try {
        const userProfileWithToken: UserProfile =
          await getUserProfileWithTokenAPI(userToken!);
        setUserProfile(userProfileWithToken);

        document.cookie = `userToken=${userToken!}`;
      } finally {
        setUserProfileLoading(false);
      }
    };

    if (userToken && !userProfile) {
      getUserProfileWithToken();
    }
  }, [userToken, userProfile, setUserProfile]);

  useEffect(() => {
    if (!address || !userProfile) return;

    if (
      userProfile.wallets.find(
        (item) => item.walletType === "EVM" && item.address === address
      )
    )
      return;

    setWalletAPI(userToken!, address, "EVM");
  }, [address, userProfile, userToken]);

  const getWeeklyChainClaimLimit = async () => {
    const res = await getWeeklyChainClaimLimitAPI();
    setWeeklyClaimSettings(res);
  };

  const getRemainingClaims = async () => {
    const newRemainingClaims = await getRemainingClaimsAPI(userToken!);
    setRemainingClaims(newRemainingClaims.totalRoundClaimsRemaining);
  };

  useMediumRefresh(getWeeklyChainClaimLimit, [getWeeklyChainClaimLimit]);

  useRefreshWithInitial(
    () => {
      if (userToken && userProfile) {
        getRemainingClaims();
      } else {
        setRemainingClaims(null);
      }
    },
    IntervalType.MEDIUM,
    [userToken && userProfile]
  );

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isGasTapAvailable: weeklyClaimSettings.isGasTapAvailable,
        refreshUserProfile,
        loading,
        gastapRoundClaimLimit: weeklyClaimSettings.gastapRoundClaimLimit,
        tokentapRoundClaimLimit: weeklyClaimSettings.tokentapRoundClaimLimit,
        prizetapRoundClaimLimit: weeklyClaimSettings.prizetapRoundClaimLimit,
        userToken,
        remainingClaims,
        userProfileLoading,
        nonEVMWalletAddress,
        setNonEVMWalletAddress,
        updateUsername,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => useContext(UserProfileContext);
