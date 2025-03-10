"use client";

import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/globalProvider";
import { FC } from "react";

export const SocialAccount: FC<{
  title: string;
  icon: string;
  isConnected?: boolean;
}> = ({ icon, title, isConnected }) => {
  const { openBrightIdConnectionModal } = useGlobalContext();

  return (
    <>
      <div className="flex items-center rounded-xl border-2 border-gray50 bg-gray40 p-3">
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
              onClick={openBrightIdConnectionModal}
              className="flex items-center rounded-lg border border-gray90 bg-gray30 px-5 py-2 text-sm text-white"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SocialAccount;
