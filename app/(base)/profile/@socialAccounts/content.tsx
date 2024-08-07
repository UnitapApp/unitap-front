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
import EnsAccount from "../components/socialAccounts/ensAccount";
import LensAccount from "../components/socialAccounts/lensAccount";
import FarcasterAccount from "../components/socialAccounts/farcasterAccount";

const SocialAccountContent: FC<{ initialConnections: UserConnection }> = ({
  initialConnections,
}) => {
  const [connections, setConnections] = useState(initialConnections ?? []);

  const { userToken } = useUserProfileContext();

  console.log(connections);

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
        <EnsAccount
          title={"ENS"}
          icon={"/assets/images/provider-dashboard/requirements/ens.svg"}
          isConnected={!!connections["ENS"]}
        />
        <LensAccount
          title={"Lens"}
          icon={"/assets/images/provider-dashboard/requirements/lens.svg"}
          isConnected={!!connections["Lens"]}
        />
        <FarcasterAccount
          title={"Farcaster"}
          icon={"/assets/images/provider-dashboard/requirements/farcaster.svg"}
          isConnected={!!connections["Farcaster"]}
        />
      </div>
    </SocialAccountContext.Provider>
  );
};

export default SocialAccountContent;
