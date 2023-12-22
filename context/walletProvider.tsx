"use client";

import AddWalletModal from "@/components/containers/profile/addWalletModal";
import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDisconnect } from "wagmi";

export const WalletManagementContext = createContext<{
  isAddModalOpen: boolean;
  setIsAddModalOpen: (value: boolean) => void;
}>({
  isAddModalOpen: false,
  setIsAddModalOpen: NullCallback,
});

export const useWalletManagementContext = () =>
  useContext(WalletManagementContext);

const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isAddModalOpen) disconnect();
  }, [disconnect, isAddModalOpen]);

  return (
    <WalletManagementContext.Provider
      value={{
        isAddModalOpen,
        setIsAddModalOpen,
      }}
    >
      {children}

      <AddWalletModal />
    </WalletManagementContext.Provider>
  );
};

export default WalletProvider;
