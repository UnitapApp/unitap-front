import ProviderDashboardGasTapContextProvider from "@/context/providerDashboardGasTapContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardGasTapLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProviderDashboardGasTapContextProvider>
      {children}
    </ProviderDashboardGasTapContextProvider>
  );
};

export default ProviderDashboardGasTapLayout;
