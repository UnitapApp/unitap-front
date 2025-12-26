import TokenTapProvider from "@/context/tokenTapProvider";
import { Token } from "@/types";
import { apiData } from "@/utils/api";
import { FC, PropsWithChildren } from "react";

const TokenTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const tokens = apiData[
    "/api/tokentap/token-distribution-list/"
  ] as unknown as Token[];

  return (
    <TokenTapProvider
      tokens={tokens.filter((item) => item.status === "VERIFIED")}
    >
      {children}
    </TokenTapProvider>
  );
};

export default TokenTapLayout;
