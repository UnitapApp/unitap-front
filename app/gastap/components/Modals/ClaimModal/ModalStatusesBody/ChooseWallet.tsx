import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/input";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { shortenAddress } from "@/utils";
import { FC, Fragment, useEffect, useState } from "react";
import { isAddress } from "viem";

const ChooseWalletBody: FC<{
  setIsWalletChoosing: (isWalletChoosing: boolean) => void;
}> = ({ setIsWalletChoosing }) => {
  const [error, setError] = useState("");

  const { userProfile } = useUserProfileContext();

  const { setClaimWalletAddress, claimWalletAddress } = useGasTapContext();

  const [text, setText] = useState("");

  useEffect(() => {
    if (text && !isAddress(text)) {
      setError("Address is not valid");
      return;
    }

    setError("");
    setClaimWalletAddress(text);
  }, [setClaimWalletAddress, text]);

  return (
    <div className="w-full text-sm">
      <div
        onClick={() => setIsWalletChoosing(false)}
        className="absolute left-3 top-4 z-10 cursor-pointer"
      >
        <Icon
          iconSrc="/assets/images/gas-tap/arrow-back.svg"
          width="24"
          height="25"
          alt="back"
        />
      </div>
      <div className="relative">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={
            "!bg-bg6 h-12 !rounded-xl !font-semibold placeholder:!text-gray90 " +
            (error ? "border border-error" : "")
          }
          placeholder="Paste Wallet Address"
        />
        <button
          onClick={() =>
            navigator.clipboard.readText().then((text) => setText(text))
          }
          className="gradient-button-st-1 absolute right-3 top-1/2 z-10 -translate-y-1/2 !rounded-2xl p-[1px]"
        >
          <div className="btn btn--sm !rounded-2xl !font-normal tracking-wide">
            PASTE
          </div>
        </button>
      </div>
      {!!error && <p className="-mt-4 ml-2 text-xs text-error">{error}</p>}

      <div className="bg-bg3 mt-4 rounded-xl">
        {userProfile?.wallets.map((wallet, key) => (
          <Fragment key={key}>
            <div
              onClick={() => {
                setClaimWalletAddress(wallet.address);
                setIsWalletChoosing(false);
              }}
              className={`cursor-pointer px-5 py-4 font-semibold text-gray100`}
            >
              {shortenAddress(wallet.address)}
            </div>
            {key + 1 !== userProfile.wallets.length && (
              <div className="mx-auto h-[1px] w-88 bg-[#323244]"></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChooseWalletBody;
