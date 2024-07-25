import { FC, PropsWithChildren } from "react";
import { ErrorsProvider } from "./errorsProvider";
import { GlobalContextProvider } from "./globalProvider";
import { UserContextProvider } from "./userProfile";
import { Settings, UserProfile } from "@/types";
import WalletProvider from "./walletProvider";
import { parseFieldSetting, serverFetch, snakeToCamel } from "@/utils/api";
import { cookies } from "next/headers";

export const UnitapProvider: FC<PropsWithChildren> = async ({ children }) => {
  const settingsRes: { index: string; value: string }[] = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/settings/",
    { next: { revalidate: 10 } },
  ).then((res) => res.json());

  let authProfile: UserProfile | null = null;

  const cookieStorage = cookies();

  try {
    if (cookieStorage.has("userToken"))
      authProfile = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/info/`,
        {
          headers: {
            Authorization: `Token ${cookieStorage.get("userToken")?.value}`,
          },
          cache: "no-store",
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");

          return res;
        })
        .then((res) => res.json());
  } catch {}

  const settings: Settings = settingsRes.reduce((prev, curr) => {
    (prev as any)[snakeToCamel(curr.index)] = parseFieldSetting(curr.value);
    return prev;
  }, {} as Settings);

  return (
    <ErrorsProvider>
      <GlobalContextProvider>
        <UserContextProvider initial={authProfile} settings={settings}>
          <WalletProvider>{children}</WalletProvider>
        </UserContextProvider>
      </GlobalContextProvider>
    </ErrorsProvider>
  );
};

export default UnitapProvider;
