"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { checkUserExists, loginOrRegister, setWalletAPI } from "@/utils/api";
import { useWalletAccount, useWalletNetwork } from "@/utils/wallet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useSignTypedData } from "wagmi";
import { ClaimButton } from "@/components/ui/Button/button";
import { WalletState } from "../../../components/containers/modals/ConnectWalletModal";
import { Address, isAddressEqual } from "viem";
import { AxiosError } from "axios";
import { useWalletManagementContext } from "@/context/walletProvider";

const SignPrompt: FC<{
  imageUrl: string;
  label?: string;
  loadingImage: string;
  error: string;
  setWalletState: (state: WalletState) => void;
  setError: (error: string) => void;
  setIsConnected: (connected: boolean) => void;
  setAddModalState: (state: string) => void;
}> = ({
  imageUrl,
  label,
  loadingImage,
  setWalletState,
  error,
  setError,
  setIsConnected,
  setAddModalState,
}) => {
  const { address } = useWalletAccount();

  const { chain } = useWalletNetwork();

  const chainId = chain?.id;

  const { userToken, userProfile, addNewWallet } = useUserProfileContext();

  const { duplicateWalletRaiseError } = useWalletManagementContext();

  const [now, setNow] = useState(new Date().toISOString());

  const [lastCheckDuplicateWallet, setLastCheckDuplicateWallet] =
    useState<Address | null>(null);

  const isMounted = useRef(false);

  const onSuccess = useCallback(
    async (hashed: string) => {
      if (!address || !userToken) return;

      const res = await setWalletAPI(
        userToken,
        address,
        "EVM",
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
        }),
        hashed
      );

      addNewWallet(address, res.pk);
      setAddModalState("complete");
    },
    [addNewWallet, address, chainId, now, setAddModalState, userToken]
  );

  const { isError, signTypedDataAsync, variables } = useSignTypedData({});

  useEffect(() => {
    if (!address) return;

    if (
      userProfile?.wallets.find((item) =>
        isAddressEqual(item.address, address!)
      )
    ) {
      setLastCheckDuplicateWallet(address);
      return;
    }

    checkUserExists(address).then((res) => {
      if (res) {
        setError(
          "This wallet is already added to another account, please enter a different wallet"
        );
      } else {
        setLastCheckDuplicateWallet(address);
      }
    });
  }, [address, setError, userProfile?.wallets]);

  useEffect(() => {
    if (isMounted.current) return;

    if (!address) return;

    if (
      !lastCheckDuplicateWallet ||
      !isAddressEqual(address, lastCheckDuplicateWallet)
    )
      return;

    if (
      userProfile?.wallets.find((item) =>
        isAddressEqual(item.address, address!)
      )
    ) {
      if (duplicateWalletRaiseError) {
        setError(
          "This wallet is already added to your account, please enter a different wallet"
        );
      } else {
        setAddModalState("complete");
      }

      return;
    }

    signTypedDataAsync({
      message: {
        message: "Unitap Sign In",
        URI: "https://unitap.app",
        IssuedAt: now,
      },
      primaryType: "Unitap",
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
    })
      .then((res) => onSuccess(res))
      .catch((err) => {
        if (err instanceof AxiosError) {
          const error = err.response?.data;
          setError(error.address?.[0] ?? error.message?.[0] ?? err.message);
        } else {
          setError(err.message);
        }
      });

    isMounted.current = true;

    return () => {};
  }, [
    address,
    chainId,
    duplicateWalletRaiseError,
    lastCheckDuplicateWallet,
    now,
    onSuccess,
    setAddModalState,
    setError,
    signTypedDataAsync,
    userProfile?.wallets,
  ]);

  const isWalletDuplicateError = error.startsWith(
    "This wallet is already added"
  );

  if (error)
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
            <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
          </div>

          <p className="font-semibold text-warn mt-8">
            {isWalletDuplicateError
              ? "Wallet is duplicate"
              : "Sign message Failed"}
          </p>

          <p className="mt-2 text-gray100 text-xs">{error}</p>

          <ClaimButton
            onClick={() => {
              setIsConnected(false);
              setNow(new Date().toISOString());
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
    <div className="text-center">
      <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
        <Icon
          alt="loading"
          iconSrc={loadingImage}
          width="128px"
          height="128px"
          className="animate-spin absolute"
        />
        <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
      </div>
      <p className="font-bold mt-8">Waiting...</p>

      <p className="text-gray100 text-xs mt-6 mb-12">
        Please sign the message in your wallet to complete the authentication
        process.
      </p>
    </div>
  );
};

export default SignPrompt;
