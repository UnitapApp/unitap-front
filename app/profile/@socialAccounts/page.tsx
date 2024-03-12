"use client";

import { FC } from "react";
import { useProfileEditContext } from "../components/profileEditContext";
import SocialAccount from "../components/socialAccount";

const SocialAccountsPage: FC = ({}) => {
  const { connections } = useProfileEditContext();

  return (
    <div className="mt-5 rounded-xl bg-gray20 p-5">
      <p>Social Accounts </p>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <SocialAccount
          title={"Bright ID"}
          icon={"/assets/images/provider-dashboard/modalIcon/brightId.svg"}
          isConnected={!!connections["BrightID"]}
        />
      </div>
    </div>
  );
};

export default SocialAccountsPage;
