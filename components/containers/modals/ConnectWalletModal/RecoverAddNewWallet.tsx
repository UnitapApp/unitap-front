import Icon from "@/components/ui/Icon";
import { useWalletAccount, useWalletConnection } from "@/utils/wallet";
import { FC, MouseEventHandler, useEffect } from "react";
import { ConnectionProvider, WalletState } from ".";

export const WalletProviderButton: FC<{
  className?: string;
  backgroundImage: string;
  imageIcon: string;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ backgroundImage, imageIcon, label, className, onClick }) => {
  return (
    <button
      data-testid={`wallet-connect-method-${label}`}
      onClick={onClick}
      className={`w-full rounded-[14px] bg-gradient-to-r p-[2px] ${className} to-gray60 to-30%`}
    >
      <div className="flex items-center overflow-hidden rounded-xl bg-gray30">
        <Icon
          iconSrc={imageIcon}
          width="28px"
          height="28px"
          className="my-3 ml-3"
        />
        <span className="ml-5 text-sm font-bold">{label}</span>

        <Icon className="ml-auto" iconSrc={backgroundImage} />
      </div>
    </button>
  );
};

const WalletPrompt: FC<{
  setIsNewUser: (isNewUser: boolean) => void;
  setWalletProvider: (provider: ConnectionProvider) => void;
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletProvider, setWalletState, setIsNewUser }) => {
  const { connect, connectors, disconnect, isSuccess, isLoading } =
    useWalletConnection();

  const { address } = useWalletAccount();

  useEffect(() => {
    if (!address) return;
  }, [address, setIsNewUser, setWalletState, isSuccess, disconnect]);

  return (
    <>
      <Icon iconSrc="/assets/images/wallets.svg" alt="wallets" />

      <p className="mt-5 text-sm text-gray100">
        Add a new wallet to your account to recover account:{" "}
        <strong>@ alimak</strong>
      </p>

      <WalletProviderButton
        className="mt-8 from-[#F5841F33]"
        label="MetaMask"
        imageIcon="/assets/images/modal/metamask-icon.svg"
        backgroundImage="/assets/images/modal/metamask-bg.svg"
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
        backgroundImage="/assets/images/modal/walletconnect-bg.svg"
        imageIcon="/assets/images/modal/walletconnect-icon.svg"
        onClick={() => {
          setWalletProvider(ConnectionProvider.Walletconnect);
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

export default WalletPrompt;
