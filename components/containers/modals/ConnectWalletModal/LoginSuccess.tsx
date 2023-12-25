"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { useWalletAccount } from "@/utils/wallet";

const LoginSuccessBody = () => {
  const { connector, address } = useWalletAccount();

  const { userProfile } = useUserProfileContext();

  return (
    <div className="text-sm text-center w-full">
      <Icon iconSrc="/assets/images/modal/metamask-success.svg" />

      <div className="mt-10 font-semibold text-space-green">
        Logged in Successfully!
      </div>
      <p className="mt-2 mb-16 text-gray100">
        Hii, welcome back @{userProfile?.username} :)
      </p>
    </div>
  );
};

export default LoginSuccessBody;
