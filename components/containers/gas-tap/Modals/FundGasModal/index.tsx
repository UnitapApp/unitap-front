"use client";

import { FC, PropsWithChildren, createContext, useState } from "react";
import Content from "./content";
import Modal from "@/components/ui/Modal/modal";

export type FundContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chainId: number | undefined;
  setChainId: (chainId: number) => void;
};

export const FundContext = createContext<FundContextType>({
  isOpen: false,
  chainId: undefined,
  setIsOpen: () => undefined,
  setChainId: () => undefined,
});

const FundContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chainId, setChainId] = useState<number>();

  return (
    <>
      <Modal
        className="!z-20"
        title="Contribute Gas"
        isOpen={isOpen}
        closeModalHandler={() => setIsOpen(false)}
      >
        <Content initialChainId={chainId} />
      </Modal>
      <FundContext.Provider
        value={{
          isOpen,
          setIsOpen,
          chainId,
          setChainId,
        }}
      >
        {children}
      </FundContext.Provider>
    </>
  );
};

export default FundContextProvider;
