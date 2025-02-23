"use client";

import { FC, PropsWithChildren } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";
import RoutePath from "@/utils/routes";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { useGlobalContext } from "@/context/globalProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { BackToHomeButton } from "../../../app/incentive-center/components/Buttons";

const ProviderDashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userToken } = useUserProfileContext();
  const { openBrightIdModal, setIsWalletPromptOpen } = useGlobalContext();

  return (
    <>
      <Header />

      {userToken ? (
        <>
          <ProviderTabs />

          {children}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray20 py-10">
          <div className="mb-10">
            <Icon iconSrc="/quest/assets/images/provider-dashboard/dashboard-login.svg" />
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
      )}
    </>
  );
};

const ProviderTabs: FC = () => {
  const pathname = usePathname();

  const borderPosition =
    pathname.includes(RoutePath.PROVIDER_GASTAP) ||
    pathname == RoutePath.PROVIDERDASHBOARD
      ? "after:left-0"
      : pathname.includes(RoutePath.PROVIDER_TOKENTAP)
        ? "after:left-[33.33%]"
        : "after:left-[67%]";

  return (
    <div
      className={`${borderPosition} relative mb-4 flex select-none justify-between rounded-t-xl border-b-2 border-gray80 bg-gray20 text-center font-semibold text-white transition ease-in-out after:absolute after:bottom-[-1.8px] after:w-[33%] after:border after:transition-all after:duration-[1s]`}
    >
      <Link
        className={`delay-260 flex w-full cursor-pointer flex-col-reverse items-center justify-center gap-2 p-3 transition duration-[1s] ease-in-out sm:flex-row ${
          RoutePath.PROVIDERDASHBOARD == pathname ||
          pathname.includes("gas-tap")
            ? "text-white"
            : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_GASTAP}
        // href={"#"}
      >
        Gas Tap{" "}
        <Icon iconSrc="/quest/assets/images/provider-dashboard/gas-tap.svg" />
      </Link>
      <Link
        className={`delay-260 flex w-full cursor-pointer flex-col-reverse items-center justify-center gap-2 p-3 transition duration-[1s] ease-in-out sm:flex-row ${
          pathname.includes("token-tap") ? "text-white" : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_TOKENTAP}
        // href={"#"}
      >
        Token Tap{" "}
        <Icon iconSrc="/quest/assets/images/provider-dashboard/token-tap.svg" />
      </Link>
      <Link
        className={`delay-260 flex w-full cursor-pointer flex-col-reverse items-center justify-center gap-2 p-3 transition duration-[1s] ease-in-out sm:flex-row ${
          pathname.includes("prize-tap")
            ? "opacity-1 text-white"
            : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_PRIZETAP}
      >
        Prize Tap
        <Icon iconSrc="/quest/assets/images/provider-dashboard/prize-tap.svg" />
      </Link>
    </div>
  );
};

export default ProviderDashboardLayout;
