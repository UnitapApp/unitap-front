import PrizeTapProvider from "@/context/prizeTapProvider";
import { getRafflesServerSideListAPI } from "@/utils/serverApis/prizetap";
import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Unitap | Prize Tap 🏆",
  description: "Compete with others for chance of winning prizes",
};

const PrizeTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const raffles = await getRafflesServerSideListAPI();

  return <PrizeTapProvider raffles={raffles}>{children}</PrizeTapProvider>;
};

export default PrizeTapLayout;
