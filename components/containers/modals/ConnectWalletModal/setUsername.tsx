"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Input from "@/components/ui/input";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { ConnectionProvider, WalletState } from ".";
import { checkUsernameValid, setUsernameApi } from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { useUserProfileContext } from "@/context/userProfile";
import { AxiosError } from "axios";

const SetUsernameBody: FC<{
  walletProvider: ConnectionProvider;
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState }) => {
  const { address } = useWalletAccount();
  const { userToken, updateUsername, userProfile } = useUserProfileContext();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!address || !userToken) return;

    setError("");
    setLoading(true);
    try {
      await setUsernameApi(username, userToken);
      updateUsername(username);
      setWalletState(WalletState.LoggedIn);
    } catch (e) {
      if (!(e instanceof AxiosError) || !e.response) return;
      setError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!userToken || username === userProfile?.username || !username) return;
      setLoading(true);
      checkUsernameValid(username, userToken)
        .catch((err) => {
          if (err instanceof AxiosError) {
            setError(
              err.response?.data.message || err.response?.data.username?.[0],
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
    <div className="w-full text-center">
      <Image
        className="mx-auto"
        src="/assets/images/navbar/logo.svg"
        alt="unitap"
        height={128}
        width={112}
      />
      <p className="mt-3 font-semibold">Set a username</p>
      <p className="mt-2 text-sm leading-6 text-gray100">
        This username is unique and public.
      </p>

      <div className={`search-input relative mt-5 rounded-2xl bg-gray60`}>
        <Input
          className={`!m-0 rounded-2xl border-2 border-gray70 !bg-gray60 text-gray100 placeholder:text-gray90 ${
            error ? "border-error" : "border-gray70"
          }`}
          $width="100%"
          $fontSize="14px"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          $pl={2}
          $p={2}
          $mb={0}
        ></Input>
        <span className="icon-right absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray90">
          @
        </span>
      </div>
      {!!error && <p className="pl-2 text-left text-xs text-error">{error}</p>}

      <ClaimButton
        onClick={onSubmit}
        className="mt-10 !w-full disabled:opacity-60"
        disabled={loading || !username || !!error}
      >
        <p className="font-semibold">
          {loading ? "Loading..." : "Start the Journey"}
        </p>
      </ClaimButton>
    </div>
  );
};

export default SetUsernameBody;
