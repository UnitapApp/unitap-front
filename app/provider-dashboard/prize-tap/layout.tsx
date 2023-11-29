import ProviderDashboard from "@/context/providerDashboardContext";
import ProviderDashboardGasTapContextProvider from "@/context/providerDashboardGasTapContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ProviderDashboardGasTapContextProvider>
      <ProviderDashboard>{children}</ProviderDashboard>
    </ProviderDashboardGasTapContextProvider>
  );
};

export default ProviderDashboardPrizeTapLayout;
