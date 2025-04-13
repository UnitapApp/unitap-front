"use client";

import { FC, PropsWithChildren } from "react";
import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/globalProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { BackToHomeButton } from "@/app/dashboard/_components/Buttons";

const ProviderDashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userToken } = useUserProfileContext();
  const { openBrightIdModal, setIsWalletPromptOpen } = useGlobalContext();

  if (userToken) return children;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray20 py-10">
      <div className="mb-10">
        <Icon iconSrc="/assets/images/provider-dashboard/dashboard-login.svg" />
      </div>
      <p
        className="cursor-pointer text-sm font-semibold text-white"
        onClick={openBrightIdModal}
      >
        Sign up first!
      </p>
      <p className="text-gray100">
        If you have account log in to have access to Incentive Center!
      </p>

      <BackToHomeButton
        height="32px"
        className="mt-10 !w-full max-w-[120px] text-xs"
        $fontSize="10px"
        onClick={() => setIsWalletPromptOpen(true)}
      >
        <p>Connect Wallet</p>
      </BackToHomeButton>
    </div>
  );
};

export default ProviderDashboardLayout;
