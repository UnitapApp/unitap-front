"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/globalProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { shortenAddress } from "@/utils";
import { useWalletAccount } from "@/utils/wallet";
import { useEffect } from "react";

const AddNewWalletSuccess = () => {
  const { userProfile } = useUserProfileContext();
  const { setIsWalletPromptOpen, isWalletPromptOpen } = useGlobalContext();

  const { address } = useWalletAccount();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsWalletPromptOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [setIsWalletPromptOpen]);

  return (
    <>
      <Icon iconSrc="/assets/images/modal/space-like.svg" alt="unitap like" />

      <div className="mt-4 flex items-center text-space-green">
        <p>Logged in Successfully!</p>
      </div>

      <p className="mt-3 text-center text-sm text-gray100">
        Welcome Back @{userProfile?.username}. Now you can go to your profile
        and add {shortenAddress(address)} to your account.
      </p>

      <ClaimButton
        // onClick={handleHaveBrightIdClicked}
        className="mt-8 !w-full"
      >
        <p className="font-semibold">Go to Profile</p>
      </ClaimButton>
    </>
  );
};

export default AddNewWalletSuccess;
