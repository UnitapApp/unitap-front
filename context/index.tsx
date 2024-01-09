import { FC, PropsWithChildren } from "react";
import { ErrorsProvider } from "./errorsProvider";
import { GlobalContextProvider } from "./globalProvider";
import { UserContextProvider } from "./userProfile";
import { Settings } from "@/types";
import WalletProvider from "./walletProvider";

export const UnitapProvider: FC<PropsWithChildren> = async ({ children }) => {
  const settings: Settings = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/settings/",
    { next: { revalidate: 180 } }
  ).then((res) => res.json());

  return (
    <ErrorsProvider>
      <GlobalContextProvider>
        <UserContextProvider settings={settings}>
          <WalletProvider>{children}</WalletProvider>
        </UserContextProvider>
      </GlobalContextProvider>
    </ErrorsProvider>
  );
};

export default UnitapProvider;
