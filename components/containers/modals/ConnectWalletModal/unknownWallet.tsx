"use client";

import Icon from "@/components/ui/Icon";
import { shortenAddress } from "@/utils";
import { useWalletAccount } from "@/utils/wallet";
import { ClaimButton } from "@/components/ui/Button/button";
import { FC, useEffect, useRef } from "react";
import { WalletState } from ".";
import { Address } from "viem";

const UnknownWalletBody: FC<{
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState }) => {
  const { address } = useWalletAccount();

  const previousAddressRef = useRef<Address | null>();

  useEffect(() => {
    if (!address) return;
    if (!previousAddressRef.current) previousAddressRef.current = address;

    if (address !== previousAddressRef.current)
      setWalletState(WalletState.Prompt);
  }, [address, setWalletState]);

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

      <ClaimButton
        onClick={() => setWalletState(WalletState.SignMessage)}
        className="!w-full mb-5 mt-5 before:!inset-[1px]"
      >
        <p className="font-bold text-base">Register as New User</p>
      </ClaimButton>

      <p
        className="underline mb-2 cursor-pointer"
        onClick={() => setWalletState(WalletState.AddNewWallet)}
      >
        Add Wallet to an Existing Account
      </p>
    </div>
  );
};

export default UnknownWalletBody;
