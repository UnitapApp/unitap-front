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
          <p className="text-primary-dark">Gas Claimed!</p>
          <Icon iconSrc={gasIcon} width="22px" height="26px" />
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
          <p className="text-primary">
            Claiming {amount} {symbol}...
          </p>
        </div>
      </button>
    );
  }

  if (needsFunding) {
    return (
      <button disabled className="claim-button rounded-3xl p-[1px] text-sm">
        <div className="flex h-11 w-52 items-center justify-center rounded-3xl px-4">
          <p className="">
            Claim {amount} {symbol}
          </p>
        </div>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onClick}
        className="claim-button-idle group relative z-20 overflow-visible rounded-3xl p-[1px] text-sm"
      >
        <Icon
          width="36px"
          height="40px"
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 scale-75 transition-all group-hover:-top-12 group-hover:scale-100 group-hover:delay-300"
          iconSrc={gasIcon}
          alt={amount + " " + symbol}
        />
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
