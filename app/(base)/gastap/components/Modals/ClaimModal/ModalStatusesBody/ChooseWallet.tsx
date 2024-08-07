import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/input";
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
    <div className="text-sm w-full">
      <div
        onClick={() => setIsWalletChoosing(false)}
        className="absolute cursor-pointer z-10 top-4 right-3 bg-gray30"
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
            "placeholder:!text-gray80 h-12 !bg-gray70 rounded-xl " +
            (error ? "border border-error" : "")
          }
          placeholder="Paste Wallet Address"
        />
        <button
          onClick={() =>
            navigator.clipboard.readText().then((text) => setText(text))
          }
          className="absolute z-10 top-1/2 right-3 -translate-y-1/2 btn btn--sm btn--primary-light font-semibold tracking-wide"
        >
          PASTE
        </button>
      </div>
      {!!error && <p className="text-xs ml-2 -mt-4 text-error">{error}</p>}

      <div className="mt-4">
        {userProfile?.wallets.map((wallet, key) => (
          <div
            onClick={() => {
              setClaimWalletAddress(wallet.address);
              setIsWalletChoosing(false);
            }}
            key={key}
            className="border cursor-pointer mt-3 font-semibold text-gray100 py-3 px-5 border-gray60 rounded-xl bg-gray40"
          >
            {shortenAddress(wallet.address)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseWalletBody;
