"use client";

import { useRef, useState } from "react";
import { useOutsideClick } from "@/utils/hooks/dom";
import { useUserProfileContext } from "@/context/userProfile";
import { useUserWalletProvider, useWalletConnection } from "@/utils/wallet";
import { shortenAddress } from "@/utils";
import Image from "next/image";
import { useGlobalContext } from "@/context/globalProvider";

import Styles from "./auth.module.scss";

const RenderNavbarLoginBrightIdButton = () => {
  const { openBrightIdModal } = useGlobalContext();
  const { userProfileLoading } = useUserProfileContext();

  return (
    <>
      <button
        className="btn btn--sm btn--bright ml-6 !w-36 h-[28px] !py-0 align-baseline"
        data-testid="brightid-show-modal"
        onClick={() => !userProfileLoading && openBrightIdModal()}
      >
        {userProfileLoading ? "Connecting..." : "Connect BrightID"}
      </button>
    </>
  );
};

export const UserAuthStatus = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [dropDownActive, setDropDownActive] = useState(false);

  useOutsideClick(divRef, () => setDropDownActive(false));

  const { userProfile } = useUserProfileContext();

  return (
    <div ref={divRef} className="md:relative ml-5">
      <div
        onClick={() => {
          if (!userProfile) return;
          setDropDownActive(!dropDownActive);
        }}
        className="cursor-pointer ml-5 flex rounded-lg h-9 items-center justify-between bg-gray40 pr-0.5 pl-2 mr-3"
      >
        <span className="ml-2 hidden md:block text-sm">
          @ {userProfile?.username}
        </span>

        <span className="text-gray90 hidden md:block ml-8 mr-2">level: ? </span>
        <RenderNavbarWalletAddress />
      </div>

      {dropDownActive && <ProfileDropdown />}
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
  const { disconnect } = useWalletConnection();

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
      <span className="ml-3">{shortenAddress(wallet)}</span>
      <Image
        src="/assets/images/navbar/copy.svg"
        width={12}
        height={14}
        className="ml-3"
        alt="copy"
      />
      <Image
        width={8}
        height={8}
        src="/assets/images/navbar/link.svg"
        className="ml-4"
        alt="link"
      />

      {isActive && (
        <button
          onClick={() => disconnect()}
          className="ml-auto bg-gray50 rounded-lg px-5 py-1"
        >
          Disconnect
        </button>
      )}
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
  // #4BF2A200, #A89FE7AD, #A958A9, #DD40CD00
  return (
    <div className="absolute bg-gradient-to-l from-[#de68d8] via-[#8c91c7] to-[#243a3c] to-70% left-5 rounded-xl bg-cover text-white p-[2px] z-10 top-full mt-2">
      <div className="h-[260px] rounded-xl bg-gray30 w-full  md:w-[385px] max-w-full">
        <div
          className={`p-3 rounded-t-xl ${Styles.dropdownHeader} flex items-center justify-between font-normal text-sm`}
        >
          <button className="relative text-left px-2 h-8 flex items-center w-40 z-10 text-white">
            <img
              className="absolute inset-0 -z-10"
              src="/assets/images/navbar/logout-button.svg"
              alt=""
            />
            <p className="mb-1 font-semibold">@ {userProfile?.username}</p>
            <img
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

  let address = EVMWallet?.address;

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
        className={`btn btn--sm btn--address ${
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
