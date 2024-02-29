"use client";

import { UserConnection } from "@/types";
import { FC, useState } from "react";
import BrightIDSocialAccount from "../../components/accounts/brightIDAccount";
import { useFastRefresh } from "@/utils/hooks/refresh";
import { getAllConnections } from "@/utils/serverApis";
import { useUserProfileContext } from "@/context/userProfile";
import { SocialAccountContext } from "@/context/socialAccountContext";
import GitCoinPassport from "../../components/accounts/gitCoinPassport";

const SocialAccountsPage: FC<{ initialConnections: UserConnection }> = ({
  initialConnections,
}) => {
  const [connections, setConnections] = useState(initialConnections ?? []);

  const { userToken } = useUserProfileContext();

  useFastRefresh(() => {
    if (!userToken) return;

    getAllConnections(userToken).then((res) => {
      setConnections(res);
    });
  }, [userToken]);

  return (
    <SocialAccountContext.Provider
      value={{
        connections,
        addConnection: (key: string, data: any) =>
          setConnections({ ...connections, [key]: data }),
      }}
    >
      <div className="mt-10 grid grid-cols-2 gap-4">
        <BrightIDSocialAccount
          title={"Bright ID"}
          icon={"/assets/images/provider-dashboard/modalIcon/brightId.svg"}
          isConnected={!!connections["BrightID"]}
        />
        <GitCoinPassport
          title={"Gitcoin Passport"}
          icon={"/assets/images/up-profile/gitcoin-passport.svg"}
          isConnected={!!connections["GitCoinPassport"]}
        />
      </div>
    </SocialAccountContext.Provider>
  );
};

export default SocialAccountsPage;
