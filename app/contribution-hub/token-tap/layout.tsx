import ProviderDashboardTokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardGasTapLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProviderDashboardTokenTapProvider>
      {children}
    </ProviderDashboardTokenTapProvider>
  );
};

export default ProviderDashboardGasTapLayout;
