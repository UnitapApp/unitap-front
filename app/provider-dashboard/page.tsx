import PrizeTapContent from "@/components/containers/provider-dashboard/prize-tap/Content";
import ProviderDashboard from "@/context/providerDashboardContext";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC = ({}) => {
  return (
    <ProviderDashboard>
      <PrizeTapContent />
    </ProviderDashboard>
  );
};

export default ProviderDashboardPrizeTapLayout;
