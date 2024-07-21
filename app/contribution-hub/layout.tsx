import ProviderDashboardLayout from "@/components/containers/provider-dashboard/layout";
import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";

import "./styles.scss";

export const metadata: Metadata = {
  title: "Unitap | Incentive Center 🖥️",
  description: "If you have account log in to have access to Incentive Center",
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <ProviderDashboardLayout>{children}</ProviderDashboardLayout>;
};

export default Layout;
