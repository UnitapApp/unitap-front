import GasTapProvider from "@/context/gasTapProvider";
import { Chain } from "@/types";
import { FC, PropsWithChildren } from "react";
import { cookies } from "next/headers";
import {
  getClaimedReceiptsServer,
  getOneTimeClaimedReceiptsServer,
} from "@/utils/serverApis";

const GasTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const chainsApi = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/chain/list/",
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

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
      chains={chains}
    >
      {children}
    </GasTapProvider>
  );
};

export default GasTapLayout;
