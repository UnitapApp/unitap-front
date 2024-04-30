"use client";

import { UserConnection } from "@/types";
import { FC, useState } from "react";
import SocialAccount from "../components/socialAccounts";
import { useFastRefresh } from "@/utils/hooks/refresh";
import { getAllConnections } from "@/utils/serverApis";
import { useUserProfileContext } from "@/context/userProfile";
import { SocialAccountContext } from "@/context/socialAccountContext";
import GitCoinPassportAccount from "../components/socialAccounts/gitcoinPassport";
import TwitterAccount from "../components/socialAccounts/twitter";

const SocialAccountContent: FC<{ initialConnections: UserConnection }> = ({
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
        <SocialAccount
          title={"Bright ID"}
          icon={"/assets/images/provider-dashboard/modalIcon/brightId.svg"}
          isConnected={!!connections["BrightID"]}
        />
        <GitCoinPassportAccount
          title={"Gitcoin Passport"}
          icon={"/assets/images/up-profile/gitcoin-passport.svg"}
          isConnected={!!connections["GitcoinPassport"]}
        />
        <TwitterAccount
          title={"Twitter"}
          icon={"/assets/images/landing/twitter-icon.svg"}
          isConnected={!!connections["Twitter"]}
        />
      </div>
    </SocialAccountContext.Provider>
  );
};

export default SocialAccountContent;
