"use client";

import Modal from "@/components/ui/Modal/modal";
import Image from "next/image";
import { Noto_Sans_Mono } from "next/font/google";
import { useProfileEditContext } from "../layout";
import { useUserProfileContext } from "@/context/userProfile";
import { useState } from "react";
import { shortenAddress } from "@/utils";

const NotoSansMono = Noto_Sans_Mono({
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

const DeleteWalletModal = () => {
  const { focusedWalletDeleteAddress, setFocusedWalletDeleteAddress } =
    useProfileEditContext();
  const { deleteWallet } = useUserProfileContext();

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="Remove wallet address"
      size="small"
      isOpen={!!focusedWalletDeleteAddress}
      closeModalHandler={() => setFocusedWalletDeleteAddress(null)}
    >
      <div className="w-full text-sm">
        <Image
          className="mx-auto mt-10"
          src="/quest/assets/images/modal/delete-wallet.svg"
          alt="delete wallet"
          width={142}
          height={116}
        />
        <div className="mt-7 text-center">
          <p className="px-5 text-gray100">
            Are You sure you want to remove this wallet address? You will not be
            able to add this wallet to another Unitap account.
          </p>
        </div>
        <div
          className={
            "mt-6 rounded-xl border border-gray70 px-5 py-4 text-center font-normal " +
            NotoSansMono.className
          }
        >
          {shortenAddress(focusedWalletDeleteAddress)}
        </div>

        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);

            deleteWallet(focusedWalletDeleteAddress!)
              .then(() => setFocusedWalletDeleteAddress(null))
              .finally(() => setLoading(false));
          }}
          className="mt-10 w-full rounded-xl border-2 border-error bg-gray20 py-3 text-center text-base font-semibold text-error transition-colors hover:bg-gray30 disabled:opacity-60"
        >
          <p>Remove</p>
        </button>
      </div>
    </Modal>
  );
};

export default DeleteWalletModal;
