"use client";

import Icon from "@/components/ui/Icon";
import { useSocialACcountContext } from "@/context/socialAccountContext";
import { parseServerError } from "@/utils";
import { connectDynamicConnection } from "@/utils/api";
import { useWalletAccount } from "@/utils/wallet";
import { FC, useState } from "react";

export const EnsAccount: FC<{
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

    connectDynamicConnection("ens", address)
      .then((res) => {
        addConnection("ENS", res);
      })
      .catch((err: any) => {
        setError(parseServerError(err.response.data));
      })
      .finally(() => setLoading(false));
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

export default EnsAccount;
