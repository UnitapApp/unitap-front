"use client";

import { FC } from "react";
import SocialAccount from "../../components/socialAccount";
import { useProfileEditContext } from "../components/profileEditContext";

const SocialAccountsPage: FC = ({}) => {
  const { connections } = useProfileEditContext();

  return (
    <div className="mt-5 bg-gray20 rounded-xl p-5">
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
