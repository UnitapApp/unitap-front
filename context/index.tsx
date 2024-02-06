import { FC, PropsWithChildren } from "react";
import { ErrorsProvider } from "./errorsProvider";
import { GlobalContextProvider } from "./globalProvider";
import { UserContextProvider } from "./userProfile";
import { Settings } from "@/types";
import WalletProvider from "./walletProvider";
import { parseFieldSetting, snakeToCamel } from "@/utils/api";

export const UnitapProvider: FC<PropsWithChildren> = async ({ children }) => {
  const settingsRes: { index: string; value: string }[] = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/settings/",
    { next: { revalidate: 180 } }
  ).then((res) => res.json());

  const settings: Settings = settingsRes.reduce((prev, curr) => {
    (prev as any)[snakeToCamel(curr.index)] = parseFieldSetting(curr.value);
    return prev;
  }, {} as Settings);

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
