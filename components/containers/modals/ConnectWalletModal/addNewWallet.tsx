"use client";

import Icon from "@/components/ui/Icon";
import { FC, useEffect } from "react";
import { ConnectionProvider, WalletState } from ".";
import { WalletProviderButton } from "./walletPrompt";
import { useWalletAccount, useWalletConnection } from "@/utils/wallet";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import { checkUserExists } from "@/utils/api";

const AddNewWalletBody: FC<{
  setWalletProvider: (provider: ConnectionProvider) => void;
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletProvider, setWalletState }) => {
  const { connect, connectors, isSuccess } = useWalletConnection();
  const { disconnect } = useDisconnect();

  const { address } = useWalletAccount();

  useEffect(() => {
    if (disconnect) disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (!isSuccess || !address) return;

    checkUserExists(address).then((exists) => {
      setWalletState(
        exists ? WalletState.SignMessage : WalletState.AddWalletFailed
      );
    });
  }, [address, isSuccess, setWalletState]);

  return (
    <div className="text-center">
      <Image
        src="/assets/images/provider-dashboard/arrow-left.svg"
        alt="back"
        className="absolute top-5 left-4 cursor-pointer"
        height={14}
        width={19}
        onClick={() => setWalletState(WalletState.UnknownWallet)}
      />
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
            )!,
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
            )!,
          });
        }}
      />
    </div>
  );
};

export default AddNewWalletBody;
