"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { shortenAddress } from "@/utils";
import { useWalletAccount } from "@/utils/wallet";

const AddNewWalletSuccess = () => {
  const { userProfile } = useUserProfileContext();

  const { address } = useWalletAccount();

  return (
    <>
      <Icon iconSrc="/assets/images/modal/space-like.svg" alt="unitap like" />

      <div className="flex items-center mt-4 text-space-green">
        <p>Logged in Successfully!</p>
      </div>

      <p className="mt-3 text-sm text-center text-gray100">
        Welcome Back @{userProfile?.username}. Now you can go to your profile
        and add {shortenAddress(address)} to your account.
      </p>

      <ClaimButton
        // onClick={handleHaveBrightIdClicked}
        className="!w-full mt-8"
      >
        <p className="font-semibold">Go to Profile</p>
      </ClaimButton>
    </>
  );
};

export default AddNewWalletSuccess;
