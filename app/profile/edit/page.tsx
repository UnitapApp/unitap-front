"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { shortenAddress } from "@/utils";
import { checkUsernameValid, setUsernameApi } from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Address, isAddressEqual } from "viem";
import { Noto_Sans_Mono } from "next/font/google";
import { useWalletManagementContext } from "@/context/walletProvider";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useProfileEditContext } from "./layout";

const NotoSansMono = Noto_Sans_Mono({
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

export const Wallet: FC<{
  address: string;
  isActive: boolean;
  isDeleteAllowed: boolean;
}> = ({ address, isActive, isDeleteAllowed }) => {
  const { setFocusedWalletDeleteAddress } = useProfileEditContext();

  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);

    setCopyMessage("Copied");

    setTimeout(() => {
      if (setCopyMessage) setCopyMessage("");
    }, 3000);
  };

  return (
    <div className="p-4 flex bg-gray40 border-2 items-center border-gray50 rounded-xl">
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-space-green" : "bg-error"
        }`}
      ></span>
      <p className={`ml-5 text-sm font-normal ${NotoSansMono.className}`}>
        {shortenAddress(address)}
      </p>
      <div className="ml-4 relative">
        {copyMessage && (
          <div className="absolute top-1/2 translate-y-1/2 mb-3 w-16 left-1/2 -translate-x-1/2 py-2 bg-gray10 text-gray100 text-center border-gray70 border rounded-md text-xs">
            {copyMessage}
          </div>
        )}
        <Image
          onClick={() => copyToClipboard(address)}
          src="/assets/images/navbar/copy.svg"
          width={12}
          height={14}
          className="cursor-pointer"
          alt="copy"
        />
      </div>

      {isDeleteAllowed && (
        <Image
          onClick={() => setFocusedWalletDeleteAddress(address as Address)}
          width={16}
          height={18}
          src="/assets/images/up-profile/trashcan.svg"
          className="ml-auto opacity-70 cursor-pointer hover:opacity-100"
          alt="delete"
        />
      )}
    </div>
  );
};

const EditPage = () => {
  const { userProfile, updateUsername, userToken, setHoldUserLogout } =
    useUserProfileContext();
  const { address } = useWalletAccount();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUserEditEnabled, setIsUserEditEnabled] = useState(false);

  const { setIsAddModalOpen, setDuplicateWalletRaiseError } =
    useWalletManagementContext();

  const onSubmit = async () => {
    if (!userToken) return;
    setError("");
    setLoading(true);
    try {
      await setUsernameApi(username, userToken);
      updateUsername(username);
      setIsUserEditEnabled(false);
    } catch (e) {
      if (!(e instanceof AxiosError) || !e.response) return;
      setError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.username) {
      setUsername(userProfile?.username);
    }
  }, [userProfile?.username]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!userToken || username === userProfile?.username || !username) return;
      setLoading(true);
      checkUsernameValid(username, userToken)
        .catch((err) => {
          if (err instanceof AxiosError) {
            setError(
              err.response?.data.message || err.response?.data.username?.[0]
            );
            return;
          }

          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, 300);

    setError("");
    return () => clearTimeout(timerId);
  }, [userProfile?.username, userToken, username]);

  return (
    <div>
      <div className="bg-gray20 mt-10 rounded-xl p-5 flex items-center">
        <Link href="/profile" className="mr-auto">
          <Icon iconSrc="/assets/images/up-profile/back.svg" />
        </Link>
        <h4 className="mr-auto">Edit Profile</h4>
      </div>

      <div className="mt-5 p-5 flex bg-cover rounded-xl items-center bg-[url('/assets/images/up-profile/profile-landing.svg')] gap-10">
        <Image
          src="/assets/images/landing/profile-img.svg"
          alt="profile-unitap"
          width={64}
          height={79}
        />

        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`border border-solid w-72 px-4 py-3 rounded-xl bg-gray50 ${
                error ? "border-error" : "border-gray70"
              } disabled:opacity-60`}
              disabled={!isUserEditEnabled}
            />
            <button
              disabled={
                isUserEditEnabled
                  ? username === userProfile?.username ||
                    loading ||
                    !username ||
                    !!error
                  : false
              }
              onClick={
                isUserEditEnabled ? onSubmit : () => setIsUserEditEnabled(true)
              }
              className="absolute right-3 disabled:opacity-60 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#4bf2a229] via-[#e1c3f44f] to-[#dd40cd4f] rounded-lg px-3 py-1"
            >
              {loading ? (
                <LoadingSpinner />
              ) : isUserEditEnabled ? (
                "Save"
              ) : (
                "Edit"
              )}
            </button>
          </div>
          {!!error && (
            <p className="text-xs pl-2 w-[250px] text-error">{error}</p>
          )}
        </div>
      </div>

      <div className="mt-5 bg-gray20 rounded-xl p-5">
        <p>
          Wallets{" "}
          <small className="text-gray90">
            ({userProfile?.wallets.length ?? 0}/10)
          </small>
        </p>

        <div className="mt-10">
          <div className="grid grid-cols-2 gap-4">
            {!!userProfile &&
              userProfile.wallets.map((wallet, key) => (
                <Wallet
                  address={wallet.address}
                  key={key}
                  isActive={
                    !!address &&
                    isAddressEqual(
                      address as Address,
                      wallet.address as Address
                    )
                  }
                  isDeleteAllowed={
                    userProfile.wallets.length > 1 &&
                    !(
                      !!address &&
                      isAddressEqual(
                        address as Address,
                        wallet.address as Address
                      )
                    )
                  }
                />
              ))}
            <button
              onClick={() => {
                setHoldUserLogout(true);
                setIsAddModalOpen(true);
                setDuplicateWalletRaiseError(true);
              }}
              className="px-5 py-5 flex items-center rounded-xl border-2 border-gray70"
              type="button"
            >
              <span className="ml-auto text-sm font-semibold">
                Add New Wallet
              </span>
              <span className="ml-auto">
                <Image
                  width={16}
                  height={16}
                  src="/assets/images/up-profile/plus.svg"
                  alt="plus"
                  className="w-[16px] h-[16px]"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
