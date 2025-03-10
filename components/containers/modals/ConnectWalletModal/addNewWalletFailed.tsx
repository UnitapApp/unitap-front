import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { FC } from "react";
import { WalletState } from ".";
import { useDisconnect } from "wagmi";

const AddNewWalletFailed: FC<{
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState }) => {
  return (
    <>
      <Icon iconSrc="/assets/images/modal/unitap-error.svg" alt="error" />

      <div className="mt-4 flex items-center text-error">
        <p>We didn’t recognize your wallet!</p>
      </div>

      <p className="mt-3 text-center text-sm text-gray100">
        There seems to be no Unitap account with the wallet (0x8753...34h6).
      </p>

      <ClaimButton
        onClick={() => {
          setWalletState(WalletState.UnknownWallet);
        }}
        className="mt-8 !w-full"
      >
        <p className="font-semibold">Go Back</p>
      </ClaimButton>
    </>
  );
};

export default AddNewWalletFailed;
