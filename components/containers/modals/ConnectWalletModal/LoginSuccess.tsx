"use client";

import Icon from "@/components/ui/Icon";
import { useWalletAccount } from "@/utils/wallet";

const LoginSuccessBody = () => {
  const { connector } = useWalletAccount();

  console.log(connector?.id);

  return (
    <div className="text-sm text-center w-full">
      <Icon iconSrc="/assets/images/modal/metamask-success.svg" />

      <div className="mt-10 font-semibold text-space-green">
        Logged in Successfully!
      </div>
      <p className="mt-2 mb-16 text-gray100">
        Hii, welcome back @karim_baqeri :)
      </p>
    </div>
  );
};

export default LoginSuccessBody;
