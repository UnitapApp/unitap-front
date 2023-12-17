import GasTapProvider from "@/context/gasTapProvider";
import { Chain } from "@/types";
import { FC, PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { getActiveClaimHistory, getOneTimeClaimedChainList } from "@/utils/api";
import {
  getClaimedReceiptsServer,
  getOneTimeClaimedReceiptsServer,
} from "@/utils/serverApis";

const GasTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const chainsApi = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/chain/list/",
    {
      next: {
        revalidate: 10,
      },
      cache: "no-store",
    }
  ).then((res) => res.json());

  const cookieStore = cookies();

  const token = cookieStore.get("userToken");

  const claimedChains = await getOneTimeClaimedReceiptsServer(token?.value);

  const oneTimeClaimedChains = await getClaimedReceiptsServer(token?.value);

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
