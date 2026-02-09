import { FC, PropsWithChildren } from "react";
import { ErrorsProvider } from "./errorsProvider";
import { GlobalContextProvider } from "./globalProvider";
import { UserContextProvider } from "./userProfile";
import { UserProfile } from "@/types";
import WalletProvider from "./walletProvider";
// import { parseFieldSetting, serverFetch, snakeToCamel } from "@/utils/api";
// import { cookies } from "next/headers";

export const UnitapProvider: FC<PropsWithChildren> = async ({ children }) => {
  // const settingsRes: { index: string; value: string }[] = await fetch(
  //   process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/settings/",
  //   { next: { revalidate: 10 } },
  // ).then((res) => res.json());

  let authProfile: UserProfile | null = null;

  // const cookieStorage = cookies();

  // try {
  //   if (cookieStorage.has("userToken"))
  //     authProfile = await serverFetch(`/api/auth/user/info/`, {
  //       headers: {
  //         Authorization: `Token ${cookieStorage.get("userToken")?.value}`,
  //       },
  //       cache: "no-store",
  //     });
  // } catch {}

  return (
    <ErrorsProvider>
      <GlobalContextProvider>
        <UserContextProvider
          initial={authProfile}
          settings={{
            isGasTapAvailable: false,
            gastapRoundClaimLimit: 0,
            prizetapRoundClaimLimit: 0,
            tokentapRoundClaimLimit: 0,
          }}
        >
          <WalletProvider>{children}</WalletProvider>
        </UserContextProvider>
      </GlobalContextProvider>
    </ErrorsProvider>
  );
};

export default UnitapProvider;
