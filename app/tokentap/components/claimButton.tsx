"use client";

import Icon from "@/components/ui/Icon";
import { FC } from "react";

export type ClaimButtonProps = {
  amount: string | number;
  symbol: string;
  isClaiming: boolean;
  isEmpty: boolean;
  isClaimed: boolean;
  tokenLogo?: string;
  disabled: boolean;
  onClick: () => void;
};

const ClaimTokenButton: FC<ClaimButtonProps> = ({
  amount,
  disabled,
  isClaimed,
  isClaiming,
  symbol,
  onClick,
  tokenLogo,
}) => {
  if (isClaimed) {
    return (
      <button
        onClick={onClick}
        className="claim-button claimed rounded-3xl p-[1px] text-sm"
      >
        <div className="h-11 px-4 relative w-52 flex items-center justify-between rounded-3xl">
          <p className="text-[#83B39E]">Claimed!</p>
          <Icon iconSrc={tokenLogo!} width="32px" />
          <div className="absolute right-0 top-0 bottom-0 w-16 success-bg rounded-r-3xl"></div>
        </div>
      </button>
    );
  }

  if (isClaiming) {
    return (
      <button
        onClick={onClick}
        className="claim-button pending rounded-3xl p-[1px] text-sm"
      >
        <div className="h-11 px-4 w-52 flex items-center justify-center rounded-3xl">
          <p className="font-semibold text-[#8B6D8B]">Pending...</p>
        </div>
      </button>
    );
  }

  // if (needsFunding) {
  //   return (
  //     <button disabled className="claim-button rounded-3xl p-[1px] text-sm">
  //       <div className="h-11 px-4 w-52 flex items-center justify-center rounded-3xl">
  //         <p className="font-semibold text-[#8B6D8B]">
  //           Claim {amount} {symbol}
  //         </p>
  //       </div>
  //     </button>
  //   );
  // }

  return (
    <button
      onClick={onClick}
      className="claim-button rounded-3xl p-[1px] text-sm"
    >
      <div className="h-11 px-4 w-52 flex items-center justify-center rounded-3xl">
        <p className="bg-ut-grad-ltr text-transparent font-semibold bg-clip-text">
          Claim {amount} {symbol}
        </p>
      </div>
    </button>
  );
};

export default ClaimTokenButton;
