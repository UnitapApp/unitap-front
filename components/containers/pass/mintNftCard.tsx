import { useCallback, useMemo, useState } from "react"
import { ClaimButton } from "@/components/ui/Button/button"

import Icon from "@/components/ui/Icon"
import {
  unitapPassBatchSaleABI,
  useUnitapPassBatchSaleBatchSize,
  useUnitapPassBatchSaleBatchSoldCount,
  useUnitapPassBatchSalePrice,
} from "@/types/abis/contracts"
import {
  UNITAP_PASS_BATCH_SALE_ADDRESS,
  getSupportedChainId,
} from "@/constants"
import {
  useAccountBalance,
  useNetworkSwitcher,
  useWalletAccount,
} from "@/utils/wallet"
import { SupportedChainId } from "@/constants/chains"
import { mainnet, useContractReads, useContractWrite } from "wagmi"
import { goerli } from "viem/chains"
import { CurrencyAmount } from "@uniswap/sdk-core"
import { nativeOnChain } from "@/constants/tokens"
import { useGlobalContext } from "@/context/globalProvider"

export const unitCost = (unitCount: number | bigint, decimals: number) =>
  BigInt(unitCount) * BigInt(10) ** BigInt(decimals)

export const costToUnit = (price: bigint, decimals: bigint) =>
  price / BigInt(10) ** decimals

const supportedChainId = getSupportedChainId()

const saleAddress = UNITAP_PASS_BATCH_SALE_ADDRESS[supportedChainId]

