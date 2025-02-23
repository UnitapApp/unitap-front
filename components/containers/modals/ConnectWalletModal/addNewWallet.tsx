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
        exists ? WalletState.SignMessage : WalletState.AddWalletFailed,
      );
    });
  }, [address, isSuccess, setWalletState]);

  return (
    <div className="text-center">
      <Image
        src="/quest/assets/images/provider-dashboard/arrow-left.svg"
        alt="back"
        className="absolute left-4 top-5 cursor-pointer"
        height={14}
        width={19}
        onClick={() => setWalletState(WalletState.UnknownWallet)}
      />
      <Icon iconSrc="/quest/assets/images/wallets.svg" alt="wallets" />
      <p className="mt-3 font-semibold">Login</p>

      <p className="mt-5 text-sm text-gray100">
        Here you have to connect to a wallet that is connected to an existing
        account.
      </p>

      <WalletProviderButton
        className="mt-8 from-[#F5841F33]"
        label="MetaMask"
        imageIcon="/quest/assets/images/modal/metamask-icon.svg"
        backgroundImage="/quest/assets/images/modal/metamask-bg.svg"
        onClick={() => {
          setWalletProvider(ConnectionProvider.Metamask);
          connect({
            connector: connectors.find(
              (connector) => connector.id === "injected",
            )!,
          });
        }}
      />
      <WalletProviderButton
        className="mt-3 from-[#16436f]"
        label="WalletConnect"
        backgroundImage="/quest/assets/images/modal/walletconnect-bg.svg"
        imageIcon="/quest/assets/images/modal/walletconnect-icon.svg"
        onClick={() => {
          setWalletProvider(ConnectionProvider.Walletconnect);
          connect({
            connector: connectors.find(
              (connector) => connector.id === "walletConnect",
            )!,
          });
        }}
      />
    </div>
  );
};

export default AddNewWalletBody;
