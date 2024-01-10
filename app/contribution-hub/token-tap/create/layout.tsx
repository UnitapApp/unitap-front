import TokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return <TokenTapProvider>{children}</TokenTapProvider>;
};

export default ProviderDashboardPrizeTapLayout;
