import ProviderDashboard from "@/context/providerDashboardContext";
import { getFaucetListServer } from "@/utils/serverApis";
import { getConstraintListServer } from "@/utils/serverApis/contributionHub";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = async ({
  children,
}) => {
  const chainsApi = await getFaucetListServer();
  const constraintLisApi = await getConstraintListServer();
  return (
    <ProviderDashboard
      allChains={chainsApi}
      constraintListApi={constraintLisApi}
    >
      {children}
    </ProviderDashboard>
  );
};

export default ProviderDashboardPrizeTapLayout;
