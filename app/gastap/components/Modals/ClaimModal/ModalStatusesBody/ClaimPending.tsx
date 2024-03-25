"use client";

import { FC } from "react";
import { Chain, ClaimReceipt } from "@/types";
import animation from "@/assets/animations/GasFee-delivery2.json";
import Lottie from "react-lottie";

const ClaimPendingBody: FC<{
  chain: Chain;
  closeClaimModal: () => void;
  activeClaimReceipt: ClaimReceipt;
}> = ({ chain, closeClaimModal, activeClaimReceipt }) => {
  return (
    <>
      <div className="-mt-10 w-full">
        <Lottie
          options={{
            animationData: animation,
            loop: true,
            autoplay: true,
          }}
          width={250}
        />
      </div>
      <p className="-mt-8 text-center text-sm font-semibold text-[#55E9A9]">
        Claim transaction submitted
      </p>
      <p className="mb-5 mt-8 text-sm text-gray100">
        The claim transaction will be completed soon...
      </p>

      <button
        onClick={closeClaimModal}
        className="gradient-button-st-1 mt-5 w-full rounded-3xl p-[1px]"
      >
        <div className="btn !rounded-3xl tracking-wide">Close</div>
      </button>
    </>
  );
};

export default ClaimPendingBody;
