"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "@/components/ui/Icon";
import { Chain } from "@/types";
import { getChainIcon } from "@/utils/chain";
import { BigNumber } from "@ethersproject/bignumber";
import JSBI from "jsbi";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useWalletProvider } from "@/utils/wallet";
import { nativeOnChain } from "@/constants/tokens";

interface ChainItemProps {
  chain: Chain;
  selected?: boolean;
  onClick: () => void;
  "data-testid"?: string;
}

const ChainItem = (props: ChainItemProps) => {
  const { selected, chain, onClick } = props;
  const icon = getChainIcon(chain);
  const provider = useWalletProvider();
  const [fundManagerBalance, setFundManagerBalance] =
    useState<BigNumber | null>(null);

  useEffect(() => {
    new StaticJsonRpcProvider(chain.rpcUrl)
      ?.getBalance(chain.fundManagerAddress)
      .then((balance) => {
        setFundManagerBalance(balance);
      });
  }, [chain, provider]);

  const fundManagerBalanceAmount = useMemo(() => {
    if (!fundManagerBalance) return null;
    const amount = JSBI.BigInt(fundManagerBalance.toString());
    return CurrencyAmount.fromRawAmount(
      nativeOnChain(Number(chain.chainId)),
      amount,
    );
  }, [fundManagerBalance]);

  return (
    <div
      className="duration-50 mb-3 flex cursor-pointer items-center rounded-xl border-2 border-gray50 bg-gray30 px-4 py-3.5 pl-3 transition-all last:mb-0 hover:border-gray80 hover:bg-gray40"
      onClick={onClick}
      data-testid={props["data-testid"]}
    >
      <Icon mr={2} width="32px" iconSrc={icon}></Icon>
      <p className="token-symbol mr-auto font-semibold text-white">
        {chain.chainName}
      </p>
      <p className="balance mr-2 text-xs text-gray90">Contract Balance: </p>
      <p className="balance-amount text-xs text-white">
        {fundManagerBalanceAmount
          ? fundManagerBalanceAmount.toSignificant(5)
          : "..."}
      </p>
      {selected && (
        <Icon
          className="ml-2"
          iconSrc="/assets/images/modal/check.svg"
          width="13px"
          height="auto"
        />
      )}
    </div>
  );
};

export default ChainItem;
