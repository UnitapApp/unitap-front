"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { loginOrRegister } from "@/utils/api";
import { useWalletAccount, useWalletNetwork } from "@/utils/wallet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useSignTypedData } from "wagmi";
import { WalletState } from ".";
import { ClaimButton } from "@/components/ui/Button/button";

const WalletConnecting: FC<{
  imageUrl: string;
  label?: string;
  loadingImage: string;
  error?: string;
  setWalletState: (state: WalletState) => void;
  isNewUser: boolean;
  previousWalletState: WalletState | null;
}> = ({
  imageUrl,
  label,
  loadingImage,
  setWalletState,
  isNewUser,
  previousWalletState,
}) => {
  const { address, connector } = useWalletAccount();
  const [error, setError] = useState("");

  const { chain } = useWalletNetwork();

  const chainId = chain?.id;

  const { userToken, userProfile, onWalletLogin } = useUserProfileContext();

  const [now, setNow] = useState(new Date().toISOString());

  const isMounted = useRef(false);

  const onSuccess = useCallback(
    async (hashed: string) => {
      if (!address) return;

      const res = await loginOrRegister(
        address,
        hashed,
        JSON.stringify({
          message: {
            message: "Unitap Sign In",
            URI: "https://unitap.app",
            IssuedAt: now,
          },
          primaryType: "Unitap",
          account: address,
          domain: {
            name: "Unitap Connect",
            version: "1",
            chainId: chainId ?? 1,
            verifyingContract: "0x0000000000000000000000000000000000000000",
          },
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Unitap: [
              { name: "message", type: "string" },
              { name: "URI", type: "string" },
              { name: "IssuedAt", type: "string" },
            ],
          },
          onSuccess,
        }),
      );

      onWalletLogin(res.token, res);

      setWalletState(
        previousWalletState === WalletState.AddNewWallet
          ? WalletState.AddWalletSuccess
          : isNewUser
            ? WalletState.SetUsername
            : WalletState.LoggedIn,
      );
    },
    [
      address,
      chainId,
      isNewUser,
      now,
      onWalletLogin,
      previousWalletState,
      setWalletState,
    ],
  );

  const { isError, signTypedDataAsync, status } = useSignTypedData({});

  useEffect(() => {
    if (isMounted.current) return;

    if (!address) return;

    console.log(connector);

    signTypedDataAsync({
      message: {
        message: "Unitap Sign In",
        URI: "https://unitap.app",
        IssuedAt: now,
      },
      // connector,
      // account: address,
      domain: {
        name: "Unitap Connect",
        version: "1",
        chainId: chainId ?? 1,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      types: {
        Unitap: [
          { name: "message", type: "string" },
          { name: "URI", type: "string" },
          { name: "IssuedAt", type: "string" },
        ],
      },
      primaryType: "Unitap",
    })
      .then((res) => onSuccess(res))
      .catch((err) => {
        console.warn(err);
        setError(err.message);
      });

    isMounted.current = true;

    return () => {};
  }, [address, chainId, connector, now, onSuccess, signTypedDataAsync]);

  if (error)
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#4C4C5C]">
            <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
          </div>

          <p className="mt-8 font-semibold text-warn">Sign message Failed</p>

          <p className="mt-2 text-xs text-gray100">{error}</p>

          <ClaimButton
            onClick={() => {
              setNow(new Date().toISOString());
              isMounted.current = false;
              setError("");
            }}
            className="mx-auto mt-7 !w-full"
          >
            <p>Try Again</p>
          </ClaimButton>
        </div>
      </div>
    );

  return (
    <div className="text-center">
      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#4C4C5C]">
        <Icon
          alt="loading"
          iconSrc={loadingImage}
          width="128px"
          height="128px"
          className="absolute animate-spin"
        />
        <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
      </div>
      <p className="mt-8 font-bold">Waiting...</p>

      <p className="mb-12 mt-6 text-xs text-gray100">
        Please sign the message in your wallet to complete the authentication
        process.
      </p>
    </div>
  );
};

export default WalletConnecting;
