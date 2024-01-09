import ProviderDashboard from "@/context/providerDashboardContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return <ProviderDashboard>{children}</ProviderDashboard>;
};

export default ProviderDashboardPrizeTapLayout;
