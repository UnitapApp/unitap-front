"use client"

import { useEffect, useMemo, useState } from "react"

import Icon from "@/components/ui/Icon"

import { Chain, ChainType } from "@/types"
import { BigNumber } from "@ethersproject/bignumber"
import JSBI from "jsbi"
import { CurrencyAmount } from "@uniswap/sdk-core"
import { StaticJsonRpcProvider } from "@ethersproject/providers"
import { Connection, PublicKey } from "@solana/web3.js"
import { numberWithCommas } from "@/utils/numbers"
import { useUserWalletProvider } from "@/utils/wallet"
import { nativeOnChain } from "@/constants/tokens"

interface props {
  chain: Chain
}

const ChainCard = ({ chain }: props) => {
  const [fundManagerBalance, setFundManagerBalance] = useState<
    BigNumber | string | null
  >(null)

  useEffect(() => {
    if (!chain) return
    const fetchBalance = async () => {
      try {
        if (chain.chainType === ChainType.SOLANA) {
          const result = await fetch(
            `/api/chains/${
              chain.isTestnet
                ? "get-solana-testnet-balance"
                : "get-solana-balance"
            }`
          ).then((res) => res.json())

          setFundManagerBalance(result.balance?.toString())
        } else {
          const provider = new StaticJsonRpcProvider(chain.rpcUrl)
          const balance = await provider.getBalance(chain.fundManagerAddress)
          setFundManagerBalance(balance)
        }
      } catch (error) {
        console.warn(error)
      }
    }

    fetchBalance()
  }, [chain])

  const fundManagerBalanceAmount = useMemo(() => {
    if (!fundManagerBalance || typeof fundManagerBalance === "string")
      return null
    const amount = JSBI.BigInt(fundManagerBalance.toString())
    return CurrencyAmount.fromRawAmount(
      nativeOnChain(Number(chain.chainId)),
      amount
    )
  }, [chain.chainId, fundManagerBalance])

  return (
    <div className="chain px-5 py-4 flex flex-col h-28 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
      <div className="flex-1 flex mb-4 text-white">
        {chain.chainName}
        <Icon
          className="ml-2"
          iconSrc={chain.logoUrl}
          width="auto"
          height="22px"
        />
      </div>
      <p className="text-xs mt-auto text-gray90 flex">
        balance:
        <span className="text-white ml-1">
          {typeof fundManagerBalance === "string"
            ? fundManagerBalance
            : fundManagerBalanceAmount
            ? numberWithCommas(
                parseFloat(fundManagerBalanceAmount.toSignificant(5))
              )
            : "..."}
        </span>
      </p>
    </div>
  )
}

export default ChainCard
