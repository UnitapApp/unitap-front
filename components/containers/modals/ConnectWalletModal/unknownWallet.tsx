"use client";

import Icon from "@/components/ui/Icon";
import { shortenAddress } from "@/utils";
import { useWalletAccount } from "@/utils/wallet";
import {
  ClaimButton,
  WhiteOutlinedButton,
} from "@/components/ui/Button/button";
import { FC } from "react";
import { WalletState } from ".";

const UnknownWalletBody: FC<{
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState }) => {
  const { address } = useWalletAccount();

  return (
    <div className="text-center">
      <Icon
        iconSrc="/assets/images/modal/unitap-welcome.svg"
        alt="unitap space"
      />

      <p className="font-semibold mt-3">Are you a new user?</p>
      <p className="mt-5 text-gray100 text-sm leading-6">
        If you already have a <span className="text-blue-200">Unitap </span>
        account, you can add this wallet{" "}
        <span className="underline">({shortenAddress(address)})</span> to your
        existing account but if you are a new user, you can register as new.
      </p>

      <WhiteOutlinedButton
        className="mb-4 !border-1 !font-semibold mt-5 !w-full bg-gray10"
        onClick={() => setWalletState(WalletState.LoggedIn)}
      >
        Add Wallet to an Existing Account
      </WhiteOutlinedButton>

      <ClaimButton
        onClick={() => setWalletState(WalletState.AddNewWallet)}
        className="!w-full"
      >
        <p className="font-semibold">Register as New User</p>
      </ClaimButton>
    </div>
  );
};

export default UnknownWalletBody;
