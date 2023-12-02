import GasTapProvider from "@/context/gasTapProvider";
import { FC, PropsWithChildren } from "react";

const GasTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const chains = await fetch(process.env.API_URL! + "/api/gastap/chain/list/", {
    next: {
      revalidate: 10,
    },
  }).then((res) => res.json());


  return <GasTapProvider chains={chains}>{children}</GasTapProvider>;
};

export default GasTapLayout;
