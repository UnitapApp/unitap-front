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
          className="mt-10 mx-auto"
          src="/assets/images/modal/delete-wallet.svg"
          alt="delete wallet"
          width={142}
          height={116}
        />
        <div className="mt-7 text-center">
          <p className="text-gray100 px-5">
            Are You sure you want to remove this wallet address? You will not be
            able to add this wallet to another Unitap account.
          </p>
        </div>
        <div
          className={
            "rounded-xl mt-6 border px-5 font-normal text-center py-4 border-gray70 " +
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
          className="mt-10 disabled:opacity-60 hover:bg-gray30 transition-colors text-base font-semibold text-error rounded-xl border-2 border-error bg-gray20 text-center w-full py-3"
        >
          <p>Remove</p>
        </button>
      </div>
    </Modal>
  );
};

export default DeleteWalletModal;
