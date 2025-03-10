"use client";

import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { useWalletManagementContext } from "@/context/walletProvider";
import { WalletProviderButton } from "../../../components/containers/modals/ConnectWalletModal/walletPrompt";
import { useWalletAccount, useWalletConnection } from "@/utils/wallet";
import { useDisconnect } from "wagmi";
import { FC, useEffect, useMemo, useState } from "react";
import SignPrompt from "./signPrompt";
import { WalletState } from "../../../components/containers/modals/ConnectWalletModal";
import { useUserProfileContext } from "@/context/userProfile";

const AddWalletModal = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addModalState,
    duplicateWalletRaiseError,
  } = useWalletManagementContext();

  const { setHoldUserLogout } = useUserProfileContext();

  useEffect(() => {
    if (isAddModalOpen) return;

    setHoldUserLogout(false);
  }, [isAddModalOpen, setHoldUserLogout]);

  return (
    <Modal
      size="small"
      title={
        duplicateWalletRaiseError ? "Add New Wallet" : "Add Or Switch Wallet"
      }
      closeModalHandler={() => setIsAddModalOpen(false)}
      isOpen={isAddModalOpen}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        {addModalState === "complete" ? (
          <WalletAddSuccess />
        ) : (
          <AddWalletPrompt />
        )}
      </div>
    </Modal>
  );
};

export const AddWalletPrompt = () => {
  const { connect, connectors, isSuccess } = useWalletConnection();

  const [isConnected, setIsConnected] = useState(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsConnected(isSuccess);
  }, [isSuccess]);

  if (isConnected) return <WalletVerify setIsConnected={setIsConnected} />;

  return (
    <>
      <Icon iconSrc="/assets/images/wallets.svg" alt="wallets" />

      <p className="mt-5 text-sm text-gray100">
        Select what wallet you want to connect below:
      </p>

      <WalletProviderButton
        className="mt-8 from-[#F5841F33]"
        label="MetaMask"
        imageIcon="/assets/images/modal/metamask-icon.svg"
        backgroundImage="/assets/images/modal/metamask-bg.svg"
        onClick={() => {
          disconnect();
          connect({
            connector: connectors.find(
              (connector) => connector.id === "injected",
            )!,
          });
        }}
      />
      <WalletProviderButton
        className="mt-3 from-[#3396FF]"
        label="WalletConnect"
        backgroundImage="/assets/images/modal/walletconnect-bg.svg"
        imageIcon="/assets/images/modal/walletconnect-icon.svg"
        onClick={() => {
          disconnect();
          connect({
            connector: connectors.find(
              (connector) => connector.id === "walletConnect",
            )!,
          });
        }}
      />
    </>
  );
};

const WalletVerify: FC<{ setIsConnected: (arg: boolean) => void }> = ({
  setIsConnected,
}) => {
  const { address, connector } = useWalletAccount();
  const [error, setError] = useState("");
  const [walletState, setWalletState] = useState<WalletState>();
  const { setAddModalState } = useWalletManagementContext();

  const currentWallet = useMemo(() => {
    if (connector?.id === "injected") {
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
  }, [connector]);

  return (
    <SignPrompt
      setAddModalState={setAddModalState}
      imageUrl={currentWallet.imageUrl}
      label={currentWallet.label}
      loadingImage={currentWallet.loadingImage}
      setWalletState={setWalletState}
      error={error}
      setError={setError}
      setIsConnected={setIsConnected}
    />
  );
};

const WalletAddSuccess = () => {
  const { connector } = useWalletAccount();

  const currentWallet = useMemo(() => {
    if (connector?.id === "injected") {
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
  }, [connector]);

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-space-green bg-[#4C4C5C]">
          <Icon
            iconSrc={currentWallet.imageUrl}
            alt={currentWallet.label}
            width="60px"
            height="60px"
          />

          <Icon
            iconSrc="/assets/images/check-circle-space-green.svg"
            alt="check green"
            className="absolute -right-2 bottom-4"
            width="28px"
            height="28px"
          />
        </div>

        <p className="mt-8 flex items-center justify-center font-semibold text-space-green">
          <Icon
            iconSrc="/assets/images/check-circle-space-green.svg"
            alt="check green"
            className="mr-2"
            width="20px"
            height="20px"
          />
          Connected!
        </p>

        <p className="mb-10 mt-2 text-sm text-gray100">
          Your wallet connected successfully!
        </p>
      </div>
    </div>
  );
};

export default AddWalletModal;
