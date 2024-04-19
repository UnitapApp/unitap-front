import Icon from "@/components/ui/Icon";
import { useWalletAccount, useWalletConnection } from "@/utils/wallet";
import Link from "next/link";
import { FC, MouseEventHandler, useEffect } from "react";
import { ConnectionProvider, WalletState } from ".";
import { checkUserExists } from "@/utils/api";

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
      className={`bg-gradient-to-r w-full rounded-[14px] p-[2px] ${className} to-gray60 to-30%`}
    >
      <div className="bg-gray30 rounded-xl flex overflow-hidden items-center">
        <Icon
          iconSrc={imageIcon}
          width="28px"
          height="28px"
          className="ml-3 my-3"
        />
        <span className="ml-5 font-bold text-sm">{label}</span>

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

    checkUserExists(address).then((exists) => {
      setIsNewUser(!exists);
      setWalletState(
        exists ? WalletState.SignMessage : WalletState.UnknownWallet
      );
    });
  }, [address, setIsNewUser, setWalletState, isSuccess, disconnect]);

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
      <div className="mt-10 text-sm flex items-center text-gray100">
        <p>New to Ethereum wallets?</p>
        <Link
          className="text-white ml-1 underline"
          href="https://ethereum.org/en/wallets/"
          target="_blank"
        >
          Learn more
        </Link>
        <Icon
          iconSrc="/assets/images/prize-tap/ic_link_white.svg"
          className="ml-1"
        />
      </div>
      <div className="mt-2 text-xs text-gray90">
        By continuing, you agree to our{" "}
        <Link
          target="_blank"
          href="https://guild.xyz/privacy-policy"
          className="underline"
        >
          Privacy Policy
        </Link>
      </div>
    </>
  );
};

export default WalletPrompt;
