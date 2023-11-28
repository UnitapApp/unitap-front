import { ProviderDashboardFormDataProp } from "@/types";
import { toWei } from "@/utils";
import { GetContractReturnType, getContract } from "viem";
import { Address, PublicClient, erc20ABI } from "wagmi";
import { GetWalletClientResult } from "wagmi/dist/actions";

export const approveErc20TokenCallback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  spenderAddress: Address,
  tokenAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientResult,
  payableAmount: bigint,
  decimals: number
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc20ABI,
    address,
    functionName: "approve",
    account: erc20Contract.address,
    args: [spenderAddress, toWei(payableAmount.toString(), decimals)],
  });

  const response = await signer?.writeContract({
    abi: erc20ABI,
    address,
    account: erc20Contract.address,
    functionName: "approve",
    args: [spenderAddress, toWei(payableAmount.toString(), decimals)],
    gasPrice: gasEstimate,
  });

  if (!response) return;

  await provider.waitForTransactionReceipt({
    hash: response,
    confirmations: 1,
  });

  return {
    hash: response,
  };
};

export const approveErc20Token = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  address: Address,
  setApproveLoading: any,
  setIsErc20Approved: any
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc20ABI,
    address: data.tokenContractAddress as Address,
    publicClient: provider,
  });

  try {
    setApproveLoading(true);
    const response = await approveErc20TokenCallback(
      address,
      contract,
      data.selectedChain.erc20PrizetapAddr,
      data.tokenContractAddress as Address,
      provider,
      signer,
      BigInt(data.tokenAmount),
      data.tokenDecimals
    );

    setApproveLoading(false);
    setIsErc20Approved(true);

    return response;
  } catch (e: any) {
    console.log(e);
    setApproveLoading(false);
  }
};
