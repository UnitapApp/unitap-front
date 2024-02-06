import { ProviderDashboardFormDataProp } from "@/types";
import { toWei } from "@/utils/numbersBigNumber";
import {
  GetContractReturnType,
  PublicClient,
  getContract,
  Address,
  erc20Abi,
} from "viem";

import { GetWalletClientReturnType } from "wagmi/actions";

export const approveErc20TokenCallback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  spenderAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  decimals: number,
  totalAmount: string
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc20Abi,
    address: erc20Contract.address,
    functionName: "approve",
    account: address,
    args: [spenderAddress, BigInt(toWei(totalAmount.toString(), decimals))],
  });

  const response = await signer?.writeContract({
    abi: erc20Abi,
    address: erc20Contract.address,
    account: address,
    functionName: "approve",
    args: [spenderAddress, BigInt(toWei(totalAmount.toString(), decimals))],
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
  signer: GetWalletClientReturnType,
  address: Address,
  setApproveLoading: any,
  setIsErc20Approved: any
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc20Abi,
    address: data.tokenContractAddress as Address,
    client: provider,
  });

  try {
    setApproveLoading(true);
    const response = await approveErc20TokenCallback(
      address,
      contract,
      data.selectedChain.erc20PrizetapAddr,
      provider,
      signer,
      data.tokenDecimals,
      data.totalAmount
    );

    setApproveLoading(false);
    setIsErc20Approved(true);

    return response;
  } catch (e: any) {
    console.log(e);
    setApproveLoading(false);
  }
};
