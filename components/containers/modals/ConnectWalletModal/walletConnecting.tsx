"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { loginOrRegister, setWalletAPI } from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { ethers } from "ethers";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useSignMessage } from "wagmi";
import { WalletState } from ".";
import { ClaimButton } from "@/components/ui/Button/button";

const WalletConnecting: FC<{
  imageUrl: string;
  label?: string;
  loadingImage: string;
  error?: string;
  setWalletState: (state: WalletState) => void;
  isNewUser: boolean;
}> = ({ imageUrl, label, loadingImage, setWalletState, isNewUser }) => {
  const { address, connector } = useWalletAccount();
  const [error, setError] = useState("");

  const { userToken, userProfile, onWalletLogin } = useUserProfileContext();

  const message = useMemo(
    () => ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error]
  );

  const isMounted = useRef(false);

  const onSuccess = async (hashed: string) => {
    if (!address) return;

    const res = await loginOrRegister(address, hashed, message);

    onWalletLogin(res.token, res);

    setWalletState(isNewUser ? WalletState.SetUsername : WalletState.LoggedIn);
  };

  const { isError, signMessageAsync } = useSignMessage({
    message,
    onSuccess,
  });

  useEffect(() => {
    if (isMounted.current) return;

    if (!address) return;

    signMessageAsync().catch((err) => setError(err.message));

    isMounted.current = true;

    return () => {};
  }, [address, message, signMessageAsync]);

  if (error)
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
            <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
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

export default WalletConnecting;
