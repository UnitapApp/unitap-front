import TokenTapProvider from "@/context/providerDashboardTokenTapContext";
import {
  getConstraintListServer,
  getFaucetListServer,
} from "@/utils/serverApis";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<PropsWithChildren> = async ({
  children,
}) => {
  const chainsApi = await getFaucetListServer();
  const constraintLisApi = await getConstraintListServer();
  return (
    <TokenTapProvider
      allChains={chainsApi}
      constraintListApi={constraintLisApi}
    >
      {children}
    </TokenTapProvider>
  );
};

export default ProviderDashboardPrizeTapLayout;
