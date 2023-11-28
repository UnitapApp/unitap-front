import ProviderDashboardGasTapContextProvider from "@/context/providerDashboardGasTapContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ProviderDashboardGasTapContextProvider>
      {children}
    </ProviderDashboardGasTapContextProvider>
  );
};

export default ProviderDashboardPrizeTapLayout;
