"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { FC } from "react";
import { ConnectionProvider } from ".";
import { WalletProviderButton } from "./walletPrompt";
import { useWalletConnection } from "@/utils/wallet";

const AddNewWalletBody: FC<{
  setWalletProvider: (provider: ConnectionProvider) => void;
}> = ({ setWalletProvider }) => {
  const { connect, connectors } = useWalletConnection();

  return (
    <div className="text-center">
      <Icon iconSrc="/assets/images/wallets.svg" alt="wallets" />
      <p className="font-semibold mt-3">Login</p>

      <p className="mt-5 text-gray100 text-sm">
        Here you have to connect to a wallet that is connected to an existing
        account.
      </p>

      <WalletProviderButton
        className="from-[#F5841F33] mt-8"
        label="MetaMask"
        imageIcon="/assets/images/modal/metamask-icon.svg"
        backgroundImage="/assets/images/modal/metamask-bg.svg"
        onClick={() => {
          setWalletProvider(ConnectionProvider.Metamask);
          connect({
            connector: connectors.find(
              (connector) => connector.id === "injected"
            ),
          });
        }}
      />
      <WalletProviderButton
        className="from-[#16436f] mt-3"
        label="WalletConnect"
        backgroundImage="/assets/images/modal/walletconnect-bg.svg"
        imageIcon="/assets/images/modal/walletconnect-icon.svg"
        onClick={() => {
          setWalletProvider(ConnectionProvider.Walletconnect);
          connect({
            connector: connectors.find(
              (connector) => connector.id === "walletConnect"
            ),
          });
        }}
      />
    </div>
  );
};

export default AddNewWalletBody;
