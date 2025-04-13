"use client";

import {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import DeleteWalletModal from "./components/deleteWalletModal";
import { NullCallback } from "@/utils";
import { Address } from "viem";

export const ProfileEditContext = createContext<{
  focusedWalletDeleteAddress: Address | null;
  setFocusedWalletDeleteAddress: (walletPk: Address | null) => void;
}>({
  focusedWalletDeleteAddress: null,
  setFocusedWalletDeleteAddress: NullCallback,
});

export const useProfileEditContext = () => useContext(ProfileEditContext);

const ProfileEditLayout: FC<
  PropsWithChildren & { socialAccounts: ReactNode }
> = ({ children, socialAccounts }) => {
  const [focusedWalletDeleteAddress, setFocusedWalletDeleteAddress] =
    useState<Address | null>(null);

  return (
    <ProfileEditContext.Provider
      value={{
        focusedWalletDeleteAddress,
        setFocusedWalletDeleteAddress,
      }}
    >
      {children}
      {socialAccounts}
      <DeleteWalletModal />
    </ProfileEditContext.Provider>
  );
};

export default ProfileEditLayout;
