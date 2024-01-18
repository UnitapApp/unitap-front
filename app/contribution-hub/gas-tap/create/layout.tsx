import { GasTapProvider } from "@/context/gasTapProvider";
import { FC, PropsWithChildren } from "react";
import { Chain } from "@/types";
import { cookies } from "next/headers";
import {
  getClaimedReceiptsServer,
  getFaucetListServer,
  getFuelChampionListServerSide,
  getOneTimeClaimedReceiptsServer,
} from "@/utils/serverApis";

const ProviderDashboardGasTapLayout: FC<PropsWithChildren> = async ({
  children,
}) => {
  const chainsApi = await getFaucetListServer();

  const fuelChampionList = await getFuelChampionListServerSide();

  const cookieStore = cookies();

  const token = cookieStore.get("userToken");

  const oneTimeClaimedChains = await getOneTimeClaimedReceiptsServer(
    token?.value
  );

  const claimedChains = await getClaimedReceiptsServer(token?.value);

  const chains = chainsApi as Array<Chain>;

  return (
    <GasTapProvider
      claimReceiptInitial={claimedChains}
      oneTimeClaimedGasListInitial={oneTimeClaimedChains}
      fuelChampionList={fuelChampionList}
      chains={chains}
    >
      {children}
    </GasTapProvider>
  );
};

export default ProviderDashboardGasTapLayout;