const MintNFTCard = () => {
  const [count, setCount] = useState(1)

  const { data: contractsRes, isLoading: isContractLoading } = useContractReads(
    {
      watch: true,
      contracts: [
        {
          abi: unitapPassBatchSaleABI,
          functionName: "batchSoldCount",
          chainId: supportedChainId,
          address: saleAddress,
        },
        {
          abi: unitapPassBatchSaleABI,
          functionName: "price",
          chainId: supportedChainId,
          address: saleAddress,
        },
        {
          abi: unitapPassBatchSaleABI,
          functionName: "batchSize",
          chainId: supportedChainId,
          address: saleAddress,
        },
      ],
    }
  )

  const remainingCount = useMemo(
    () =>
      contractsRes
        ? (contractsRes[2].result as number) -
          ((contractsRes[0].result as number) ?? 0)
        : undefined,
    [contractsRes]
  )

  const { setIsWalletPromptOpen } = useGlobalContext()

  const { selectedNetwork, switchChain: addAndSwitchToChain } =
    useNetworkSwitcher()

  const { isConnected, address } = useWalletAccount()

  const { data: accountBalance } = useAccountBalance(address, supportedChainId)

  const chainId = selectedNetwork?.id

  const isRightChain = useMemo(() => {
    if (!chainId) return false
    return chainId === supportedChainId
  }, [chainId])

  const priceAmount = useMemo(() => {
    const chain =
      supportedChainId === SupportedChainId.MAINNET ? mainnet : goerli

    if (!contractsRes?.[1].result) return undefined

    return CurrencyAmount.fromRawAmount(
      nativeOnChain(chain.id),
      contractsRes[1].result.toString()
    )
  }, [contractsRes])

  const totalPriceAmount = useMemo(() => {
    if (!priceAmount) return undefined

    return priceAmount.multiply(count)
  }, [count, priceAmount])

  const [loading, setLoading] = useState(false)

  const { write, data, isLoading, isSuccess, isError, error, reset, isIdle } =
    useContractWrite({
      abi: unitapPassBatchSaleABI,
      account: address,
      functionName: "multiMint",
      chainId: supportedChainId,
      address: UNITAP_PASS_BATCH_SALE_ADDRESS[supportedChainId],
    })

  const chainScanLink = useMemo(() => {
    if (data?.hash) {
      if (chainId === SupportedChainId.MAINNET) {
        return `https://etherscan.io/tx/${data.hash}`
      } else if (chainId === SupportedChainId.GOERLI) {
        return `https://goerli.etherscan.io/tx/${data.hash}`
      }
    }
  }, [chainId, data?.hash])

  const switchNetwork = () => {
    if (supportedChainId === SupportedChainId.MAINNET) {
      addAndSwitchToChain(SupportedChainId.MAINNET)
    } else if (supportedChainId === SupportedChainId.GOERLI) {
      addAndSwitchToChain(SupportedChainId.GOERLI)
    }
  }

  const sufficientAmount = useMemo(() => {
    if (supportedChainId === SupportedChainId.MAINNET) {
      return (
        unitCost(1, mainnet.nativeCurrency.decimals) * BigInt(count) <=
        (accountBalance?.value ?? BigInt(0))
      )
    } else if (supportedChainId === SupportedChainId.GOERLI) {
      return (
        unitCost(1, goerli.nativeCurrency.decimals) * BigInt(count) <=
        (accountBalance?.value ?? BigInt(0))
      )
    }

    return false
  }, [count, accountBalance])

  const mintPass = useCallback(async () => {
    if (loading) return
    setLoading(true)

    write({
      args: [count, address!],
      value: BigInt(contractsRes?.[1].result! as number) * BigInt(count),
    })

    // try {
    //   const tx = await mintPassCallback?.()
    //   if (tx) {
    //     setSubmittedTxHash(tx.hash)
    //     setTransactionState(TransactionState.PENDING)
    //     tx.wait()
    //       .then(() => {
    //         if (mounted.current) {
    //           setTransactionState(TransactionState.ACCEPTED)
    //           // console.log(res);
    //           // setOpenseaLink(``);
    //         }
    //       })
    //       .catch(() => {
    //         if (mounted.current) {
    //           setTransactionState(TransactionState.FAILED)
    //         }
    //       })
    //   }
    // } catch (e) {
    //   console.log("mint failed")
    //   console.log(e)
    // }
  }, [loading])

  return (
    <div className="mint-nft-card h-full flex flex-col justify-between ">
      {!isIdle ? (
        <div className="mint-nft-card__success p-4 h-full flex flex-col justify-between">
          <p className="text-gradient-primary mx-auto font-bold text-sm">
            UNITAP PASS
          </p>
          <div className="mint-nft-card__nft__image w-full my-6 flex justify-center">
            <div className="mint-nft-card__nft__image__wrapper w-full h-auto">
              <div className="w-full h-full overflow-hidden rounded-lg">
                <video
                  src="assets/videos/unitap-pass.mp4"
                  autoPlay
                  muted
                  loop
                  className="w-full object-cover"
                  poster="assets/images/nft/nft-poster.jpg"
                />
              </div>
            </div>
          </div>
          {isSuccess ? (
            <>
              <p className="text-space-green mx-auto font-bold text-sm mb-3">
                {count} Unitap Pass{count > 1 ? "es" : ""} Minted Successfully
              </p>
              <p
                onClick={() => window.open(chainScanLink, "_blank")}
                className="text-white mx-auto font-medium text-sm mb-6 hover:underline cursor-pointer"
              >
                See on{" "}
                {supportedChainId === SupportedChainId.MAINNET
                  ? "Etherscan"
                  : "Goerli Etherscan"}
              </p>
            </>
          ) : isLoading ? (
            <p className="text-gradient-primary mx-auto font-medium text-sm mb-3">
              Minting {count} Unitap Pass{count > 1 ? "es" : ""}!
            </p>
          ) : (
            <p className="text-rose-800 mx-auto font-medium text-sm mb-3">
              {error?.message}!
            </p>
          )}
          {isSuccess || isError ? (
            <ClaimButton onClick={reset} height="48px" $width="100% !important">
              <p>Done</p>
            </ClaimButton>
          ) : (
            <ClaimButton height="48px" $width="100% !important" disabled>
              <p>Pending</p>
            </ClaimButton>
          )}
        </div>
      ) : (
        <>
          <div className="mint-nft-card__nft p-2 h-full flex flex-col justify-between">
            <div className="mint-nft-card__nft__info text-xs font-medium flex items-center w-full justify-between">
              <p className="text-gray100 bg-gray10 px-3 py-2 rounded-lg text-xs flex gap-1">
                Network:
                <span className="text-white flex">
                  {" "}
                  ETH{" "}
                  <img
                    className={"w-2.5 h-auto ml-2"}
                    src={"assets/images/nft/eth-icon.svg"}
                    alt={""}
                  />{" "}
                </span>
              </p>
              <p className="text-gray100">
                <span className="text-white">
                  {" "}
                  {remainingCount === undefined ? "..." : remainingCount}{" "}
                </span>{" "}
                of
                <span className="text-white">
                  {" "}
                  {isContractLoading
                    ? "..."
                    : (contractsRes?.[0].result as number).toString()}{" "}
                </span>
                Left in current batch
              </p>
            </div>
            <div className="mint-nft-card__nft__image w-full my-5 flex justify-center">
              <div className="mint-nft-card__nft__image__wrapper w-[312px] h-auto">
                <div className="w-full h-full overflow-hidden rounded-lg">
                  <video
                    src="assets/videos/unitap-pass.mp4"
                    autoPlay
                    muted
                    loop
                    className="w-full object-cover"
                  ></video>
                </div>
              </div>
            </div>
            <div className="mint-nft-card__nft__price text-sm font-semibold flex w-full justify-between mt-auto">
              <p className="text-white">{count > 1 && "Total"} Price:</p>
              <div className="text-gray100 flex gap-x-1.5">
                {count > 1 && isRightChain && (
                  <p>
                    {count} x{priceAmount?.toSignificant(5) || "0"} ETH ={" "}
                  </p>
                )}
                <span className="text-white">
                  {totalPriceAmount === undefined
                    ? "..."
                    : totalPriceAmount?.toSignificant(5) || "0"}{" "}
                  ETH
                </span>
              </div>
            </div>
          </div>
          <div className="mint-nft-card__actions bg-gray30 w-full flex-col lg:flex-row flex gap-2 justify-between items-center py-3 px-4">
            {isRightChain && remainingCount && remainingCount > 0 && (
              <div className="mint-nft-card__actions__quantity w-full lg:w-auto flex items-center">
                <div
                  className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-l-xl ${
                    count === 1
                      ? "cursor-default"
                      : "cursor-pointer hover:bg-primaryGradient"
                  }`}
                  onClick={() => (count !== 1 ? setCount(count - 1) : null)}
                >
                  {count === 1 ? (
                    <Icon iconSrc="/assets/images/nft/nft-minus-gray.svg" />
                  ) : (
                    <Icon iconSrc="/assets/images/nft/nft-minus-white.svg" />
                  )}
                </div>
                <div
                  className={`text-white border-y-2 border-gray60  py-3 flex-1 h-12 min-w-[48px] flex items-center justify-center font-bold cursor-default`}
                >
                  {count}
                </div>
                <div
                  className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-r-xl ${
                    count === remainingCount
                      ? "cursor-default"
                      : "cursor-pointer hover:bg-primaryGradient"
                  }`}
                  onClick={() =>
                    count !== remainingCount ? setCount(count + 1) : null
                  }
                >
                  {count === remainingCount ? (
                    <Icon iconSrc="assets/images/nft/nft-plus-gray.svg" />
                  ) : (
                    <Icon iconSrc="assets/images/nft/nft-plus-white.svg" />
                  )}
                </div>
              </div>
            )}
            {!isConnected ? (
              <ClaimButton
                onClick={setIsWalletPromptOpen.bind(null, true)}
                height="48px"
                $width="100% !important"
              >
                <p>Connect Wallet</p>
              </ClaimButton>
            ) : isRightChain ? (
              remainingCount ? (
                sufficientAmount ? (
                  <ClaimButton height="48px" $width="100% !important" disabled>
                    <p>Insufficient ETH Amount</p>
                  </ClaimButton>
                ) : (
                  <ClaimButton
                    onClick={mintPass}
                    height="48px"
                    $width="100% !important"
                    disabled={isLoading}
                  >
                    <p>{isLoading ? "Contract Loading" : "Mint Unitap Pass"}</p>
                  </ClaimButton>
                )
              ) : (
                <ClaimButton height="48px" $width="100% !important" disabled>
                  <p>Sold Out</p>
                </ClaimButton>
              )
            ) : (
              <ClaimButton
                onClick={switchNetwork}
                height="48px"
                $width="100% !important"
              >
                <p>Switch Network</p>
              </ClaimButton>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MintNFTCard
