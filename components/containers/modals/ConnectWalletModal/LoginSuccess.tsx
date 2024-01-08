"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { useWalletAccount } from "@/utils/wallet";
import { ConnectionProvider, getWalletProviderInfo } from ".";
import { FC, useEffect } from "react";
import { shortenAddress } from "@/utils";
import { useGlobalContext } from "@/context/globalProvider";

const LoginSuccessBody: FC<{ isNewUser: boolean }> = ({ isNewUser }) => {
  const { connector, address } = useWalletAccount();

  const { userProfile } = useUserProfileContext();
  const { setIsWalletPromptOpen, isWalletPromptOpen } = useGlobalContext();

  const walletInfo = getWalletProviderInfo(
    connector?.id === "injected"
      ? ConnectionProvider.Metamask
      : ConnectionProvider.Walletconnect
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsWalletPromptOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [setIsWalletPromptOpen]);

  return (
    <div className="text-sm text-center w-full">
      <div className="h-32 w-32 mx-auto bg-[#4C4C5C] border-2 border-space-green rounded-full relative flex items-center justify-center">
        <Icon
          iconSrc={walletInfo.imageUrl}
          alt={walletInfo.label}
          width="60px"
          height="60px"
        />

        <Icon
          iconSrc="/assets/images/check-circle-space-green.svg"
          alt="check green"
          className="absolute -right-2 bottom-4"
          width="28px"
          height="28px"
        />
      </div>

      <div className="mt-10 font-semibold justify-center text-space-green flex items-center">
        <Icon
          iconSrc="/assets/images/check-circle-space-green.svg"
          alt="check green"
          className="mr-2"
          width="20px"
          height="20px"
        />
        Logged in Successfully!
      </div>
      <p className="mt-2 mb-16 text-gray100">
        Hii, {isNewUser ? "welcome" : "welcome back"} @
        {userProfile?.username ?? shortenAddress(address)} :{")"}
      </p>
    </div>
  );
};

export default LoginSuccessBody;
