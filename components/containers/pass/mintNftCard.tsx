import { useCallback, useEffect, useMemo, useState } from "react";
import { ClaimButton } from "@/components/ui/Button/button";

import Icon from "@/components/ui/Icon";
import {
  unitapEvmTokenTapAbi,
  unitapPassBatchSaleAbi,
} from "@/types/abis/contracts";
import {
  UNITAP_PASS_BATCH_SALE_ADDRESS,
  getSupportedChainId,
} from "@/constants";
import {
  useAccountBalance,
  useNetworkSwitcher,
  useWalletAccount,
} from "@/utils/wallet";
import { SupportedChainId } from "@/constants/chains";
import { useReadContracts, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { goerli } from "viem/chains";
import { CurrencyAmount } from "@uniswap/sdk-core";
import { nativeOnChain } from "@/constants/tokens";
import { useGlobalContext } from "@/context/globalProvider";
import Image from "next/image";
import { useUserProfileContext } from "@/context/userProfile";
import { toWei } from "@/utils";

export const unitCost = (unitCount: number | bigint, decimals: number) =>
  BigInt(unitCount) * BigInt(10) ** BigInt(decimals);

export const costToUnit = (price: bigint, decimals: bigint) =>
  price / BigInt(10) ** decimals;

const supportedChainId = getSupportedChainId();

const saleAddress = UNITAP_PASS_BATCH_SALE_ADDRESS[supportedChainId];

const MintNFTCard = () => {
  const [count, setCount] = useState(1);

  const { data: contractsRes, isLoading: isContractLoading } = useReadContracts(
    {
      // multicallAddress: saleAddress,
      contracts: [
        {
          abi: unitapPassBatchSaleAbi,
          functionName: "batchSoldCount",
          chainId: supportedChainId,
          address: saleAddress,
        },
        {
          abi: unitapPassBatchSaleAbi,
          functionName: "price",
          chainId: supportedChainId,
          address: saleAddress,
        },
        {
          abi: unitapPassBatchSaleAbi,
          functionName: "batchSize",
          chainId: supportedChainId,
          address: saleAddress,
        },
      ],
    },
  );

  const batchSize = 500;
  const beforeMinted = 312;
  // const remainingCount = useMemo(
  //   () =>
  //     contractsRes
  //       ? (contractsRes[2].result as number) -
  //         ((contractsRes[0].result as number) ?? 0)
  //       : undefined,
  //   [contractsRes],
  // );

  const remainingCount = useMemo(
    () =>
      contractsRes
        ? batchSize - ((contractsRes[0].result as number) + beforeMinted ?? 0)
        : undefined,
    [contractsRes],
  );

  const { setIsWalletPromptOpen } = useGlobalContext();

  const { selectedNetwork, switchChain: addAndSwitchToChain } =
    useNetworkSwitcher();

  const { isConnected, address } = useWalletAccount();
  const { userProfile } = useUserProfileContext();

  const { data: accountBalance } = useAccountBalance(address, supportedChainId);

  const chainId = selectedNetwork?.id;

  const isRightChain = useMemo(() => {
    if (!chainId) return false;
    return chainId === supportedChainId;
  }, [chainId]);

  const priceAmount = useMemo(() => {
    const chain = supportedChainId === SupportedChainId.BASE ? base : goerli;

    if (!contractsRes?.[1].result) return undefined;

    return CurrencyAmount.fromRawAmount(
      nativeOnChain(chain.id),
      contractsRes[1].result.toString(),
    );
  }, [contractsRes]);

  const totalPriceAmount = useMemo(() => {
    if (!priceAmount) return undefined;

    return priceAmount.multiply(count);
  }, [count, priceAmount]);

  const [loading, setLoading] = useState(false);

  const {
    writeContractAsync,
    data,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
    isIdle,
    status,
    isPaused,
  } = useWriteContract({});

  const chainScanLink = useMemo(() => {
    if (data) {
      if (chainId === SupportedChainId.BASE) {
        return `https://basescan.org/tx/${data}`;
      }
    }
  }, [chainId, data]);

  const switchNetwork = () => {
    if (supportedChainId === SupportedChainId.BASE) {
      addAndSwitchToChain(SupportedChainId.BASE);
    }
  };

  const [sufficientAmount, setSufficientAmount] = useState<boolean>(false);

  useEffect(() => {
    if (supportedChainId === SupportedChainId.BASE) {
      setSufficientAmount(
        BigInt(toWei(0.1) * count) > (accountBalance?.value ?? BigInt(0)),
      );
    }
  }, [count, accountBalance, supportedChainId]);

  const mintPass = useCallback(async () => {
    if (loading) return;

    if (!UNITAP_PASS_BATCH_SALE_ADDRESS[supportedChainId]) return;

    setLoading(true);

    // console.log(count);

    try {
      await writeContractAsync({
        args: [count, address!],
        value: contractsRes?.[1].result! * BigInt(count),
        abi: unitapPassBatchSaleAbi,
        account: address,
        functionName: "multiMint",
        chainId: supportedChainId,
        address: UNITAP_PASS_BATCH_SALE_ADDRESS[supportedChainId]!,
      });
    } finally {
      setLoading(false);
    }

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
  }, [address, contractsRes, count, loading, writeContractAsync]);

  return (
    <div className={`mint-nft-card flex h-full flex-col justify-between`}>
      {!isIdle && !isError ? (
        <div className="mint-nft-card__success flex h-full flex-col justify-between p-4">
          <p className="text-gradient-primary mx-auto text-sm font-bold">
            UNITAP PASS
          </p>
          <div className="mint-nft-card__nft__image my-6 flex w-full justify-center">
            <div className="mint-nft-card__nft__image__wrapper h-auto w-full">
              <div className="h-full w-full overflow-hidden rounded-lg">
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
              <p className="mx-auto mb-3 text-sm font-bold text-space-green">
                {count} Unitap Pass{count > 1 ? "es" : ""} Minted Successfully
              </p>
              <p
                onClick={() => window.open(chainScanLink, "_blank")}
                className="mx-auto mb-6 cursor-pointer text-sm font-medium text-white hover:underline"
              >
                See on{" "}
                {supportedChainId === SupportedChainId.BASE
                  ? "base scan"
                  : "Goerli Etherscan"}
              </p>
            </>
          ) : isPending ? (
            <p className="text-gradient-primary mx-auto mb-3 text-sm font-medium">
              Minting {count} Unitap Pass{count > 1 ? "es" : ""}!
            </p>
          ) : (
            <p className="mx-auto mb-3 text-sm font-medium text-rose-800">
              Error has been occurred!
            </p>
          )}
          {isSuccess || isError ? (
            <ClaimButton onClick={reset} height="48px" className="!w-full">
              <p>Done</p>
            </ClaimButton>
          ) : (
            <ClaimButton height="48px" className="!w-full" disabled>
              <p>Pending</p>
            </ClaimButton>
          )}
        </div>
      ) : (
        <>
          <div className="mint-nft-card__nft relative  flex h-full flex-col justify-between p-2">
            <div className="  absolute z-10 h-full w-full">
              <div className="animate-unitap-pass-1 absolute h-32 w-32 rounded-full bg-[#4BF2A2] blur-[70px]"></div>
              <div className="animate-unitap-pass-2 absolute right-0 h-32 w-32 rounded-full bg-[#DD40CD] blur-[70px]"></div>
              <div className="animate-unitap-pass-3 absolute bottom-0 right-0 h-32 w-32 rounded-full bg-[#A89FE7] blur-[70px] "></div>
            </div>
            <div className="mint-nft-card__nft__info z-20 flex w-full items-center justify-between text-xs font-medium">
              <p className="flex gap-1 rounded-lg bg-gray10 px-2 py-2 text-xs text-gray100">
                Network:
                <span className="flex text-white">
                  {" "}
                  BASE{" "}
                  <Image
                    width={10}
                    height={16}
                    className={"ml-2 h-auto w-4"}
                    src={"/assets/images/pass/base-network.svg"}
                    alt={"ethereum"}
                  />
                </span>
              </p>
              <p className=" text-gray100">
                <span className="text-white">
                  {" "}
                  {remainingCount === undefined ? "..." : remainingCount}{" "}
                </span>{" "}
                of
                <span className="text-white">
                  {" "}
                  {isContractLoading ? "..." : batchSize.toString()}{" "}
                </span>
                Left in current batch
              </p>
            </div>
            <div className="mint-nft-card__nft__image z-20 my-5 flex w-full justify-center">
              <div className="mint-nft-card__nft__image__wrapper h-auto w-[312px]">
                <div className="h-full w-full overflow-hidden rounded-lg">
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
            <div className="mint-nft-card__nft__price mt-auto flex w-full justify-between text-sm font-semibold">
              <p className="text-white">{count > 1 && "Total"} Price:</p>
              <div className="flex gap-x-1.5 text-gray100">
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
          <div className="flex w-full items-center justify-between gap-2 bg-gray30 px-4 py-3">
            <div className="mint-nft-card__actions flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              {isRightChain && remainingCount && remainingCount > 0 && (
                <div className="mint-nft-card__actions__quantity flex w-full items-center lg:w-auto">
                  <div
                    className={`flex h-12 min-w-[48px] flex-1 items-center justify-center rounded-l-xl border-2 border-gray60 py-3 text-white ${
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
                    className={`flex h-12 min-w-[48px]  flex-1 cursor-default items-center justify-center border-y-2 border-gray60 py-3 font-bold text-white`}
                  >
                    {count}
                  </div>
                  <div
                    className={`flex h-12 min-w-[48px] flex-1 items-center justify-center rounded-r-xl border-2 border-gray60 py-3 text-white ${
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
              {!userProfile ? (
                <button
                  className="btn btn--sm btn--primary h-11 w-full rounded-xl !py-0 align-baseline font-bold text-gray10"
                  onClick={setIsWalletPromptOpen.bind(null, true)}
                >
                  <p>Connect Wallet</p>
                </button>
              ) : !isConnected ? (
                <button
                  className="btn btn--sm btn--primary h-11 w-full rounded-xl !py-0 align-baseline font-bold text-gray10"
                  onClick={setIsWalletPromptOpen.bind(null, true)}
                  // height="46px"
                  // $width="100% !important"
                >
                  <p>Connect Wallet</p>
                </button>
              ) : isRightChain ? (
                remainingCount ? (
                  sufficientAmount ? (
                    <ClaimButton
                      height="48px"
                      $width="100% !important"
                      disabled
                    >
                      <p>Insufficient ETH Amount</p>
                    </ClaimButton>
                  ) : (
                    <button
                      className="btn btn--sm btn--primary h-11 w-full rounded-xl !py-0 align-baseline font-bold text-gray10"
                      onClick={mintPass}
                      disabled={isPending}
                    >
                      <p>
                        {isPending ? "Contract Loading" : "Mint Unitap Pass"}
                      </p>
                    </button>
                  )
                ) : (
                  !isContractLoading && (
                    <ClaimButton
                      height="48px"
                      $width="100% !important"
                      disabled
                    >
                      <p>Sold Out</p>
                    </ClaimButton>
                  )
                )
              ) : (
                <button
                  className="btn btn--sm btn--primary h-11 w-full rounded-xl !py-0 align-baseline font-bold text-gray10"
                  onClick={switchNetwork}
                >
                  <p>Switch Network</p>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MintNFTCard;
