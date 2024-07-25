"use client";

import Icon from "@/components/ui/Icon";
import { useSocialACcountContext } from "@/context/socialAccountContext";
import { parseServerError } from "@/utils";
import {
  connectGitCoinPassport,
  getTwitterOAuthUrlApi,
  verifyTwitterApi,
} from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { FC, useEffect, useState } from "react";

const verifiedDomains = ["unitap.app", "localhost:5678"];

export const TwitterAccount: FC<{
  title: string;
  icon: string;
  isConnected?: boolean;
}> = ({ icon, title, isConnected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { address } = useWalletAccount();

  const { addConnection } = useSocialACcountContext();

  const onConnect = () => {
    if (!address) return;

    setLoading(true);
    setError("");

    getTwitterOAuthUrlApi().then((url) => {
      const twitterWindow = window.open(
        url,
        "Unitap | Login with twitter",
        "width=600,height=800",
      );

      if (!twitterWindow) return;
    });
  };

  useEffect(() => {
    const messageEvent = (event: MessageEvent) => {
      const message = event.data;

      if (message.type !== "unitap-token-verification") return;

      const { authToken, authVerifier } = message.data;

      verifyTwitterApi(authToken, authVerifier).then((res) => {
        console.log(res);
        setLoading(false);
      });
    };

    window.addEventListener("message", messageEvent, false);

    return () => {
      window.removeEventListener("message", messageEvent);
    };
  }, []);

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
              <button
                disabled={loading}
                onClick={onConnect}
                className="flex items-center rounded-lg border border-gray90 bg-gray30 px-5 py-2 text-sm text-white disabled:opacity-60"
              >
                {loading ? "Connecting..." : "Connect"}
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </>
  );
};

export default TwitterAccount;
