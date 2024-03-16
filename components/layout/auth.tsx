"use client";

import { FC, useRef, useState } from "react";
import { useOutsideClick } from "@/utils/hooks/dom";
import { useUserProfileContext } from "@/context/userProfile";
import { useUserWalletProvider, useWalletConnection } from "@/utils/wallet";
import { shortenAddress } from "@/utils";
import Image from "next/image";
import { useGlobalContext } from "@/context/globalProvider";

import Styles from "./auth.module.scss";

import { Noto_Sans_Mono } from "next/font/google";
import Link from "next/link";
import { useWalletManagementContext } from "@/context/walletProvider";

// const NotoSansMono = Noto_Sans_Mono({
//   weight: ["400", "500"],
//   display: "swap",
//   adjustFontFallback: false,
//   subsets: ["latin"],
// });

export const UserAuthStatus = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [dropDownActive, setDropDownActive] = useState(false);

  useOutsideClick(divRef, () => setDropDownActive(false));

  const { userProfile } = useUserProfileContext();

  return (
    <div ref={divRef} className="ml-5 md:relative">
      <div className={`ml-5 mr-3`} id="profile-dropdown">
        <div className="relative flex cursor-pointer items-center justify-between rounded-2xl bg-gray40 p-[2px] pl-8">
          <Link href="/" className="absolute left-0 -ml-3">
            <Image
              src="/assets/images/auth-logo.svg"
              width={36}
              height={38}
              alt="unitap"
              className="h-14 w-12"
            />
          </Link>
          <div
            onClick={() => {
              if (!userProfile) return;
              setDropDownActive(!dropDownActive);
            }}
            className="relative z-20 flex cursor-pointer items-center justify-between pl-2 pr-[1px]"
          >
            <span className="ml-2 mr-16 hidden text-sm md:block">
              {userProfile?.username}
            </span>

            <RenderNavbarWalletAddress />
          </div>

          {dropDownActive && (
            <ProfileDropdown setDropDownActive={setDropDownActive} />
          )}
        </div>
      </div>
    </div>
  );
};

const WalletItem = ({
  wallet,
  isActive,
}: {
  wallet: string;
  isActive?: boolean;
}) => {
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);

    setCopyMessage("Copied");

    setTimeout(() => {
      if (setCopyMessage) setCopyMessage("");
    }, 3000);
  };

  return (
    <div
      className={
        "my-2 flex items-center text-sm hover:text-white " +
        (isActive ? "text-white" : "text-gray90")
      }
    >
      <span
        className={
          (isActive ? "bg-white" : "bg-gray90") + " h-2 w-2 rounded-full"
        }
      />
      <span className={`ml-3 font-normal`}>{shortenAddress(wallet)}</span>
      <div className="relative">
        {copyMessage && (
          <div className="absolute left-1/2 top-1/2 mb-3 w-16 -translate-x-1/2 translate-y-1/2 rounded-md border border-gray70 bg-gray10 py-2 text-center text-xs text-gray100">
            {copyMessage}
          </div>
        )}
        <Image
          onClick={() => copyToClipboard(wallet)}
          src="/assets/images/navbar/copy.svg"
          width={12}
          height={14}
          className="ml-3 cursor-pointer"
          alt="copy"
        />
      </div>
    </div>
  );
};

export const ProfileDropdown: FC<{
  setDropDownActive: (isActive: boolean) => void;
}> = ({ setDropDownActive }) => {
  const { userProfile, logout, setHoldUserLogout } = useUserProfileContext();

  const { connection } = useUserWalletProvider();

  const { setIsAddModalOpen, setDuplicateWalletRaiseError } =
    useWalletManagementContext();

  return (
    <div className="absolute left-5 top-full z-20 mt-2 cursor-default rounded-xl bg-gradient-to-l from-[#de68d8] via-[#8c91c7] to-[#243a3c] to-70% bg-cover p-[2px] text-white">
      <div className="h-[260px] w-full max-w-full rounded-xl  bg-gray30 md:w-[385px]">
        <div
          className={`rounded-t-xl p-3 ${Styles.dropdownHeader} flex items-center justify-between text-sm font-normal`}
        >
          <Link
            onClick={() => {
              setDropDownActive(false);
            }}
            href="/profile"
            className="mb-1 font-semibold"
          >
            <button className="relative z-10 flex h-8 w-40 items-center px-2 text-left text-white">
              <Image
                className="absolute inset-0 -z-10"
                src="/assets/images/navbar/logout-button.svg"
                alt="logout"
                width={147}
                height={28}
              />
              @ {userProfile?.username}
              <Image
                width={12}
                height={10}
                src="/assets/images/navbar/arrow-right.svg"
                className="mb-1 ml-auto mr-6"
                alt="arrow-right"
              />
            </button>
          </Link>

          <button
            onClick={() => {
              setDropDownActive(false);
              logout();
            }}
            className="relative z-10 rounded-lg px-5 py-2 text-xs"
          >
            <div className="absolute inset-0 -z-10 rounded-lg bg-gray20 opacity-50" />
            Log Out
          </button>
        </div>
        <div className="flex h-[194px] flex-col overflow-y-auto px-2">
          {userProfile?.wallets?.map((wallet, key) => (
            <WalletItem
              wallet={wallet.address}
              isActive={connection.address === wallet.address}
              key={key}
            />
          ))}
          <button
            onClick={() => {
              setDropDownActive(false);
              setIsAddModalOpen(true);
              setDuplicateWalletRaiseError(false);
              setHoldUserLogout(true);
            }}
            className="mt-auto w-full rounded-lg bg-gray60 py-2"
          >
            Add Or Switch Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export const RenderNavbarWalletAddress = () => {
  const { setIsWalletPromptOpen } = useGlobalContext();
  const { userProfile } = useUserProfileContext();

  const EVMWallet = userProfile?.wallets?.find(
    (wallet) => wallet.walletType === "EVM",
  );

  const { connection } = useUserWalletProvider();

  let address = connection.isConnected
    ? connection.address
    : EVMWallet?.address;

  if (!userProfile || !address)
    return (
      <button
        data-testid="wallet-connect"
        className="btn btn--sm btn--primary h-[28px] !w-36 !py-0 align-baseline"
        onClick={() => setIsWalletPromptOpen(true)}
      >
        Connect Wallet
      </button>
    );

  return (
    <>
      <button
        data-testid="wallet-address"
        className={`btn btn--sm btn--address font-normal tracking-wider ${
          connection.isConnected && "btn--address--active"
        } -mr-[1px] ml-0 h-10 !w-40 rounded-2xl !py-0 align-baseline md:ml-3`}
        onClick={(e) => {
          if (connection.isConnected) return;
          e.stopPropagation();
          setIsWalletPromptOpen(true);
        }}
      >
        {shortenAddress(address)}
      </button>
    </>
  );
};

export default UserAuthStatus;
