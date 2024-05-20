import {
  GetContractReturnType,
  PublicClient,
  getContract,
  Address,
} from "viem";

import { tokenTapAbi } from "@/types/abis/contracts";
import { GetWalletClientReturnType } from "wagmi/actions";
import { contractAddresses } from "@/constants";

export const extendDistributionCallback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  distributionId: bigint,
  setRefundRes: any,
  maxNumClaims: bigint,
  endTime: bigint,
  amount: bigint,
) => {
  const response = await signer?.writeContract({
    abi: tokenTapAbi,
    address: erc20Contract.address,
    account: address,
    functionName: "extendDistribution",
    args: [distributionId, maxNumClaims, endTime],
    value: amount ? amount : 0n,
  });

  if (response) {
    const res = await provider.waitForTransactionReceipt({
      hash: response,
      confirmations: 1,
    });

    setRefundRes({
      success: true,
      state: "Done",
      txHash: res.transactionHash,
      message: "Extended successfully.",
    });

    return;
  } else {
    setRefundRes({
      success: false,
      state: "Retry",
      message: "Extended failed.",
    });
  }

  return;
};

export const extendDistribution = async (
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  address: Address,
  chainId: number,
  distributionId: number,
  setRefundRes: any,
  maxNumClaims: bigint,
  endTime: bigint,
  amount: bigint,
) => {
  if (!provider || !signer) return;
  const contract = getContract({
    abi: tokenTapAbi,
    address: contractAddresses.tokenTap[chainId].erc20 as `0x${string}`,
    client: provider,
  });

  try {
    const response = await extendDistributionCallback(
      address,
      contract,
      provider,
      signer,
      BigInt(distributionId),
      setRefundRes,
      maxNumClaims,
      endTime,
      amount,
    );
    return response;
  } catch (e: any) {
    console.log(e);
  }
};
