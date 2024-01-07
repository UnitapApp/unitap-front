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
  addModalState: string;
  setAddModalState: (value: string) => void;
}>({
  isAddModalOpen: false,
  setIsAddModalOpen: NullCallback,
  setAddModalState: NullCallback,
  addModalState: "",
});

export const useWalletManagementContext = () =>
  useContext(WalletManagementContext);

const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalState, setAddModalState] = useState("");

  useEffect(() => {
    if (isAddModalOpen) {
      setAddModalState("idle");
    }
  }, [isAddModalOpen]);

  return (
    <WalletManagementContext.Provider
      value={{
        isAddModalOpen,
        setIsAddModalOpen,
        addModalState,
        setAddModalState,
      }}
    >
      {children}

      <AddWalletModal />
    </WalletManagementContext.Provider>
  );
};

export default WalletProvider;
