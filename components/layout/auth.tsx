"use client";

import { useRef, useState } from "react";
import { useOutsideClick } from "@/utils/hooks/dom";
import { useUserProfileContext } from "@/context/userProfile";
import { useUserWalletProvider, useWalletConnection } from "@/utils/wallet";
import { shortenAddress } from "@/utils";
import Image from "next/image";
import { useGlobalContext } from "@/context/globalProvider";

import Styles from "./auth.module.scss";

import { Noto_Sans_Mono } from "next/font/google";
import Link from "next/link";

const NotoSansMono = Noto_Sans_Mono({
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

export const UserAuthStatus = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [dropDownActive, setDropDownActive] = useState(false);

  useOutsideClick(divRef, () => setDropDownActive(false));

  const { userProfile } = useUserProfileContext();

  return (
    <div ref={divRef} className="md:relative ml-5">
      <div className={`ml-5 p-[1px] rounded-lg mr-3`} id="profile-dropdown">
        <div className="cursor-pointer flex rounded-lg h-9 items-center justify-between bg-gray40">
          <div
            onClick={() => {
              if (!userProfile) return;
              setDropDownActive(!dropDownActive);
            }}
            className="cursor-pointer relative z-20 pr-0.5 pl-2 flex rounded-lg h-9 items-center justify-between bg-gray40"
          >
            <span className="ml-2 hidden md:block text-sm">
              @ {userProfile?.username}
            </span>

            <span className="text-gray90 hidden md:block ml-8 mr-5">
              level: ?{" "}
            </span>
            <RenderNavbarWalletAddress />
          </div>

          {dropDownActive && <ProfileDropdown />}
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
  return (
    <div
      className={
        "flex hover:text-white text-sm my-5 items-center " +
        (isActive ? "text-white" : "text-gray90")
      }
    >
      <span
        className={
          (isActive ? "bg-white" : "bg-gray90") + " w-2 h-2 rounded-full"
        }
      />
      <span className={`ml-3 ${NotoSansMono.className}`}>
        {shortenAddress(wallet)}
      </span>
      {/* TODO: add tooltip for copying success */}
      <Image
        onClick={() => navigator.clipboard.writeText(wallet)}
        src="/assets/images/navbar/copy.svg"
        width={12}
        height={14}
        className="ml-3 cursor-pointer"
        alt="copy"
      />
      <Link
        className="ml-4"
        href={`https://debank.com/profile/${wallet}`}
        target="_blank"
      >
        <Image
          width={8}
          height={8}
          src="/assets/images/navbar/link.svg"
          alt="link"
        />
      </Link>
    </div>
  );
};

const ProfileDropdown = () => {
  const { userProfile } = useUserProfileContext();

  const { connection } = useUserWalletProvider();

  const onLogout = () => {
    localStorage.setItem("userToken", "");

    window.location.reload();
  };

  return (
    <div className="absolute bg-gradient-to-l cursor-default from-[#de68d8] via-[#8c91c7] to-[#243a3c] to-70% left-5 rounded-xl bg-cover text-white p-[2px] z-20 top-full mt-2">
      <div className="h-[260px] rounded-xl bg-gray30 w-full  md:w-[385px] max-w-full">
        <div
          className={`p-3 rounded-t-xl ${Styles.dropdownHeader} flex items-center justify-between font-normal text-sm`}
        >
          <button className="relative text-left px-2 h-8 flex items-center w-40 z-10 text-white">
            <Image
              className="absolute inset-0 -z-10"
              src="/assets/images/navbar/logout-button.svg"
              alt="logout"
              width={147}
              height={28}
            />
            <p className="mb-1 font-semibold">@ {userProfile?.username}</p>
            <Image
              width={12}
              height={10}
              src="/assets/images/navbar/arrow-right.svg"
              className="ml-auto mr-6 mb-1"
              alt="arrow-right"
            />
          </button>

          <button
            onClick={onLogout}
            className="rounded-lg relative text-xs z-10 px-5 py-2"
          >
            <div className="absolute rounded-lg -z-10 inset-0 bg-gray20 opacity-50" />
            Log Out
          </button>
        </div>
        <div className="px-4 overflow-y-auto h-[194px]">
          {userProfile?.wallets.map((wallet, key) => (
            <WalletItem
              wallet={wallet.address}
              isActive={connection.address === wallet.address}
              key={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RenderNavbarWalletAddress = () => {
  const { setIsWalletPromptOpen } = useGlobalContext();
  const { userProfile } = useUserProfileContext();

  const EVMWallet = userProfile?.wallets.find(
    (wallet) => wallet.walletType === "EVM"
  );

  const { connection } = useUserWalletProvider();

  let address = connection.isConnected
    ? connection.address
    : EVMWallet?.address;

  if (!address)
    return (
      <button
        data-testid="wallet-connect"
        className="btn btn--sm btn--primary !w-36 h-[28px] !py-0 align-baseline"
        onClick={() => setIsWalletPromptOpen(true)}
      >
        Connect Wallet
      </button>
    );

  return (
    <>
      <button
        data-testid="wallet-address"
        className={`btn ${
          NotoSansMono.className
        } btn--sm btn--address tracking-wider !font-[500] ${
          connection.isConnected && "btn--address--active"
        } !w-36 h-[28px] !py-0 ml-0 md:ml-3 align-baseline`}
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
