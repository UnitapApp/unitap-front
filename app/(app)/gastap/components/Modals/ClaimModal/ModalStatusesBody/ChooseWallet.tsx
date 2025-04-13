import Icon from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { shortenAddress } from "@/utils";
import { FC, useEffect, useState } from "react";
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
        className="absolute right-3 top-4 z-10 cursor-pointer bg-gray30"
      >
        <Icon
          iconSrc="/assets/images/token-tap/angle-down.svg"
          className="-rotate-90"
          width="20px"
        />
      </div>
      <div className="relative">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={
            "h-12 rounded-xl !bg-gray70 placeholder:!text-gray80 " +
            (error ? "border border-error" : "")
          }
          placeholder="Paste Wallet Address"
        />
        <button
          onClick={() =>
            navigator.clipboard.readText().then((text) => setText(text))
          }
          className="btn btn--sm btn--primary-light absolute right-3 top-1/2 z-10 -translate-y-1/2 font-semibold tracking-wide"
        >
          PASTE
        </button>
      </div>
      {!!error && <p className="-mt-4 ml-2 text-xs text-error">{error}</p>}

      <div className="mt-4">
        {userProfile?.wallets.map((wallet, key) => (
          <div
            onClick={() => {
              setClaimWalletAddress(wallet.address);
              setIsWalletChoosing(false);
            }}
            key={key}
            className="mt-3 cursor-pointer rounded-xl border border-gray60 bg-gray40 px-5 py-3 font-semibold text-gray100"
          >
            {shortenAddress(wallet.address)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseWalletBody;
