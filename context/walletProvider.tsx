"use client";

import AddWalletModal from "@/app/profile/components/addWalletModal";
import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const WalletManagementContext = createContext<{
  isAddModalOpen: boolean;
  setIsAddModalOpen: (value: boolean) => void;
  addModalState: string;
  setAddModalState: (value: string) => void;
  duplicateWalletRaiseError: boolean;
  setDuplicateWalletRaiseError: (arg: boolean) => void;
}>({
  isAddModalOpen: false,
  setIsAddModalOpen: NullCallback,
  setAddModalState: NullCallback,
  addModalState: "",
  duplicateWalletRaiseError: false,
  setDuplicateWalletRaiseError: NullCallback,
});

export const useWalletManagementContext = () =>
  useContext(WalletManagementContext);

const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalState, setAddModalState] = useState("");
  const [duplicateWalletRaiseError, setDuplicateWalletRaiseError] =
    useState(false);

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
        duplicateWalletRaiseError,
        setDuplicateWalletRaiseError,
      }}
    >
      {children}

      <AddWalletModal />
    </WalletManagementContext.Provider>
  );
};

export default WalletProvider;
