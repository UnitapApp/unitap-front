"use client";

import Icon from "@/components/ui/Icon";
import { useSocialACcountContext } from "@/context/socialAccountContext";
import { connectTelegramAccount } from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { LoginButton } from "@telegram-auth/react";
import Script from "next/script";
import { FC, useEffect, useState } from "react";

export const TelegramAccount: FC<{
  title: string;
  icon: string;
  isConnected?: boolean;
}> = ({ icon, title, isConnected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { address } = useWalletAccount();
  const { addConnection } = useSocialACcountContext();

  const onConnect = (data: any) => {
    if (!address) return;

    setLoading(true);
    setError("");

    connectTelegramAccount(data).then((res) => {
      addConnection("Telegram", res);
    });
  };

  return (
    <>
      <div className="rounded-xl border-2 border-gray50 bg-gray40 p-3">
        <div className="flex items-center">
          <Icon width="30px" iconSrc={icon} />
          <p className={`ml-5 text-sm`}>{title}</p>
          <div className="ml-auto">
            {isConnected ? (
              <button
                disabled
                className="flex items-center rounded-lg border border-space-green bg-[#212a32] px-4 py-2 text-sm text-space-green"
              >
                Connected{" "}
                <Icon
                  className="ml-3"
                  iconSrc="/assets/images/modal/check-green.svg"
                />
              </button>
            ) : (
              <>
                <LoginButton
                  botUsername={"unitapappbot"}
                  onAuthCallback={(data: any) => {
                    onConnect({ ...data, userId: data.id });
                  }}
                  showAvatar={true} // true | false
                  lang="en"
                  buttonSize="medium"
                />
              </>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </>
  );
};

export default TelegramAccount;
