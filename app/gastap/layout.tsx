import GasTapProvider from "@/context/gasTapProvider";
import { Chain } from "@/types";
import { FC, PropsWithChildren } from "react";

const GasTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const chainsApi = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/chain/list/",
    {
      next: {
        revalidate: 10,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const chains = chainsApi as Array<Chain>;

  return <GasTapProvider chains={chains}>{children}</GasTapProvider>;
};

export default GasTapLayout;
