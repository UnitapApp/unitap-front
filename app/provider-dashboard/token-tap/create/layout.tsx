"use client";

import DisplaySteps from "@/components/containers/provider-dashboard/prize-tap/OfferPrizeForm/DisplaySteps";
import ProviderDashboardTokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren, createContext, useState } from "react";

export const routeSteps: { [key: string]: number } = {
  "/provider-dashboard/token-tap/create/step1": 0,
  "/provider-dashboard/token-tap/create/step2": 1,
};

const ProviderTokenTapCreate: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <ProviderDashboardTokenTapProvider>
      <div className="flex flex-col md:flex-row gap-5">
        <DisplaySteps page={routeSteps[pathname]} />
        {children}
      </div>
    </ProviderDashboardTokenTapProvider>
  );
};

export default ProviderTokenTapCreate;
