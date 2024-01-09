"use client";

import { getChainList, getUserDonation } from "@/utils/api";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Chain } from "@/types";
import { useUserProfileContext } from "./userProfile";

const ProviderDashboardGasTapContext = createContext<{
  selectedProvideGasFee: boolean;
  handleSelectProvideGasFee: (selected: boolean) => void;
  chainList: Chain[];
}>({
  selectedProvideGasFee: false,
  handleSelectProvideGasFee: () => {},
  chainList: [],
});

export const ProviderDashboardGasTapContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [selectedProvideGasFee, setSelectProvideGasFee] = useState(false);
  const [chainList, setChainList] = useState<Chain[]>([]);
  const { userToken } = useUserProfileContext();
  const [userDonationList, setUserDonationList] = useState();
  const handleSelectProvideGasFee = (selected: boolean) => {
    setSelectProvideGasFee(selected);
  };

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getChainList();
      setChainList(newChainList);
    } catch (e) {}
  }, []);

  useEffect(() => {
    updateChainList();
  }, [updateChainList]);

  const handleUpdateUserDonationList = useCallback(async () => {
    if (!userToken) return;
    const res = await getUserDonation(userToken);
  }, [userToken]);

  useEffect(() => {
    userToken && handleUpdateUserDonationList();
  }, [handleUpdateUserDonationList, userToken]);

  return (
    <ProviderDashboardGasTapContext.Provider
      value={{ selectedProvideGasFee, handleSelectProvideGasFee, chainList }}
    >
      {children}
    </ProviderDashboardGasTapContext.Provider>
  );
};

export const useProviderDashboardGasTapContext = () =>
  useContext(ProviderDashboardGasTapContext);

export default ProviderDashboardGasTapContextProvider;
