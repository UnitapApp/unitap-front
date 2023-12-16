import GasTapProvider from "@/context/gasTapProvider";
import { Chain } from "@/types";
import { FC, PropsWithChildren } from "react";

const GasTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const chains = (
    await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/chain/list/", {
      next: {
        revalidate: 10,
      },
      cache: "no-cache",
    }).then((res) => res.json())
  ).toSorted((a: Chain, b: Chain) =>
    a.isOneTimeClaim && b.isOneTimeClaim
      ? 0
      : a.isOneTimeClaim
      ? -1
      : b.isOneTimeClaim
      ? -1
      : 0
  );

  return <GasTapProvider chains={chains}>{children}</GasTapProvider>;
};

export default GasTapLayout;
