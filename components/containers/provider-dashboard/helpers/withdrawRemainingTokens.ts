import {
  GetContractReturnType,
  PublicClient,
  getContract,
  Address,
} from "viem";

import { tokenTapAbi } from "@/types/abis/contracts";
import { GetWalletClientReturnType } from "wagmi/actions";
import { contractAddresses } from "@/constants";

export const withdrawRemainingTokensCallback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  distributionId: bigint,
  setRefundRes: any,
) => {
  const response = await signer?.writeContract({
    abi: tokenTapAbi,
    address: erc20Contract.address,
    account: address,
    functionName: "withdrawReaminingTokens",
    args: [address, distributionId],
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
      message: "Token claimed successfully.",
    });

    return;
  } else {
    setRefundRes({
      success: false,
      state: "Retry",
      message: "Token claimed successfully.",
    });
  }

  return;
};

export const withdrawRemainingTokens = async (
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  address: Address,
  chainId: number,
  distributionId: number,
  setRefundRes: any,
) => {
  if (!provider || !signer) return;
  const contract = getContract({
    abi: tokenTapAbi,
    address: contractAddresses.tokenTap[chainId].erc20 as `0x${string}`,
    client: provider,
  });

  try {
    const response = await withdrawRemainingTokensCallback(
      address,
      contract,
      provider,
      signer,
      BigInt(distributionId),
      setRefundRes,
    );
    return response;
  } catch (e: any) {
    console.log(e);
  }
};
