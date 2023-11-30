import ProviderDashboard from "@/context/providerDashboardContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    // <ProviderDashboardGasTapContextProvider>
    <ProviderDashboard>{children}</ProviderDashboard>
    // </ProviderDashboardGasTapContextProvider>
  );
};

export default ProviderDashboardPrizeTapLayout;
