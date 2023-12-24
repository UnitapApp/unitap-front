"use client";

import DisplaySteps from "@/components/containers/provider-dashboard/prize-tap/OfferPrizeForm/DisplaySteps";
import { tokenTapCreateRouteSteps } from "@/constants/providerDashboard";
import ProviderDashboardTokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren, createContext, useState } from "react";

const ProviderTokenTapCreate: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <ProviderDashboardTokenTapProvider>
      <div className="flex flex-col md:flex-row gap-5">
        <DisplaySteps page={tokenTapCreateRouteSteps[pathname]} />
        {children}
      </div>
    </ProviderDashboardTokenTapProvider>
  );
};

export default ProviderTokenTapCreate;
