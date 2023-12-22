import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { useWalletManagementContext } from "@/context/walletProvider";
import { WalletProviderButton } from "../modals/ConnectWalletModal/walletPrompt";
import { useWalletAccount, useWalletConnection } from "@/utils/wallet";
import { useUserProfileContext } from "@/context/userProfile";
import { useSignMessage } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConnectionProvider } from "../modals/ConnectWalletModal";
import WalletConnecting from "../modals/ConnectWalletModal/walletConnecting";
import {
  Button,
  ClaimButton,
  PrimaryOutlinedButton,
} from "@/components/ui/Button/button";

const AddWalletModal = () => {
  const { isAddModalOpen, setIsAddModalOpen } = useWalletManagementContext();

  return (
    <Modal
      size="small"
      title="Add New Wallet"
      closeModalHandler={() => setIsAddModalOpen(false)}
      isOpen={isAddModalOpen}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <AddWalletPrompt />
      </div>
    </Modal>
  );
};

export const AddWalletPrompt = () => {
  const { connect, connectors, isSuccess } = useWalletConnection();

  const { userProfile } = useUserProfileContext();

  if (isSuccess) return <WalletVerify />;

  return (
    <>
      <Icon iconSrc="/assets/images/wallets.svg" alt="wallets" />

      <p className="mt-5 text-gray100 text-sm">
        Select what wallet you want to connect below:
      </p>

      <WalletProviderButton
        className="from-[#F5841F33] mt-8"
        label="MetaMask"
        imageIcon="/assets/images/modal/metamask-icon.svg"
        backgroundImage="/assets/images/modal/metamask-bg.svg"
        onClick={() => {
          connect({
            connector: connectors.find(
              (connector) => connector.id === "injected"
            ),
          });
        }}
      />
      <WalletProviderButton
        className="from-[#3396FF] mt-3"
        label="WalletConnect"
        backgroundImage="/assets/images/modal/walletconnect-bg.svg"
        imageIcon="/assets/images/modal/walletconnect-icon.svg"
        onClick={() => {
          connect({
            connector: connectors.find(
              (connector) => connector.id === "walletConnect"
            ),
          });
        }}
      />
    </>
  );
};

const WalletVerify = () => {
  const { address, connector } = useWalletAccount();
  const [error, setError] = useState("");

  const message = useMemo(
    () => ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error]
  );

  const isMounted = useRef(false);

  const onSuccess = (hashed: string) => {
    console.log(hashed);
  };

  const { isError, signMessageAsync } = useSignMessage({
    message,
    onSuccess,
  });

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

  useEffect(() => {
    if (isMounted.current) return;

    signMessageAsync({
      message,
    }).catch((err) => setError(err.message));

    isMounted.current = true;
    return () => {};
  }, [message, signMessageAsync]);

  if (error)
    return (
      <div>
        <div className="text-center">
          <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
            <Icon
              iconSrc={currentWallet.imageUrl}
              alt={currentWallet.label}
              width="60px"
              height="60px"
            />
          </div>

          <p className="font-semibold text-warn mt-8">Sign message Failed</p>

          <p className="mt-2 text-gray100 text-xs">{error}</p>

          <ClaimButton
            onClick={() => {
              isMounted.current = false;
              setError("");
            }}
            className="mx-auto !w-full mt-7"
          >
            <p>Try Again</p>
          </ClaimButton>
        </div>
      </div>
    );

  return (
    <WalletConnecting
      imageUrl={currentWallet.imageUrl}
      label={currentWallet.label}
      loadingImage={currentWallet.loadingImage}
    />
  );
};

export default AddWalletModal;
