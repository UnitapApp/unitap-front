"use client";

import Modal from "@/components/ui/Modal/modal";
import { useGlobalContext } from "@/context/globalProvider";
import { FC, useEffect, useMemo, useState } from "react";
import WalletPrompt from "./walletPrompt";
import WalletConnecting from "./walletConnecting";
import UnknownWalletBody from "./unknownWallet";
import AddNewWalletBody from "./addNewWallet";
import SetUsernameBody from "./setUsername";
import AddNewWalletSuccess from "./addNewWalletSuccess";
import AddNewWalletFailed from "./addNewWalletFailed";
import LoginSuccessBody from "./LoginSuccess";
import { parseCookies } from "@/utils/cookies";
import { useDisconnect } from "wagmi";

export enum ConnectionProvider {
  Metamask,
  Walletconnect,
}

export const getWalletProviderInfo = (provider: ConnectionProvider) => {
  if (provider === ConnectionProvider.Metamask) {
    return {
      imageUrl: "/assets/images/modal/metamask-icon.svg",
      label: "Metamask",
      loadingImage: "/assets/images/modal/wallet-metamask-loading.svg",
    };
  }

  return {
    imageUrl: "/assets/images/modal/walletconnect-icon.svg",
    label: "WalletConnect",
    loadingImage: "/assets/images/modal/wallet-connect-loading.svg",
  };
};

export const RenderWalletBody: FC<{
  setWalletTitle: (title: string) => void;
}> = ({ setWalletTitle }) => {
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.Prompt,
  );

  const [previousState, setPreviousState] = useState<WalletState | null>(null);

  const cookies = useMemo(() => parseCookies(), []);

  const [isNewUser, setIsNewUser] = useState(false);

  const [walletProvider, setWalletProvider] = useState<ConnectionProvider>(
    ConnectionProvider.Metamask,
  );

  const currentWallet = useMemo(() => {
    if (walletProvider === ConnectionProvider.Metamask) {
      return {
        imageUrl: "/assets/images/modal/metamask-icon.svg",
        label: "Metamask",
        loadingImage: "/assets/images/modal/wallet-metamask-loading.svg",
      };
    }

    return {
      imageUrl: "/assets/images/modal/walletconnect-icon.svg",
      label: "WalletConnect",
      loadingImage: "/assets/images/modal/wallet-connect-loading.svg",
    };
  }, [walletProvider]);

  const setNewWalletState = (state: WalletState) => {
    setPreviousState(walletState);
    setWalletState(state);
  };

  useEffect(() => {
    if (cookies["tutorial"] === "false" || !isNewUser) return;

    document.cookie = "tutorial=true;path=/;";
  }, [cookies, isNewUser]);

  useEffect(() => {
    setWalletTitle(walletStateTitles[walletState]);
  }, [setWalletTitle, walletState]);

  if (walletState === WalletState.Prompt)
    return (
      <WalletPrompt
        setWalletState={(state) => {
          setPreviousState(walletState);
          setWalletState(state);
        }}
        setIsNewUser={setIsNewUser}
        setWalletProvider={setWalletProvider}
      />
    );

  if (walletState === WalletState.SignMessage)
    return (
      <WalletConnecting
        previousWalletState={previousState}
        isNewUser={isNewUser}
        imageUrl={currentWallet.imageUrl}
        label={currentWallet.label}
        loadingImage={currentWallet.loadingImage}
        setWalletState={setNewWalletState}
      />
    );

  if (walletState === WalletState.UnknownWallet)
    return <UnknownWalletBody setWalletState={setNewWalletState} />;

  if (walletState === WalletState.AddNewWallet)
    return (
      <AddNewWalletBody
        setWalletState={setNewWalletState}
        setWalletProvider={setWalletProvider}
      />
    );

  if (walletState === WalletState.LoggedIn)
    return <LoginSuccessBody isNewUser={isNewUser} />;

  if (walletState === WalletState.SetUsername)
    return (
      <SetUsernameBody
        setWalletState={setNewWalletState}
        walletProvider={walletProvider}
      />
    );

  if (walletState === WalletState.AddWalletSuccess)
    return <AddNewWalletSuccess />;

  if (walletState === WalletState.AddWalletFailed)
    return <AddNewWalletFailed setWalletState={setNewWalletState} />;
};

export enum WalletState {
  Prompt,
  SignMessage,
  MetamaskSignMessage,
  WalletConnectSignMessage,
  SetUsername,
  LoggedIn,
  UnknownWallet,
  AddNewWallet,
  AddWalletFailed,
  AddWalletSuccess,
}

const walletStateTitles = {
  [WalletState.Prompt]: "Conenct Wallet",
  [WalletState.SignMessage]: "Conenct Wallet",
  [WalletState.MetamaskSignMessage]: "Connect Metamask",
  [WalletState.WalletConnectSignMessage]: "Connect WalletConnect",
  [WalletState.LoggedIn]: "Conenct Wallet",
  [WalletState.UnknownWallet]: "Select Wallet State",
  [WalletState.AddNewWallet]: "Add Wallet to an Existing Account",
  [WalletState.SetUsername]: "Register",
  [WalletState.AddWalletFailed]: "Conenct Wallet",
  [WalletState.AddWalletSuccess]: "Adding wallet",
};

export const ConnectWalletModal = () => {
  const { isWalletPromptOpen, setIsWalletPromptOpen } = useGlobalContext();
  const [title, setTitle] = useState(walletStateTitles[WalletState.Prompt]);

  const { disconnect, isPending } = useDisconnect();

  const setWalletTitle = (title: string) => setTitle(title);

  useEffect(() => {
    if (!isWalletPromptOpen) return;

    disconnect();
  }, [disconnect, isWalletPromptOpen]);

  return (
    <Modal
      title={title}
      size="small"
      isOpen={isWalletPromptOpen && !isPending}
      closeModalHandler={() => setIsWalletPromptOpen(false)}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <RenderWalletBody setWalletTitle={setWalletTitle} />
      </div>
    </Modal>
  );
};
