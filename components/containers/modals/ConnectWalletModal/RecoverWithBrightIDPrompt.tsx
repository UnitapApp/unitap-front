"use client";

import { FC } from "react";
import { ConnectionProvider, WalletState } from ".";
import { ClaimButton } from "@/components/ui/Button/button";

const RecoverWithBrightIDPromptBody: FC<{
  walletProvider: ConnectionProvider;
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState, walletProvider }) => {
  return (
    <div className="text-sm">
      <div className="text-gray100">
        <p className="my-5">
          After recovering, all your wallets will be disconnected and unitap
          will ask for a new unconnected wallet
        </p>

        <p className="mb-5">1. Verify your bright id by scanning a QR code</p>
        <p>2. Connect your new wallet by a provider.</p>
      </div>

      <div className="mt-5">
        <ClaimButton
          onClick={() => setWalletState(WalletState.RecoverBrightConnect)}
          className="mt-5 !w-full before:!inset-[1px]"
        >
          <p className="text-base font-bold">Continue</p>
        </ClaimButton>
      </div>
    </div>
  );
};

export default RecoverWithBrightIDPromptBody;
