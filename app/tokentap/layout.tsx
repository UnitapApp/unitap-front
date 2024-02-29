import TokenTapProvider from "@/context/tokenTapProvider";
import { Token } from "@/types";
import { serverFetch } from "@/utils/api";
import { FC, PropsWithChildren } from "react";

const TokenTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const tokens: Token[] = await serverFetch(
    "/api/tokentap/token-distribution-list/"
  );

  return (
    <TokenTapProvider
      tokens={tokens.filter((item) => item.status === "VERIFIED")}
    >
      {children}
    </TokenTapProvider>
  );
};

export default TokenTapLayout;
