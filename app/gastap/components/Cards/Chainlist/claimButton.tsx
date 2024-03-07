"use client";

import Icon from "@/components/ui/Icon";
import { FC } from "react";

export type ClaimButtonProps = {
  needsFunding: boolean;
  amount: string | number;
  symbol: string;
  isClaiming: boolean;
  isClaimed: boolean;
  disabled: boolean;
  onClick: () => void;
};

const ClaimButton: FC<ClaimButtonProps> = ({
  amount,
  disabled,
  isClaimed,
  isClaiming,
  needsFunding,
  symbol,
  onClick,
}) => {
  if (isClaimed) {
    return (
      <button
        onClick={onClick}
        className="claim-button claimed rounded-3xl p-[1px] text-sm"
      >
        <div className="h-11 px-4 w-52 flex items-center justify-between rounded-3xl">
          <p className="text-[#83B39E]">Gas Claimed!</p>
          <Icon iconSrc="/assets/images/gas-tap/claimed-gallon.svg" />
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

  if (needsFunding) {
    return (
      <button disabled className="claim-button rounded-3xl p-[1px] text-sm">
        <div className="h-11 px-4 w-52 flex items-center justify-center rounded-3xl">
          <p className="font-semibold text-[#8B6D8B]">
            Claim {amount} {symbol}
          </p>
        </div>
      </button>
    );
  }

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

export default ClaimButton;
