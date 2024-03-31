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
  gasIcon: string;
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
  gasIcon,
}) => {
  if (isClaimed) {
    return (
      <button
        onClick={onClick}
        className="claim-button claimed rounded-3xl p-[1px] text-sm"
      >
        <div className="flex h-11 w-52 items-center justify-between rounded-3xl px-4">
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
        <div className="flex h-11 w-52 items-center justify-center rounded-3xl px-4">
          <p className="font-semibold text-[#8B6D8B]">Pending...</p>
        </div>
      </button>
    );
  }

  if (needsFunding) {
    return (
      <button disabled className="claim-button rounded-3xl p-[1px] text-sm">
        <div className="flex h-11 w-52 items-center justify-center rounded-3xl px-4">
          <p className="font-semibold text-[#8B6D8B]">
            Claim {amount} {symbol}
          </p>
        </div>
      </button>
    );
  }

  return (
    <>
      <Icon
        width="36px"
        height="40px"
        className="absolute -top-4 left-1/2 z-50 -translate-x-1/2"
        iconSrc={gasIcon}
        alt={amount + " " + symbol}
      />
      <button
        onClick={onClick}
        className="claim-button-idle group overflow-x-hidden rounded-3xl p-[1px] text-sm"
      >
        <Icon
          iconSrc="/assets/images/gas-tap/half-circle.svg"
          alt="half circle"
          width="14px"
          className="absolute -right-3 top-1/2 -translate-y-1/2 transition-all group-hover:right-2"
          height="28px"
        />
        <Icon
          iconSrc="/assets/images/gas-tap/half-circle.svg"
          alt="half circle"
          width="14px"
          className="absolute -left-3 top-1/2 -translate-y-1/2 rotate-180 transition-all group-hover:left-2"
          height="28px"
        />

        <Icon
          iconSrc="/assets/images/gas-tap/half-circle-secondary.svg"
          alt="half circle secondary"
          width="8px"
          className="absolute right-[14px] top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-75 group-hover:opacity-100 group-hover:delay-300"
          height="16px"
        />
        <Icon
          iconSrc="/assets/images/gas-tap/half-circle-secondary.svg"
          alt="half circle secondary"
          width="8px"
          className="absolute left-[14px] top-1/2 -translate-y-1/2 rotate-180 opacity-0 transition-opacity duration-0 group-hover:opacity-100 group-hover:delay-300"
          height="16px"
        />
        <div className="flex h-11 w-52 items-center justify-center rounded-3xl px-4">
          <p>
            Claim {amount} {symbol}
          </p>
        </div>
      </button>
    </>
  );
};

export default ClaimButton;
