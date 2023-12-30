import PrizeTapProvider from "@/context/prizeTapProvider";
import { getRafflesListAPI } from "@/utils/api";
import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Unitap | Prize Tap 🏆",
  description: "Compete with others for chance of winning prizes",
};

const PrizeTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const raffles = await getRafflesListAPI(undefined);

  return <PrizeTapProvider raffles={raffles}>{children}</PrizeTapProvider>;
};

export default PrizeTapLayout;
