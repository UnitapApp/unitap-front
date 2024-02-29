import Icon from "@/components/ui/Icon";
import { FC, useState } from "react";

const GitCoinPassport: FC<{
  title: string;
  icon: string;
  isConnected?: boolean;
}> = ({ icon, title, isConnected }) => {
  const [loading, setLoading] = useState(false);

  const onConnect = () => {};

  return (
    <>
      <div className="p-3 flex bg-gray40 border-2 items-center border-gray50 rounded-xl">
        <Icon width="30px" iconSrc={icon} />
        <p className={`ml-5 text-sm`}>{title}</p>
        <div className="ml-auto">
          {isConnected ? (
            <button
              disabled
              className="border-space-green items-center bg-[#212a32] text-space-green border rounded-lg px-4 py-2 text-sm flex"
            >
              Connected{" "}
              <Icon
                className="ml-3"
                iconSrc="/assets/images/modal/check-green.svg"
              />
            </button>
          ) : (
            <button
              // onClick={openBrightIdConnectionModal}
              className="border-gray90 items-center bg-gray30 text-white border rounded-lg px-5 py-2 text-sm flex"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GitCoinPassport;
