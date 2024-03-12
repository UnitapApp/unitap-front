"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "@/components/ui/Icon";

import { Chain, ChainType } from "@/types";
import { BigNumber } from "@ethersproject/bignumber";
import JSBI from "jsbi";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { numberWithCommas } from "@/utils/numbers";
import { nativeOnChain } from "@/constants/tokens";

interface props {
  chain: Chain;
}

const ChainCard = ({ chain }: props) => {
  const [fundManagerBalance, setFundManagerBalance] = useState<
    BigNumber | string | null
  >(null);

  useEffect(() => {
    if (!chain) return;
    const fetchBalance = async () => {
      try {
        if (chain.chainType === ChainType.SOLANA) {
          const result = await fetch(
            `/api/chains/${
              chain.isTestnet
                ? "get-solana-testnet-balance"
                : "get-solana-balance"
            }`,
          ).then((res) => res.json());

          setFundManagerBalance(result.balance?.toString());
        } else if (chain.rpcUrl) {
          const provider = new StaticJsonRpcProvider(chain.rpcUrl);
          const balance = await provider.getBalance(chain.fundManagerAddress);
          setFundManagerBalance(balance);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    fetchBalance();
  }, [chain]);

  const fundManagerBalanceAmount = useMemo(() => {
    if (!fundManagerBalance || typeof fundManagerBalance === "string")
      return null;
    const amount = JSBI.BigInt(fundManagerBalance.toString());
    return CurrencyAmount.fromRawAmount(
      nativeOnChain(Number(chain.chainId)),
      amount,
    );
  }, [chain.chainId, fundManagerBalance]);

  return (
    <div className="chain flex h-28 flex-col border-r-gray30 px-5 py-4 sm:border-r-2 lg:w-36 xl:w-40">
      <div className="mb-4 flex flex-1 text-white">
        {chain.chainName}
        <Icon
          className="ml-2"
          iconSrc={chain.logoUrl}
          width="auto"
          height="22px"
        />
      </div>
      <p className="mt-auto flex text-xs text-gray90">
        balance:
        <span className="ml-1 text-white">
          {typeof fundManagerBalance === "string"
            ? fundManagerBalance
            : fundManagerBalanceAmount
              ? numberWithCommas(
                  parseFloat(fundManagerBalanceAmount.toSignificant(5)),
                )
              : "..."}
        </span>
      </p>
    </div>
  );
};

export default ChainCard;
